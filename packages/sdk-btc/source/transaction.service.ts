import { BIP32, UUID } from "@payvo/cryptography";
import { Contracts, Exceptions, IoC, Services, Signatories } from "@payvo/sdk";
import * as bitcoin from "bitcoinjs-lib";
import { BIP32Interface } from "bitcoinjs-lib";
import coinSelect from "coinselect";

import { getNetworkConfig } from "./config";
import { BindingType } from "./constants";
import { AddressFactory } from "./address.factory";
import { BipLevel, Levels, MusigDerivationMethod, UnspentTransaction } from "./contracts";
import { LedgerService } from "./ledger.service";
import { MultiSignatureRegistrationTransaction } from "./multi-signature.contract";
import { convertBuffer } from "@payvo/helpers";
import { sign } from "bitcoinjs-message";
import { keysAndMethod, toExtPubKey } from "./multi-signature.domain";

const runWithLedgerConnectionIfNeeded = async (
	signatory: Signatories.Signatory,
	ledgerService: LedgerService,
	transport: Services.LedgerTransport,
	callback: () => Promise<Contracts.SignedTransactionData>,
): Promise<Contracts.SignedTransactionData> => {
	try {
		if (signatory.actsWithLedger()) {
			await ledgerService.connect(transport);
		}
		return await callback();
	} finally {
		if (signatory.actsWithLedger()) {
			await ledgerService.disconnect();
		}
	}
};

@IoC.injectable()
export class TransactionService extends Services.AbstractTransactionService {
	@IoC.inject(IoC.BindingType.LedgerService)
	private readonly ledgerService!: LedgerService;

	@IoC.inject(BindingType.AddressFactory)
	private readonly addressFactory!: AddressFactory;

	@IoC.inject(IoC.BindingType.AddressService)
	private readonly addressService!: Services.AddressService;

	@IoC.inject(IoC.BindingType.FeeService)
	private readonly feeService!: Services.FeeService;

	@IoC.inject(BindingType.LedgerTransport)
	private readonly transport!: Services.LedgerTransport;

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

		return await runWithLedgerConnectionIfNeeded(input.signatory, this.ledgerService, this.transport, async () => {
			const levels = this.addressFactory.getLevel(identityOptions);

			const network = getNetworkConfig(this.configRepository);

			// Compute the amount to be transferred
			const amount = this.toSatoshi(input.data.amount).toNumber();

			// Derivce account key (depth 3)
			const accountKey = await this.#getAccountKey(input.signatory, network, levels);

			// create a wallet data helper and find all used addresses
			const walledDataHelper = this.addressFactory.walletDataHelper(
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
				transaction = await this.#createTransactionLocalSigning(network, inputs, outputs);
			} else if (input.signatory.actsWithLedger()) {
				transaction = await this.ledgerService.createTransaction(network, inputs, outputs, changeAddress);
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

	public override async multiSignature(
		input: Services.MultiSignatureInput,
	): Promise<Contracts.SignedTransactionData> {
		if (!input.data.min) {
			throw new Error("Expected [input.data.min] to be defined as an integer.");
		}

		if (!input.data.numberOfSignatures) {
			throw new Error("Expected [input.data.numberOfSignatures] to be defined as an integer.");
		}

		if (!input.data.senderPublicKey) {
			throw new Error("Expected [input.data.senderPublicKey] to be defined and contain a valid derivation path.");
		}

		if (input.data.min > input.data.numberOfSignatures) {
			throw new Error("Expected [input.data.min] must be less than or equal to [input.data.numberOfSignatures].");
		}

		let senderPublicKey: string;

		// if (input.signatory.actsWithMnemonic()) {
		const network = getNetworkConfig(this.configRepository);
		const rootKey = BIP32.fromMnemonic(input.signatory.signingKey(), network);
		const accountKey = rootKey.derivePath(input.data.senderPublicKey);
		senderPublicKey = convertBuffer(accountKey.publicKey);
		// } else {
		// 	throw new Exceptions.Exception("No other signatory supported");
		// }

		const transaction: MultiSignatureRegistrationTransaction = {
			id: UUID.random(), // TODO We should aim to do this deterministic based on m, n and originator's ext public key
			senderPublicKey: senderPublicKey,
			multiSignature: {
				min: input.data.min, // m
				numberOfSignatures: input.data.numberOfSignatures, // n
				publicKeys: [toExtPubKey(accountKey, "nativeSegwitMusig", network)],
			},
			signatures: [],
		};

		// const rootKey = BIP32.fromMnemonic(input.signatory.signingKey(), getNetworkConfig(this.configRepository));
		// const accountKey = rootKey.derivePath(input.data.senderPublicKey).privateKey;

		const messageToSign = `${transaction.id}${senderPublicKey}`; // TODO Enough?
		const signature = sign(messageToSign, accountKey.privateKey!, true).toString("base64");

		const signedTransaction = {
			...transaction,
			signatures: [signature],
		};

		return this.dataTransferObjectService.signedTransaction(signedTransaction.id, signedTransaction);
	}

	async #createTransactionLocalSigning(
		network: bitcoin.networks.Network,
		inputs: any[],
		outputs: any[],
	): Promise<bitcoin.Transaction> {
		const psbt = new bitcoin.Psbt({ network });

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
			psbt.signInput(index, bitcoin.ECPair.fromPrivateKey(input.signingKey, { network })),
		);

		if (!psbt.validateSignaturesOfAllInputs()) {
			throw new Exceptions.Exception("There was a problem signing the transaction locally.");
		}
		await psbt.finalizeAllInputs();

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
			const publicKey = await this.ledgerService.getExtendedPublicKey(path);
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
			feeRate = (await this.feeService.all()).transfer.avg.toNumber();
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
		const network = getNetworkConfig(this.configRepository);

		const multiSignatureAsset: Services.MultiSignatureAsset = input.signatory.asset();

		const { accountPublicKeys, method } = keysAndMethod(multiSignatureAsset, network);

		// create a musig wallet data helper and find all used addresses
		const walledDataHelper = this.addressFactory.musigWalletDataHelper(
			multiSignatureAsset.min,
			accountPublicKeys.map((extendedPublicKey) => BIP32.fromBase58(extendedPublicKey, network)),
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
			}
		});

		const psbt = new bitcoin.Psbt({ network });
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

		const psbtBaseText = psbt.toBase64();
		console.log("base64", psbtBaseText);

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
			},
			tx.toHex(),
			// psbtBaseText, // TODO where do we return the psbt to be co-signed
		);
	}
}
