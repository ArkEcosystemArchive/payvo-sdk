import { BIP32, BIP32Interface, UUID } from "@payvo/sdk-cryptography";
import { Contracts, Exceptions, IoC, Services, Signatories } from "@payvo/sdk";
import * as bitcoin from "bitcoinjs-lib";
import { ECPair } from "ecpair";
import coinSelect from "coinselect";

import { getNetworkConfig } from "./config.js";
import { BindingType } from "./constants.js";
import { AddressFactory } from "./address.factory.js";
import { BipLevel, Levels, UnspentTransaction } from "./contracts.js";
import { LedgerService } from "./ledger.service.js";
import { MultiSignatureTransaction } from "./multi-signature.contract.js";
import { keysAndMethod, toExtPubKey } from "./multi-signature.domain.js";
import { MultiSignatureService } from "./multi-signature.service.js";
import { signatureValidator } from "./helpers.js";

const runWithLedgerConnectionIfNeeded = async (
	signatory: Signatories.Signatory,
	ledgerService: LedgerService,
	callback: () => Promise<Contracts.SignedTransactionData>,
): Promise<Contracts.SignedTransactionData> => {
	try {
		if (signatory.actsWithLedger()) {
			await ledgerService.connect();
		}

		return await callback();
	} finally {
		if (signatory.actsWithLedger()) {
			await ledgerService.disconnect();
		}
	}
};

