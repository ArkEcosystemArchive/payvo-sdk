import { Identities, Interfaces, Transactions } from "@arkecosystem/crypto";
import { Contracts, Exceptions, Helpers, IoC, Services, Signatories } from "@payvo/sdk";
import { BIP39 } from "@payvo/cryptography";
import { BigNumber } from "@payvo/helpers";
import LedgerTransportNodeHID from "@ledgerhq/hw-transport-node-hid-singleton";

import { BindingType } from "./coin.contract";
import { applyCryptoConfiguration } from "./config";
import { MultiSignatureSigner } from "./multi-signature.signer";

@IoC.injectable()
export class TransactionService extends Services.AbstractTransactionService {
	@IoC.inject(IoC.BindingType.LedgerService)
	private readonly ledgerService!: Services.LedgerService;

	@IoC.inject(IoC.BindingType.AddressService)
	private readonly addressService!: Services.AddressService;

	@IoC.inject(IoC.BindingType.PublicKeyService)
	private readonly publicKeyService!: Services.PublicKeyService;

	@IoC.inject(IoC.BindingType.MultiSignatureService)
	private readonly multiSignatureService!: Services.MultiSignatureService;

	@IoC.inject(BindingType.MultiSignatureSigner)
	private readonly multiSignatureSigner!: MultiSignatureSigner;

	@IoC.inject(BindingType.Crypto)
	private readonly packageCrypto!: Interfaces.NetworkConfig;

	@IoC.inject(BindingType.Height)
	private readonly packageHeight!: number;

	// @TODO: remove or inject
	#peer!: string;
	#configCrypto!: { crypto: Interfaces.NetworkConfig; height: number };

