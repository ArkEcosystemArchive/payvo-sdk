import { Contracts, Exceptions, IoC, Services } from "@payvo/sdk";
import { Hash, UUID } from "@payvo/sdk-cryptography";
import { BigNumber } from "@payvo/sdk-helpers";
import { DateTime } from "@payvo/sdk-intl";
import { BN, Buffer } from "avalanche";
import { AVMAPI } from "avalanche/dist/apis/avm/index.js";
import { PlatformVMAPI } from "avalanche/dist/apis/platformvm/index.js";

import { keyPairFromMnemonic, useKeychain, usePChain, useXChain } from "./helpers.js";

export class TransactionService extends Services.AbstractTransactionService {
	#xchain!: AVMAPI;
	#pchain!: PlatformVMAPI;
	#keychain;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#xchain = useXChain(this.configRepository, this.hostSelector);
		this.#pchain = usePChain(this.configRepository, this.hostSelector);
		this.#keychain = useKeychain(this.configRepository, this.hostSelector);
	}

	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		if (input.signatory.signingKey() === undefined) {
			throw new Exceptions.MissingArgument(this.constructor.name, this.transfer.name, "input.signatory");
		}

		const child = this.#keychain.importKey(
			keyPairFromMnemonic(
				this.configRepository,
				this.hostSelector,
				input.signatory.signingKey(),
			).child.getPrivateKey(),
		);
		const keyPairAddresses = this.#keychain.getAddressStrings();
		const { utxos } = await this.#xchain.getUTXOs(child.getAddressString());
		const amount = this.toSatoshi(input.data.amount).toString();

		const signedTx = (
			await this.#xchain.buildBaseTx(
				utxos,
				new BN(amount),
				this.configRepository.get("network.meta.assetId"),
				[input.data.to],
				keyPairAddresses,
				keyPairAddresses,
				input.data.memo === undefined ? undefined : Buffer.from(input.data.memo),
			)
		).sign(this.#keychain);

		return this.dataTransferObjectService.signedTransaction(
			// @ts-ignore - feross/buffer should behave the same as nodejs/buffer
			Hash.sha256(signedTx.toBuffer()).toString("hex"),
			{
				amount,
				fee: BigNumber.make(0.001).times(1e8),
				recipient: input.data.to,
				sender: input.signatory.address(),
				timestamp: DateTime.make(),
			},
			signedTx.toString(),
		);
	}

	public override async vote(input: Services.VoteInput): Promise<Contracts.SignedTransactionData> {
		if (input.signatory.signingKey() === undefined) {
			throw new Exceptions.MissingArgument(this.constructor.name, this.vote.name, "input.signatory");
		}

		const { child } = this.#keychain.importKey(
			keyPairFromMnemonic(
				this.configRepository,
				this.hostSelector,
				input.signatory.signingKey(),
			).child.getPrivateKey(),
		);
		const keyPairAddresses = this.#keychain.getAddressStrings();
		const { utxos } = await this.#pchain.getUTXOs(child.getAddressString());

		const signedTx = (
			await this.#pchain.buildAddDelegatorTx(
				utxos,
				keyPairAddresses,
				keyPairAddresses,
				keyPairAddresses,
				input.data.votes[0].id,
				// @ts-ignore
				"START-TIME",
				"END-TIME",
				"STAKE-AMOUNT",
				keyPairAddresses,
			)
		).sign(this.#keychain);

		return this.dataTransferObjectService.signedTransaction(
			UUID.random(),
			{
				amount: 0,
				fee: 0,
				recipient: input.signatory.address(),
				sender: input.signatory.address(),
			},
			signedTx.toString(),
		);
	}
}
