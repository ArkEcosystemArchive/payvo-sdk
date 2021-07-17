import { Contracts, IoC, Services } from "@payvo/sdk";
import { getAddressFromBase32Address } from "@liskhq/lisk-cryptography";
import { getBytes, signTransaction, signMultiSignatureTransaction } from "@liskhq/lisk-transactions-beta";
import { convertBuffer, convertBufferList, convertString, convertStringList } from "./multi-signature.domain";
import { DateTime } from "@payvo/intl";

@IoC.injectable()
export class TransactionService extends Services.AbstractTransactionService {
	@IoC.inject(IoC.BindingType.ClientService)
	private readonly clientService!: Services.ClientService;

	@IoC.inject(IoC.BindingType.MultiSignatureService)
	private readonly multiSignatureService!: Services.MultiSignatureService;

	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData(
			"token:transfer",
			{
				amount: BigInt(this.toSatoshi(input.data.amount).toString()),
				recipientAddress: getAddressFromBase32Address(input.data.to),
				data: input.data.memo || "",
			},
			input,
		);
	}

	public override async delegateRegistration(
		input: Services.DelegateRegistrationInput,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData(
			"dpos:registerDelegate",
			{
				username: input.data.username,
			},
			input,
		);
	}

	public override async vote(input: Services.VoteInput): Promise<Contracts.SignedTransactionData> {
		const votes: {
			delegateAddress: Buffer;
			amount: BigInt;
		}[] = [];

		if (Array.isArray(input.data.votes)) {
			for (const vote of input.data.votes) {
				votes.push({
					delegateAddress: getAddressFromBase32Address(vote.id),
					amount: this.#normaliseVoteAmount(vote.amount),
				});
			}
		}

		if (Array.isArray(input.data.unvotes)) {
			for (const unvote of input.data.unvotes) {
				votes.push({
					delegateAddress: getAddressFromBase32Address(unvote.id),
					amount: this.#normaliseVoteAmount(unvote.amount),
				});
			}
		}

		return this.#createFromData("dpos:voteDelegate", { votes }, input);
	}

	public override async multiSignature(
		input: Services.MultiSignatureInput,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData(
			"keys:registerMultisignatureGroup",
			{
				numberOfSignatures: input.data.numberOfSignatures,
				mandatoryKeys: convertStringList(input.data.mandatoryKeys),
				optionalKeys: convertStringList(input.data.optionalKeys),
			},
			input,
		);
	}

	async #createFromData(
		type: string,
		asset: Record<string, any>,
		input: Services.TransactionInput,
	): Promise<Contracts.SignedTransactionData> {
		let signedTransaction: any;
		let nonce: BigInt | undefined = undefined;
		let wallet: Contracts.WalletData | undefined;

		try {
			wallet = await this.clientService.wallet(input.signatory.address());

			nonce = BigInt(wallet.nonce().toString());
		} catch {
			nonce = BigInt(0);
		}

		const { assetSchema, moduleAssetId } = this.configRepository.get<object>("network.meta.assets")[type];

		const isMultiSignatureRegistration = moduleAssetId === "4:0";

		if (wallet?.isMultiSignature() || isMultiSignatureRegistration) {
			return this.#handleMultiSignature({ asset, assetSchema, isMultiSignatureRegistration, input, type });
		}

		signedTransaction = signTransaction(
			assetSchema,
			{
				...(await this.#buildTransactionObject(input, type)),
				senderPublicKey: this.#senderPublicKey(input),
				asset,
			},
			this.#networkIdentifier(),
			input.signatory.signingKey(),
		);

		if (input.signatory.actsWithSecondaryMnemonic()) {
			signedTransaction = await this.multiSignatureService.addSignature(signedTransaction, input.signatory);
		}

		// @TODO: add this based on the type of transaction that is being signed
		return this.#transform(assetSchema, signedTransaction, {
			senderId: convertBuffer(signedTransaction.senderPublicKey),
			recipientId: signedTransaction.asset.recipientAddress,
			amount: signedTransaction.asset.amount,
			fee: signedTransaction.fee,
			timestamp: DateTime.make(),
			...signedTransaction,
		});
	}

	async #handleMultiSignature({
		asset,
		assetSchema,
		isMultiSignatureRegistration,
		input,
		type,
	}): Promise<Contracts.SignedTransactionData> {
		const keys = {
			mandatoryKeys: isMultiSignatureRegistration
				? asset.mandatoryKeys
				: // @ts-ignore
				  convertStringList(wallet?.multiSignature().mandatoryKeys),
			optionalKeys: isMultiSignatureRegistration
				? asset.optionalKeys
				: // @ts-ignore
				  convertStringList(wallet?.multiSignature().optionalKeys),
		};

		let signedTransaction: any = signMultiSignatureTransaction(
			assetSchema,
			{
				...(await this.#buildTransactionObject(input, type)),
				asset: isMultiSignatureRegistration
					? {
							numberOfSignatures: asset.numberOfSignatures,
							optionalKeys: asset.optionalKeys,
							mandatoryKeys: asset.mandatoryKeys,
					  }
					: asset,
				signatures: [],
			},
			this.#networkIdentifier(),
			input.signatory.signingKey(),
			keys,
			isMultiSignatureRegistration,
		);

		const transactionKeys = {
			mandatoryKeys: convertBufferList(keys.mandatoryKeys ?? []),
			optionalKeys: convertBufferList(keys.optionalKeys ?? []),
		};

		const needsDoubleSign = [...transactionKeys.mandatoryKeys, ...transactionKeys.optionalKeys].includes(
			input.signatory.publicKey(),
		);

		if (isMultiSignatureRegistration && needsDoubleSign) {
			signedTransaction = signMultiSignatureTransaction(
				assetSchema,
				{
					...(await this.#buildTransactionObject(input, type)),
					asset: signedTransaction.asset,
					signatures: signedTransaction.signatures,
				},
				this.#networkIdentifier(),
				input.signatory.signingKey(),
				keys,
				isMultiSignatureRegistration,
			);
		}

		return this.#transform(assetSchema, signedTransaction, {
			moduleID: signedTransaction.moduleID,
			assetID: signedTransaction.assetID,
			senderPublicKey: convertBuffer(signedTransaction.senderPublicKey),
			nonce: signedTransaction.nonce.toString(),
			fee: signedTransaction.fee.toString(),
			signatures: convertBufferList(signedTransaction.signatures),
			// @TODO
			asset: isMultiSignatureRegistration
				? {
						numberOfSignatures: signedTransaction.asset.numberOfSignatures,
						mandatoryKeys: convertBufferList(keys.mandatoryKeys),
						optionalKeys: convertBufferList(keys.optionalKeys),
				  }
				: {
						amount: signedTransaction.asset.amount.toString(),
						recipientAddress: signedTransaction.asset.recipientAddress,
						data: signedTransaction.asset.data,
				  },
			id: convertBuffer(signedTransaction.id),
		});
	}

	#assets(): object {
		return this.configRepository.get<object>("network.meta.assets");
	}

	#networkIdentifier(): Buffer {
		return convertString(this.configRepository.get<string>("network.meta.networkId"));
	}

	#senderPublicKey(input: Services.TransactionInput): Buffer {
		return convertString(input.signatory.publicKey());
	}

	async #buildTransactionObject(input: Services.TransactionInput, type: string): Promise<object> {
		let nonce: BigInt | undefined = undefined;

		try {
			const wallet: Contracts.WalletData = await this.clientService.wallet(input.signatory.address());

			nonce = BigInt(wallet.nonce().toString());
		} catch {
			nonce = BigInt(0);
		}

		const { assetID, moduleID } = this.#assets()[type];

		return {
			moduleID,
			assetID,
			nonce,
			// @TODO: The estimates are currently under processing. Please retry in 30 seconds.
			// https://testnet-service.lisk.io/api/v2/fees
			fee: BigInt(207000),
			senderPublicKey: this.#senderPublicKey(input),
		};
	}

	#transform(schema, data, transaction): Contracts.SignedTransactionData {
		return this.dataTransferObjectService.signedTransaction(
			convertBuffer(data.id),
			transaction,
			getBytes(schema, data).toString("hex"),
		);
	}

	#normaliseVoteAmount(value: number): BigInt {
		if (typeof value === "number" && !isNaN(value)) {
			if (Number.isInteger(value)) {
				if (value % 10 === 0) {
					return BigInt(this.bigNumberService.make(value).toSatoshi().toString());
				}
			}
		}

		throw new Error(`The value [${value}] is not a multiple of 10.`);
	}
}