export class TransactionService extends Services.AbstractTransactionService {
	readonly #addressFactory: AddressFactory;
	readonly #feeService: Services.FeeService;
	readonly #ledgerService: LedgerService;
	readonly #multiSignatureService: MultiSignatureService;
	#network!: bitcoin.networks.Network;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#addressFactory = container.get(BindingType.AddressFactory);
		this.#feeService = container.get(IoC.BindingType.FeeService);
		this.#ledgerService = container.get(IoC.BindingType.LedgerService);
		this.#multiSignatureService = container.get(IoC.BindingType.MultiSignatureService);
		this.#network = getNetworkConfig(this.configRepository);
	}

	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		if (!input.signatory.actsWithMultiSignature() && input.signatory.signingKey() === undefined) {
			throw new Exceptions.MissingArgument(this.constructor.name, this.transfer.name, "input.signatory");
		}

		if (
			!input.signatory.actsWithMnemonic() &&
			!input.signatory.actsWithLedger() &&
			!input.signatory.actsWithMultiSignature()
		) {
			// @TODO Add more options (wif, ledger, extended private key, etc.).
			throw new Exceptions.Exception("Need to provide a signatory that can be used for signing transactions.");
		}

		if (input.signatory.actsWithMultiSignature()) {
			return this.#transferMusig(input);
		}

		const identityOptions = input.signatory.options();
		if (identityOptions === undefined) {
			throw new Exceptions.Exception(
				"Invalid bip level requested. A valid level is required: bip44, bip49 or bip84",
			);
		}

		if (
			identityOptions.bip44 === undefined &&
			identityOptions.bip49 === undefined &&
			identityOptions.bip84 === undefined
		) {
			throw new Exceptions.Exception(
				"Invalid bip level requested. A valid level is required: bip44, bip49 or bip84",
			);
		}

		return await runWithLedgerConnectionIfNeeded(input.signatory, this.#ledgerService, async () => {
			const levels = this.#addressFactory.getLevel(identityOptions);

			// Compute the amount to be transferred
			const amount = this.toSatoshi(input.data.amount).toNumber();

			// Derivce account key (depth 3)
			const accountKey = await this.#getAccountKey(input.signatory, this.#network, levels);

			// create a wallet data helper and find all used addresses
			const walledDataHelper = this.#addressFactory.walletDataHelper(
				levels,
				this.#addressingSchema(levels),
				accountKey,
			);
			await walledDataHelper.discoverAllUsed();

			// Derive the sender address (corresponding to first address index for the wallet)
			const { address } = walledDataHelper.discoveredSpendAddresses()[0];

			// Find first unused the change address
			const changeAddress = walledDataHelper.firstUnusedChangeAddress();

			const targets = [
				{
					address: input.data.to,
					value: amount,
				},
			];

			// Figure out inputs, outputs and fees
			const feeRate = await this.#getFeeRateFromNetwork(input);
			const utxos = await walledDataHelper.unspentTransactionOutputs();
			const { inputs, outputs, fee } = await this.#selectUtxos(utxos, targets, feeRate);

			// Set change address (if any output back to the wallet)
			outputs.forEach((output) => {
				if (!output.address) {
					output.address = changeAddress.address;
				}
			});

			let transaction: bitcoin.Transaction;

			if (input.signatory.actsWithMnemonic()) {
				transaction = await this.#createTransactionLocalSigning(inputs, outputs);
			} else if (input.signatory.actsWithLedger()) {
				transaction = await this.#ledgerService.createTransaction(inputs, outputs, changeAddress);
			} else {
				throw new Exceptions.Exception("Unsupported signatory");
			}

			return this.dataTransferObjectService.signedTransaction(
				transaction.getId(),
				{
					sender: address,
					recipient: input.data.to,
					amount,
					fee,
					timestamp: new Date(),
				},
				transaction.toHex(),
			);
		});
	}

	// TODO revert to public override async multiSignature(
	public async renamedMultiSignature(input: Services.MultiSignatureInput): Promise<Contracts.SignedTransactionData> {
		if (!input.data.min) {
			throw new Error("Expected [input.data.min] to be defined as an integer.");
		}

		if (!input.data.numberOfSignatures) {
			throw new Error("Expected [input.data.numberOfSignatures] to be defined as an integer.");
		}

		if (input.data.min > input.data.numberOfSignatures) {
			throw new Error("Expected [input.data.min] must be less than or equal to [input.data.numberOfSignatures].");
		}

		if (!input.data.derivationMethod) {
			throw new Error("Expected [input.data.derivationMethod] must be present.");
		}

		// if (input.signatory.actsWithMnemonic()) {
		const rootKey = BIP32.fromMnemonic(input.signatory.signingKey(), this.#network);
		const accountKey = rootKey.derivePath(input.signatory.publicKey());
		const senderExtendedPublicKey = toExtPubKey(accountKey, input.data.derivationMethod, this.#network);

		// } else {
		// 	throw new Exceptions.Exception("No other signatory supported");
		// }

		const transaction: MultiSignatureTransaction = {
			id: UUID.random(), // TODO We should aim to do this deterministically based on m, n and originator's ext public key
			senderPublicKey: senderExtendedPublicKey,
			multiSignature: {
				min: input.data.min, // m
				numberOfSignatures: input.data.numberOfSignatures, // n
				publicKeys: [senderExtendedPublicKey],
			},
			signatures: [],
		};

		return await this.#multiSignatureService.addSignature(transaction, input.signatory);
	}

	async #createTransactionLocalSigning(inputs: any[], outputs: any[]): Promise<bitcoin.Transaction> {
		const psbt = new bitcoin.Psbt({ network: this.#network });

		inputs.forEach((input) =>
			psbt.addInput({
				hash: input.txId,
				index: input.vout,
				...input,
			}),
		);
		outputs.forEach((output) =>
			psbt.addOutput({
				address: output.address,
				value: output.value,
			}),
		);

		// Sign and verify signatures
		inputs.forEach((input, index) =>
			psbt.signInput(index, ECPair.fromPrivateKey(input.signingKey, { network: this.#network })),
		);

		if (!psbt.validateSignaturesOfAllInputs(signatureValidator)) {
			throw new Exceptions.Exception("There was a problem signing the transaction locally.");
		}

		psbt.finalizeAllInputs();

		return psbt.extractTransaction();
	}

	async #getAccountKey(
		signatory: Signatories.Signatory,
		network: bitcoin.networks.Network,
		bipLevel: Levels,
	): Promise<BIP32Interface> {
		if (signatory.actsWithMnemonic()) {
			return BIP32.fromMnemonic(signatory.signingKey(), network)
				.deriveHardened(bipLevel.purpose)
				.deriveHardened(bipLevel.coinType)
				.deriveHardened(bipLevel.account || 0);
		} else if (signatory.actsWithLedger()) {
			const path = `m/${bipLevel.purpose}'/${bipLevel.coinType}'/${bipLevel.account || 0}'`;
			const publicKey = await this.#ledgerService.getExtendedPublicKey(path);
			return BIP32.fromBase58(publicKey, network);
		}
		throw new Exceptions.Exception("Invalid signatory");
	}

	async #selectUtxos(
		utxos: UnspentTransaction[],
		targets,
		feeRate: number,
	): Promise<{ outputs: any[]; inputs: any[]; fee: number }> {
		const { inputs, outputs, fee } = coinSelect(utxos, targets, feeRate);

		if (!inputs || !outputs) {
			throw new Error("Cannot determine utxos for this transaction. Probably not enough founds.");
		}

		return { inputs, outputs, fee };
	}

	async #getFeeRateFromNetwork(input: Services.TransferInput): Promise<number> {
		let feeRate: number | undefined = input.fee;

		if (!feeRate) {
			feeRate = (await this.#feeService.all()).transfer.avg.toNumber();
		}
		return feeRate;
	}

	#addressingSchema(levels: Levels): BipLevel {
		if (levels.purpose === 44) {
			return "bip44";
		}

		if (levels.purpose === 49) {
			return "bip49";
		}

		if (levels.purpose === 84) {
			return "bip84";
		}

		throw new Exceptions.Exception(`Invalid level specified: ${levels.purpose}`);
	}

	async #transferMusig(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		const multiSignatureAsset: Services.MultiSignatureAsset = input.signatory.asset();

		const { accountExtendedPublicKeys, method } = keysAndMethod(multiSignatureAsset, this.#network);
		const accountPublicKeys = accountExtendedPublicKeys.map((extendedPublicKey) =>
			BIP32.fromBase58(extendedPublicKey, this.#network),
		);

		// create a musig wallet data helper and find all used addresses
		const walledDataHelper = this.#addressFactory.musigWalletDataHelper(
			multiSignatureAsset.min,
			accountPublicKeys,
			method,
		);
		await walledDataHelper.discoverAllUsed();

		// Derive the sender address (corresponding to first address index for the wallet)
		const { address } = walledDataHelper.discoveredSpendAddresses()[0];

		// Find first unused the change address
		const changeAddress = walledDataHelper.firstUnusedChangeAddress();

		// Compute the amount to be transferred
		const amount = this.toSatoshi(input.data.amount).toNumber();
		const targets = [
			{
				address: input.data.to,
				value: amount,
			},
		];

		// Figure out inputs, outputs and fees
		const feeRate = await this.#getFeeRateFromNetwork(input);
		const utxos = await walledDataHelper.unspentTransactionOutputs();
		const { inputs, outputs, fee } = await this.#selectUtxos(utxos, targets, feeRate);

		// Set change address (if any output back to the wallet)
		outputs.forEach((output) => {
			if (!output.address) {
				output.address = changeAddress.address;
				output.bip32Derivation = accountPublicKeys.map((pubKey) => ({
					masterFingerprint: pubKey.fingerprint,
					path: `m/${changeAddress.path}`,
					pubkey: pubKey.derivePath(changeAddress.path).publicKey,
				}));
			}
		});

		const psbt = new bitcoin.Psbt({ network: this.#network });
		inputs.forEach((input) =>
			psbt.addInput({
				hash: input.txId,
				index: input.vout,
				...input,
			}),
		);
		outputs.forEach((output) =>
			psbt.addOutput({
				address: output.address,
				value: output.value,
				...output,
			}),
		);

		const psbtBaseText = psbt.toBase64();

		// @ts-ignore
		const tx: bitcoin.Transaction = psbt.__CACHE.__TX;

		return this.dataTransferObjectService.signedTransaction(
			tx.getId(),
			{
				sender: address,
				recipient: input.data.to,
				amount,
				fee,
				timestamp: new Date(),
				multiSignatureAsset,
			},
			psbtBaseText,
		);
	}
}