	/**
	 * @inheritDoc
	 *
	 * @musig
	 * @ledgerX
	 * @ledgerS
	 */
	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("transfer", input, ({ transaction, data }) => {
			transaction.recipientId(data.to);

			if (data.memo) {
				transaction.vendorField(data.memo);
			}
		});
	}

	public override async secondSignature(
		input: Services.SecondSignatureInput,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("secondSignature", input, ({ transaction, data }) =>
			transaction.signatureAsset(BIP39.normalize(data.mnemonic)),
		);
	}

	public override async delegateRegistration(
		input: Services.DelegateRegistrationInput,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("delegateRegistration", input, ({ transaction, data }) =>
			transaction.usernameAsset(data.username),
		);
	}

	/**
	 * @inheritDoc
	 *
	 * @musig
	 * @ledgerX
	 * @ledgerS
	 */
	public override async vote(input: Services.VoteInput): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData(
			"vote",
			input,
			({
				transaction,
				data,
			}: {
				transaction: any;
				data: {
					votes: {
						id: string;
						amount: BigNumber;
					}[];
					unvotes: {
						id: string;
						amount: BigNumber;
					}[];
				};
			}) => {
				const votes: string[] = [];

				if (Array.isArray(data.unvotes)) {
					for (const unvote of data.unvotes) {
						votes.push(`-${unvote.id}`);
					}
				}

				if (Array.isArray(data.votes)) {
					for (const vote of data.votes) {
						votes.push(`+${vote.id}`);
					}
				}

				transaction.votesAsset(votes);
			},
		);
	}

	/**
	 * @inheritDoc
	 *
	 * @musig
	 * @ledgerX
	 */
	public override async multiSignature(
		input: Services.MultiSignatureInput,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("multiSignature", input, ({ transaction, data }) => {
			if (data.senderPublicKey) {
				transaction.senderPublicKey(data.senderPublicKey);
			}

			transaction.multiSignatureAsset({
				publicKeys: data.publicKeys,
				min: data.min,
			});
		});
	}

	/**
	 * @inheritDoc
	 *
	 * @musig
	 * @ledgerX
	 * @ledgerS
	 */
	public override async ipfs(input: Services.IpfsInput): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("ipfs", input, ({ transaction, data }) => transaction.ipfsAsset(data.hash));
	}

	/**
	 * @inheritDoc
	 *
	 * @musig
	 */
	public override async multiPayment(input: Services.MultiPaymentInput): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("multiPayment", input, ({ transaction, data }) => {
			for (const payment of data.payments) {
				transaction.addPayment(payment.to, this.toSatoshi(payment.amount).toString());
			}

			if (data.memo) {
				transaction.vendorField(data.memo);
			}
		});
	}

	public override async delegateResignation(
		input: Services.DelegateResignationInput,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("delegateResignation", input);
	}

	public override async htlcLock(input: Services.HtlcLockInput): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("htlcLock", input, ({ transaction, data }) => {
			transaction.amount(this.toSatoshi(data.amount).toString());

			transaction.recipientId(data.to);

			transaction.htlcLockAsset({
				secretHash: data.secretHash,
				expiration: data.expiration,
			});
		});
	}

	public override async htlcClaim(input: Services.HtlcClaimInput): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("htlcClaim", input, ({ transaction, data }) =>
			transaction.htlcClaimAsset({
				lockTransactionId: data.lockTransactionId,
				unlockSecret: data.unlockSecret,
			}),
		);
	}

	public override async htlcRefund(input: Services.HtlcRefundInput): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("htlcRefund", input, ({ transaction, data }) =>
			transaction.htlcRefundAsset({
				lockTransactionId: data.lockTransactionId,
			}),
		);
	}

	public override async estimateExpiration(value?: string): Promise<string | undefined> {
		const { data: blockchain } = (await this.httpClient.get(`${this.#peer}/blockchain`)).json();
		const { data: configuration } = (await this.httpClient.get(`${this.#peer}/node/configuration`)).json();

		return BigNumber.make(blockchain.block.height)
			.plus(value || 5 * configuration.constants.activeDelegates)
			.toString();
	}

	@IoC.postConstruct()
	private onPostConstruct(): void {
		this.#peer = Helpers.randomHostFromConfig(this.configRepository);
		this.#configCrypto = { crypto: this.packageCrypto, height: this.packageHeight };
	}

	async #createFromData(
		type: string,
		input: Services.TransactionInputs,
		callback?: Function,
	): Promise<Contracts.SignedTransactionData> {
		applyCryptoConfiguration(this.#configCrypto);

		try {
			let address: string | undefined;
			let senderPublicKey: string | undefined;

			const transaction = Transactions.BuilderFactory[type]().version(2);

			if (input.signatory.actsWithMnemonic() || input.signatory.actsWithConfirmationMnemonic()) {
				address = (await this.addressService.fromMnemonic(input.signatory.signingKey())).address;
				senderPublicKey = (await this.publicKeyService.fromMnemonic(input.signatory.signingKey())).publicKey;
			}

			if (input.signatory.actsWithSecret()) {
				address = (await this.addressService.fromSecret(input.signatory.signingKey())).address;
				senderPublicKey = (await this.publicKeyService.fromSecret(input.signatory.signingKey())).publicKey;
			}

			if (input.signatory.actsWithWIF() || input.signatory.actsWithConfirmationWIF()) {
				address = (await this.addressService.fromWIF(input.signatory.signingKey())).address;
				senderPublicKey = (await this.publicKeyService.fromWIF(input.signatory.signingKey())).publicKey;
			}

			if (input.signatory.actsWithMultiSignature()) {
				address = (
					await this.addressService.fromMultiSignature(
						input.signatory.asset().min,
						input.signatory.asset().publicKeys,
					)
				).address;
			}

			if (input.signatory.actsWithLedger()) {
				await this.ledgerService.connect(LedgerTransportNodeHID);

				senderPublicKey = await this.ledgerService.getPublicKey(input.signatory.signingKey());
				address = (await this.addressService.fromPublicKey(senderPublicKey)).address;
			}

			if (senderPublicKey) {
				transaction.senderPublicKey(senderPublicKey);
			}

			if (input.nonce) {
				transaction.nonce(input.nonce);
			} else {
				const wallet = await this.clientService.wallet(address!);

				transaction.nonce(wallet.nonce().plus(1).toFixed());
			}

			if (input.data && input.data.amount) {
				transaction.amount(this.toSatoshi(input.data.amount).toString());
			}

			if (input.fee) {
				transaction.fee(this.toSatoshi(input.fee).toString());
			}

			try {
				if (input.data && input.data.expiration) {
					transaction.expiration(input.data.expiration);
				} else {
					const estimatedExpiration = await this.estimateExpiration();

					if (estimatedExpiration) {
						transaction.expiration(parseInt(estimatedExpiration));
					}
				}
			} catch {
				// If we fail to set the expiration we'll still continue.
			}

			if (callback) {
				callback({ transaction, data: input.data });
			}

			if (input.signatory.actsWithMultiSignature()) {
				const transactionWithSignature = this.multiSignatureSigner.sign(transaction, input.signatory.asset());

				return this.dataTransferObjectService.signedTransaction(
					transactionWithSignature.id!,
					transactionWithSignature,
				);
			}

			if (input.signatory.hasMultiSignature()) {
				return this.#addSignature(transaction, input.signatory.multiSignature()!, input.signatory);
			}

			if (type === "multiSignature") {
				return this.#addSignature(
					transaction,
					{
						publicKeys: input.data.publicKeys,
						min: input.data.min,
					},
					input.signatory,
					senderPublicKey,
				);
			}

			if (input.signatory.actsWithLedger()) {
				transaction.data.signature = await this.ledgerService.signTransaction(
					input.signatory.signingKey(),
					Transactions.Serializer.getBytes(transaction.data, {
						excludeSignature: true,
						excludeSecondSignature: true,
					}),
				);

				await this.ledgerService.disconnect();
			}

			if (input.signatory.actsWithMnemonic()) {
				transaction.sign(input.signatory.signingKey());
			}

			if (input.signatory.actsWithConfirmationMnemonic()) {
				transaction.sign(input.signatory.signingKey());
				transaction.secondSign(input.signatory.confirmKey());
			}

			if (input.signatory.actsWithWIF()) {
				transaction.signWithWif(input.signatory.signingKey());
			}

			if (input.signatory.actsWithConfirmationWIF()) {
				transaction.signWithWif(input.signatory.signingKey());
				transaction.secondSignWithWif(input.signatory.confirmKey());
			}

			if (input.signatory.actsWithSecret()) {
				transaction.sign(input.signatory.signingKey());
			}

			const signedTransaction = transaction.build().toJson();

			return this.dataTransferObjectService.signedTransaction(signedTransaction.id, signedTransaction);
		} catch (error) {
			throw new Exceptions.CryptoException(error);
		}
	}

	async #addSignature(
		transaction,
		multiSignature: Interfaces.IMultiSignatureAsset,
		signatory: Signatories.Signatory,
		senderPublicKey?: string,
	): Promise<Contracts.SignedTransactionData> {
		transaction.data.signatures = [];

		if (senderPublicKey) {
			transaction.senderPublicKey(senderPublicKey);
		} else {
			transaction.senderPublicKey(Identities.PublicKey.fromMultiSignatureAsset(multiSignature));
		}

		const struct = transaction.getStruct();
		struct.multiSignature = multiSignature;

		return this.multiSignatureService.addSignature(struct, signatory);
	}
}
