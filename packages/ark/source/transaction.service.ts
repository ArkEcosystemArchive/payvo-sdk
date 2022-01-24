import { Contracts, Helpers, IoC, Services, Signatories } from "@payvo/sdk";
import { BIP39 } from "@payvo/sdk-cryptography";
import { BigNumber } from "@payvo/sdk-helpers";

import { BindingType } from "./coin.contract.js";
import { applyCryptoConfiguration } from "./config.js";
import { Identities, Interfaces, Transactions } from "./crypto/index.js";
import { MultiSignatureSigner } from "./multi-signature.signer.js";

export class TransactionService extends Services.AbstractTransactionService {
	readonly #ledgerService!: Services.LedgerService;
	readonly #addressService!: Services.AddressService;
	readonly #publicKeyService!: Services.PublicKeyService;
	readonly #multiSignatureService!: Services.MultiSignatureService;
	readonly #multiSignatureSigner!: IoC.Factory<MultiSignatureSigner>;

	// @TODO: remove or inject
	#peer!: string;
	#configCrypto!: { crypto: Interfaces.NetworkConfig; height: number };

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#ledgerService = container.get(IoC.BindingType.LedgerService);
		this.#addressService = container.get(IoC.BindingType.AddressService);
		this.#publicKeyService = container.get(IoC.BindingType.PublicKeyService);
		this.#multiSignatureService = container.get(IoC.BindingType.MultiSignatureService);
		this.#multiSignatureSigner = container.factory(MultiSignatureSigner);

		this.#peer = Helpers.randomHostFromConfig(this.configRepository);
		this.#configCrypto = {
			crypto: container.get(BindingType.Crypto),
			height: container.get(BindingType.Height),
		};
	}

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
				min: data.min,
				publicKeys: data.publicKeys,
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

	public override async estimateExpiration(value?: string): Promise<string | undefined> {
		const { data: blockchain } = (await this.httpClient.get(`${this.#peer}/blockchain`)).json();
		const { data: configuration } = (await this.httpClient.get(`${this.#peer}/node/configuration`)).json();

		return BigNumber.make(blockchain.block.height)
			.plus((value ? Number(value) : 5) * configuration.constants.activeDelegates)
			.toString();
	}

	async #createFromData(
		type: string,
		input: Services.TransactionInputs,
		callback?: Function,
	): Promise<Contracts.SignedTransactionData> {
		applyCryptoConfiguration(this.#configCrypto);

		let address: string | undefined;
		let senderPublicKey: string | undefined;

		const transaction = Transactions.BuilderFactory[type]();

		if (input.signatory.actsWithMnemonic() || input.signatory.actsWithConfirmationMnemonic()) {
			address = (await this.#addressService.fromMnemonic(input.signatory.signingKey())).address;
			senderPublicKey = (await this.#publicKeyService.fromMnemonic(input.signatory.signingKey())).publicKey;
		}

		if (input.signatory.actsWithSecret() || input.signatory.actsWithConfirmationSecret()) {
			address = (await this.#addressService.fromSecret(input.signatory.signingKey())).address;
			senderPublicKey = (await this.#publicKeyService.fromSecret(input.signatory.signingKey())).publicKey;
		}

		if (input.signatory.actsWithWIF() || input.signatory.actsWithConfirmationWIF()) {
			address = (await this.#addressService.fromWIF(input.signatory.signingKey())).address;
			senderPublicKey = (await this.#publicKeyService.fromWIF(input.signatory.signingKey())).publicKey;
		}

		if (input.signatory.actsWithMultiSignature()) {
			address = (
				await this.#addressService.fromMultiSignature({
					min: input.signatory.asset().min,
					publicKeys: input.signatory.asset().publicKeys,
				})
			).address;
		}

		if (input.signatory.actsWithLedger()) {
			await this.#ledgerService.connect();

			senderPublicKey = await this.#ledgerService.getPublicKey(input.signatory.signingKey());
			address = (await this.#addressService.fromPublicKey(senderPublicKey)).address;
		}

		if (senderPublicKey) {
			transaction.senderPublicKey(senderPublicKey);
		}

		if (input.nonce) {
			transaction.nonce(input.nonce);
		} else {
			const wallet = await this.clientService.wallet({ type: "address", value: address! });

			transaction.nonce(wallet.nonce().plus(1).toFixed(0));
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
				let estimatedExpiration: string | undefined;

				if (
					input.signatory.actsWithMultiSignature() ||
					input.signatory.hasMultiSignature() ||
					type === "multiSignature"
				) {
					estimatedExpiration = await this.estimateExpiration("211");
				} else {
					estimatedExpiration = await this.estimateExpiration("5");
				}

				if (estimatedExpiration) {
					transaction.expiration(Number.parseInt(estimatedExpiration));
				}
			}
		} catch {
			// If we fail to set the expiration we'll still continue.
		}

		if (callback) {
			callback({ data: input.data, transaction });
		}

		if (input.signatory.actsWithMultiSignature()) {
			const transactionWithSignature = this.#multiSignatureSigner().sign(transaction, input.signatory.asset());

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
					min: input.data.min,
					publicKeys: input.data.publicKeys,
				},
				input.signatory,
				senderPublicKey,
			);
		}

		if (input.signatory.actsWithLedger()) {
			transaction.data.signature = await this.#ledgerService.signTransaction(
				input.signatory.signingKey(),
				Transactions.Serializer.getBytes(transaction.data, {
					excludeSecondSignature: true,
					excludeSignature: true,
				}),
			);

			await this.#ledgerService.disconnect();
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

		if (input.signatory.actsWithConfirmationSecret()) {
			transaction.sign(input.signatory.signingKey());
			transaction.secondSign(input.signatory.confirmKey());
		}

		const signedTransaction = transaction.build().toJson();

		return this.dataTransferObjectService.signedTransaction(signedTransaction.id, signedTransaction);
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

		return this.#multiSignatureService.addSignature(struct, signatory);
	}
}
