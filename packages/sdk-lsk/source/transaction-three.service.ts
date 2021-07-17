import { Contracts, IoC, Services } from "@payvo/sdk";
import { getAddressFromBase32Address } from "@liskhq/lisk-cryptography";
import { getBytes, signTransaction, signMultiSignatureTransaction } from "@liskhq/lisk-transactions-beta";
import {
	convertBuffer,
	convertBufferList,
	convertString,
	convertStringList,
	findNonEmptySignatureIndices,
	getKeys,
	isTransactionFullySigned,
} from "./multi-signature.domain";
import { DateTime } from "@payvo/intl";

@IoC.injectable()
export class TransactionService extends Services.AbstractTransactionService {
	@IoC.inject(IoC.BindingType.ClientService)
	private readonly clientService!: Services.ClientService;

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
		const normaliseAmount = (value: number): BigInt => {
			if (typeof value === "number" && !isNaN(value)) {
				if (Number.isInteger(value)) {
					if (value % 10 === 0) {
						return BigInt(this.bigNumberService.make(value).toSatoshi().toString());
					}
				}
			}

			throw new Error(`The value [${value}] is not a multiple of 10.`);
		};

		const votes: {
			delegateAddress: Buffer;
			amount: BigInt;
		}[] = [];

		if (Array.isArray(input.data.votes)) {
			for (const vote of input.data.votes) {
				votes.push({
					delegateAddress: getAddressFromBase32Address(vote.id),
					amount: normaliseAmount(vote.amount),
				});
			}
		}

		if (Array.isArray(input.data.unvotes)) {
			for (const unvote of input.data.unvotes) {
				votes.push({
					delegateAddress: getAddressFromBase32Address(unvote.id),
					amount: normaliseAmount(unvote.amount),
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

	public override async multiSign(
		transaction: Contracts.SignedTransactionData,
		input: Services.TransactionInputs,
		options?: { actsWithSecondSignature: boolean },
	): Promise<Contracts.SignedTransactionData> {
		const transactionObject = transaction.data();
		const isMultiSignatureRegistration = transactionObject.moduleID === 4;

		// @TODO
		const { assetSchema } = this.#assets()[
			isMultiSignatureRegistration
				? "keys:registerMultisignatureGroup"
				: "token:transfer"
		];

		let wallet: Contracts.WalletData;

		if (isMultiSignatureRegistration) {
			wallet = await this.clientService.wallet(input.signatory.address());
		} else {
			// @TODO
			wallet = (await this.clientService.wallets({
				publicKey: transactionObject.senderPublicKey,
			})).first();
		}

		const { mandatoryKeys, optionalKeys } = getKeys({
			senderWallet: wallet,
			transaction: transactionObject,
			isMultiSignatureRegistration,
		});

		// @TODO
		const { assetID, moduleID } = this.#assets()[
			isMultiSignatureRegistration
				? "keys:registerMultisignatureGroup"
				: "token:transfer"
		];

		const transactionWithSignature: any = signMultiSignatureTransaction(
			assetSchema,
			{
				moduleID,
				assetID,
				nonce: BigInt(`${transactionObject.nonce}`),
				fee: BigInt(`${transactionObject.fee}`),
				senderPublicKey: convertString(transactionObject.senderPublicKey),
				// @TODO
				asset: isMultiSignatureRegistration ? {
					numberOfSignatures: transactionObject.asset.numberOfSignatures,
					mandatoryKeys: convertStringList(transactionObject.asset.mandatoryKeys),
					optionalKeys: convertStringList(transactionObject.asset.optionalKeys),
				} : {
					amount: BigInt(`${transactionObject.asset.amount}`),
					recipientAddress: transactionObject.asset.recipientAddress,
					data: transactionObject.asset.data,
				},
				signatures: convertStringList(transactionObject.signatures),
			},
			this.#networkIdentifier(),
			options?.actsWithSecondSignature ? input.signatory.confirmKey() : input.signatory.signingKey(),
			{
				mandatoryKeys: convertStringList(mandatoryKeys),
				optionalKeys: convertStringList(optionalKeys),
			},
			isMultiSignatureRegistration,
		);

		if (isTransactionFullySigned(wallet, transactionObject)) {
			const emptySignatureIndices = findNonEmptySignatureIndices(transactionObject.signatures);

			for (let index = 0; index < emptySignatureIndices.length; index++) {
				transactionWithSignature.signatures[index] = Buffer.from("");
			}
		}

		// @TODO: add this based on the type of transaction that is being signed
		return this.#transform(assetSchema, transactionWithSignature, {
			moduleID: transactionWithSignature.moduleID,
			assetID: transactionWithSignature.assetID,
			senderPublicKey: convertBuffer(transactionWithSignature.senderPublicKey),
			nonce: transactionWithSignature.nonce.toString(),
			fee: transactionWithSignature.fee.toString(),
			signatures: convertBufferList(transactionWithSignature.signatures),
			// @TODO
			asset: isMultiSignatureRegistration ? {
				numberOfSignatures: transactionWithSignature.asset.numberOfSignatures,
				mandatoryKeys: convertBufferList(transactionWithSignature.asset.mandatoryKeys),
				optionalKeys: convertBufferList(transactionWithSignature.asset.optionalKeys),
			} : transactionWithSignature.asset,
			id: convertBuffer(transactionWithSignature.id),
		});
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
			// @TODO
			const keys = {
				mandatoryKeys: isMultiSignatureRegistration
					? asset.mandatoryKeys
					// @ts-ignore
					: convertStringList(wallet?.multiSignature().mandatoryKeys),
				optionalKeys: isMultiSignatureRegistration
					? asset.optionalKeys
					// @ts-ignore
					: convertStringList(wallet?.multiSignature().optionalKeys),
			};

			signedTransaction = signMultiSignatureTransaction(
				assetSchema,
				{
					...(await this.#buildTransactionObject(input, type)),
					asset: isMultiSignatureRegistration ? {
						numberOfSignatures: asset.numberOfSignatures,
						optionalKeys: asset.optionalKeys,
						mandatoryKeys: asset.mandatoryKeys,
					} : asset,
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
				asset: isMultiSignatureRegistration ? {
					numberOfSignatures: signedTransaction.asset.numberOfSignatures,
					mandatoryKeys: convertBufferList(keys.mandatoryKeys),
					optionalKeys: convertBufferList(keys.optionalKeys),
				} : {
					amount: signedTransaction.asset.amount.toString(),
					recipientAddress: signedTransaction.asset.recipientAddress,
					data: signedTransaction.asset.data,
				},
				id: convertBuffer(signedTransaction.id),
			});
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
			// @TODO
			signedTransaction = await this.multiSign(signedTransaction, input, { actsWithSecondSignature: true });
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
}
