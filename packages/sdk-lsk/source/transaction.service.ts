import { Contracts, Exceptions, Helpers, IoC, Services } from "@payvo/sdk";
import { BIP39 } from "@payvo/cryptography";
import LedgerTransportNodeHID from "@ledgerhq/hw-transport-node-hid-singleton";
import {
	castVotes,
	registerDelegate,
	registerMultisignature,
	registerSecondPassphrase,
	TransactionJSON,
	transfer,
	utils,
} from "@liskhq/lisk-transactions";
import { validateBase32Address } from "@liskhq/lisk-cryptography";
import { signTransaction } from "@liskhq/lisk-transactions-beta";

@IoC.injectable()
export class TransactionService extends Services.AbstractTransactionService {
	#network!: string;

	@IoC.inject(IoC.BindingType.LedgerService)
	private readonly ledgerService!: Services.LedgerService;

	@IoC.inject(IoC.BindingType.AddressService)
	private readonly addressService!: Services.AddressService;

	@IoC.postConstruct()
	private onPostConstruct(): void {
		this.#network = this.configRepository.get<string>("network.meta.networkId");
	}

	/**
	 * @inheritDoc
	 *
	 * @ledgerX
	 * @ledgerS
	 */
	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		if (validateBase32Address(input.data.to)) {
			return this.#createFromDataWithBeta("transfer", {
				...input,
				data: {
					amount: this.toSatoshi(input.data.amount).toString(),
					recipientId: input.data.to,
					data: input.data.memo,
				},
			});
		}

		return this.#createFromData("transfer", {
			...input,
			data: {
				amount: this.toSatoshi(input.data.amount).toString(),
				recipientId: input.data.to,
				data: input.data.memo,
			},
		});
	}

	public override async secondSignature(
		input: Services.SecondSignatureInput,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("registerSecondPassphrase", {
			...input,
			data: {
				secondMnemonic: BIP39.normalize(input.data.mnemonic),
			},
		});
	}

	public override async delegateRegistration(
		input: Services.DelegateRegistrationInput,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("registerDelegate", input);
	}

	/**
	 * @inheritDoc
	 *
	 * @ledgerX
	 * @ledgerS
	 */
	public override async vote(input: Services.VoteInput): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("castVotes", input);
	}

	public override async multiSignature(
		input: Services.MultiSignatureInput,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("registerMultisignature", {
			...input,
			data: {
				keysgroup: input.data.publicKeys,
				lifetime: input.data.lifetime,
				minimum: input.data.min,
			},
		});
	}

	async #createFromData(
		type: string,
		input: Contracts.KeyValuePair,
		callback?: Function,
	): Promise<Contracts.SignedTransactionData> {
		// try {
		const struct: Contracts.KeyValuePair = { ...input.data };

		struct.networkIdentifier = this.#network;

		if (callback) {
			callback({ struct });
		}

		console.log(struct);

		const transactionSigner = {
			transfer,
			registerSecondPassphrase,
			registerDelegate,
			castVotes,
			registerMultisignature,
		}[type]!;

		if (input.signatory.actsWithLedger()) {
			await this.ledgerService.connect(LedgerTransportNodeHID);

			const structTransaction = transactionSigner(struct as any) as unknown as TransactionJSON;
			// @ts-ignore - LSK uses JS so they don't encounter these type errors
			structTransaction.senderPublicKey = await this.ledgerService.getPublicKey(input.signatory.signingKey());

			if (!structTransaction.recipientId) {
				// @ts-ignore - LSK uses JS so they don't encounter these type errors
				structTransaction.recipientId = (
					await this.addressService.fromPublicKey(structTransaction.senderPublicKey)
				).address;
			}

			// @ts-ignore - LSK uses JS so they don't encounter these type errors
			structTransaction.signature = await this.ledgerService.signTransaction(
				input.signatory.signingKey(),
				utils.getTransactionBytes(structTransaction),
			);
			// @ts-ignore - LSK uses JS so they don't encounter these type errors
			structTransaction.id = utils.getTransactionId(structTransaction as any);

			await this.ledgerService.disconnect();

			return this.dataTransferObjectService.signedTransaction(
				structTransaction.id,
				structTransaction,
				structTransaction,
			);
		}

		if (input.signatory.signingKey()) {
			struct.passphrase = input.signatory.signingKey();
		}

		if (input.signatory.actsWithSecondaryMnemonic()) {
			struct.secondPassphrase = input.signatory.confirmKey();
		}

		const signedTransaction: any = transactionSigner(struct as any);

		return this.dataTransferObjectService.signedTransaction(
			signedTransaction.id,
			signedTransaction,
			signedTransaction,
		);
		// } catch (error) {
		// 	throw new Exceptions.CryptoException(error);
		// }
	}

	async #createFromDataWithBeta(
		type: string,
		input: Contracts.KeyValuePair,
		callback?: Function,
	): Promise<Contracts.SignedTransactionData> {
		const signedTransaction: any = signTransaction(
			{
				$id: "lisk/transfer-asset",
				title: "Transfer transaction asset",
				type: "object",
				required: [["amount", "recipientAddress", "data"]],
				properties: {
					amount: {
						dataType: "uint64",
						fieldNumber: 1,
					},
					recipientAddress: {
						dataType: "bytes",
						fieldNumber: 2,
						minLength: 20,
						maxLength: 20,
					},
					data: {
						dataType: "bytes",
						fieldNumber: 3,
						minLength: 0,
						maxLength: 64,
					},
				},
			},
			{
				amount: input.data.amount,
				recipientAddress: input.data.recipientId,
				data: input.data.data,
				moduleID: 2,
				assetID: 0,
				nonce: 1,
				fee: 1e8.toString(),
				senderPublicKey: input.signatory.publicKey(),
			},
			Buffer.from("01e47ba4e3e57981642150f4b45f64c2160c10bac9434339888210a4fa5df097", "hex"),
			input.signatory.signingKey(),
		);

		return this.dataTransferObjectService.signedTransaction(
			signedTransaction.id,
			signedTransaction,
			signedTransaction,
		);
	}
}
