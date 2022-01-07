import { Contracts, IoC, Services } from "@payvo/sdk";
import { convertLSKToBeddows, signTransaction, signMultiSignatureTransaction } from "@liskhq/lisk-transactions";
import { convertBuffer, convertBufferList, convertString, convertStringList } from "@payvo/sdk-helpers";
import { DateTime } from "@payvo/sdk-intl";
import { TransactionSerializer } from "./transaction.serializer.js";

export class TransactionService extends Services.AbstractTransactionService {
	readonly #feeService!: Services.FeeService;
	readonly #transactionSerializer!: IoC.Factory<TransactionSerializer>;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#feeService = container.get(IoC.BindingType.FeeService);
		this.#transactionSerializer = container.factory(TransactionSerializer);
	}

	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData(
			"token:transfer",
			{
				amount: this.toSatoshi(input.data.amount).toString(),
				recipientAddress: input.data.to,
				data: input.data.memo,
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
			delegateAddress: string;
			amount: string;
		}[] = [];

		if (Array.isArray(input.data.votes)) {
			for (const vote of input.data.votes) {
				votes.push({
					delegateAddress: vote.id,
					amount: this.toSatoshi(vote.amount).toString(),
				});
			}
		}

		if (Array.isArray(input.data.unvotes)) {
			for (const unvote of input.data.unvotes) {
				votes.push({
					delegateAddress: unvote.id,
					amount: this.toSatoshi(unvote.amount).times(-1).toString(),
				});
			}
		}

		return this.#createFromData("dpos:voteDelegate", { votes }, input);
	}

	// TODO: for now, we just disable Lisk musig, we will come back to it in the future
	// public override async multiSignature(
	// 	input: Services.MultiSignatureInput,
	// ): Promise<Contracts.SignedTransactionData> {
	// 	if (!Array.isArray(input.data.mandatoryKeys)) {
	// 		throw new Error("Expected [input.data.mandatoryKeys] to be defined as a list of strings.");
	// 	}
	//
	// 	if (!Array.isArray(input.data.optionalKeys)) {
	// 		throw new Error("Expected [input.data.optionalKeys] to be defined as a list of strings.");
	// 	}
	//
	// 	return this.#createFromData(
	// 		"keys:registerMultisignatureGroup",
	// 		{
	// 			numberOfSignatures: input.data.numberOfSignatures,
	// 			mandatoryKeys: input.data.mandatoryKeys.slice(0, input.data.min),
	// 			optionalKeys: input.data.optionalKeys.slice(input.data.min),
	// 		},
	// 		input,
	// 	);
	// }

	public override async unlockToken(input: Services.UnlockTokenInput): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData(
			"dpos:unlockToken",
			{
				unlockObjects: input.data.objects.map(({ address, amount, height }) => ({
					delegateAddress: address,
					amount: amount.toString(),
					unvoteHeight: height,
				})),
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
		let wallet: Contracts.WalletData | undefined;

		try {
			wallet = await this.clientService.wallet({ type: "address", value: input.signatory.address() });
		} catch {
			//
		}

		const { assetSchema, moduleAssetId } = this.configRepository.get<object>("network.meta.assets")[type];

		const isMultiSignatureRegistration = moduleAssetId === "4:0";

		if (wallet?.isMultiSignature() || isMultiSignatureRegistration) {
			return this.#handleMultiSignature({
				asset,
				assetSchema,
				isMultiSignatureRegistration,
				input,
				type,
				wallet,
			});
		}

		const transactionObject = await this.#buildTransactionObject(input, type, asset);

		signedTransaction = signTransaction(
			assetSchema,
			this.#transactionSerializer().toMachine(transactionObject),
			this.#networkIdentifier(),
			input.signatory.signingKey(),
		);

		return this.dataTransferObjectService.signedTransaction(convertBuffer(signedTransaction.id), {
			...this.#transactionSerializer().toHuman(signedTransaction),
			timestamp: DateTime.make(),
		});
	}

	async #handleMultiSignature({
		asset,
		assetSchema,
		isMultiSignatureRegistration,
		input,
		type,
		wallet,
	}): Promise<Contracts.SignedTransactionData> {
		const numberOfSignatures: number = isMultiSignatureRegistration
			? asset.numberOfSignatures
			: wallet?.multiSignature().numberOfSignatures;

		const keys = {
			mandatoryKeys: convertStringList(
				isMultiSignatureRegistration ? asset.mandatoryKeys : wallet?.multiSignature().mandatoryKeys,
			),
			optionalKeys: convertStringList(
				isMultiSignatureRegistration ? asset.optionalKeys : wallet?.multiSignature().optionalKeys,
			),
		};

		const transactionObject = await this.#buildTransactionObject(input, type, asset);

		let signedTransaction: any = signMultiSignatureTransaction(
			assetSchema,
			{
				...this.#transactionSerializer().toMachine(transactionObject),
				signatures: [],
			},
			this.#networkIdentifier(),
			input.signatory.signingKey(),
			keys,
			isMultiSignatureRegistration,
		);

		const needsDoubleSign = [
			...convertBufferList(keys.mandatoryKeys ?? []),
			...convertBufferList(keys.optionalKeys ?? []),
		].includes(input.signatory.publicKey());

		if (isMultiSignatureRegistration && needsDoubleSign) {
			signedTransaction = signMultiSignatureTransaction(
				assetSchema,
				{
					...this.#transactionSerializer().toMachine(transactionObject),
					signatures: signedTransaction.signatures,
				},
				this.#networkIdentifier(),
				input.signatory.signingKey(),
				keys,
				isMultiSignatureRegistration,
			);
		}

		return this.dataTransferObjectService.signedTransaction(convertBuffer(signedTransaction.id), {
			...this.#transactionSerializer().toHuman(signedTransaction, keys),
			multiSignature: this.#multiSignatureAsset({
				isMultiSignatureRegistration,
				numberOfSignatures,
				keys,
				wallet,
			}),
			timestamp: DateTime.make(),
		});
	}

	#multiSignatureAsset({ isMultiSignatureRegistration, numberOfSignatures, keys, wallet }): object {
		if (isMultiSignatureRegistration) {
			return {
				numberOfSignatures,
				mandatoryKeys: convertBufferList(keys.mandatoryKeys),
				optionalKeys: convertBufferList(keys.optionalKeys),
			};
		}

		const result = wallet.multiSignature();
		delete result.members;

		return result;
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

	async #buildTransactionObject(
		input: Services.TransactionInput,
		type: string,
		asset: Record<string, any>,
	): Promise<Record<string, any>> {
		let nonce: string | undefined;

		if (input.nonce) {
			nonce = input.nonce;
		} else {
			try {
				const wallet: Contracts.WalletData = await this.clientService.wallet({
					type: "address",
					value: input.signatory.address(),
				});

				nonce = wallet.nonce().toString();
			} catch {
				nonce = "0";
			}
		}

		const { assetID, moduleID } = this.#assets()[type];

		const transactionObject: Contracts.RawTransactionData = {
			moduleID,
			assetID,
			asset,
			nonce,
			senderPublicKey: this.#senderPublicKey(input),
		};

		const fee = input.fee ?? (await this.#feeService.calculate(transactionObject)).toHuman();

		return {
			...transactionObject,
			fee: convertLSKToBeddows(`${fee || 0}`),
		};
	}
}
