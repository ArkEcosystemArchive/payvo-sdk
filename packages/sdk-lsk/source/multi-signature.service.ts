import { getAddressFromBase32Address, getLisk32AddressFromAddress } from "@liskhq/lisk-cryptography";
import { getBytes, signMultiSignatureTransaction } from "@liskhq/lisk-transactions-beta";
import { Coins, Contracts, Helpers, IoC, Networks, Services, Signatories } from "@payvo/sdk";
import { Http } from "@payvo/sdk";

import {
	convertBuffer,
	convertBufferList,
	convertString,
	convertStringList,
	findNonEmptySignatureIndices,
	getKeys,
	isTransactionFullySigned,
	joinModuleAndAssetIds,
} from "./multi-signature.domain";
import { PendingMultiSignatureTransaction } from "./multi-signature.transaction";

@IoC.injectable()
export class MultiSignatureService extends Services.AbstractMultiSignatureService {
	@IoC.inject(IoC.BindingType.BigNumberService)
	protected readonly bigNumberService!: Services.BigNumberService;

	@IoC.inject(IoC.BindingType.ClientService)
	private readonly clientService!: Services.ClientService;

	@IoC.inject(IoC.BindingType.ConfigRepository)
	private readonly configRepository!: Coins.ConfigRepository;

	@IoC.inject(IoC.BindingType.DataTransferObjectService)
	protected readonly dataTransferObjectService!: Services.DataTransferObjectService;

	@IoC.inject(IoC.BindingType.HttpClient)
	private readonly httpClient!: Http.HttpClient;

	/** @inheritdoc */
	public override async allWithPendingState(publicKey: string): Promise<Services.MultiSignatureTransaction[]> {
		return this.#fetchAll(publicKey, "pending");
	}

	/** @inheritdoc */
	public override async allWithReadyState(publicKey: string): Promise<Services.MultiSignatureTransaction[]> {
		return this.#fetchAll(publicKey, "ready");
	}

	/** @inheritdoc */
	public override async findById(id: string): Promise<Services.MultiSignatureTransaction> {
		return this.#normalizeTransaction(await this.#get(`transaction/${id}`));
	}

	/** @inheritdoc */
	public override async broadcast(
		transaction: Services.MultiSignatureTransaction,
	): Promise<Services.BroadcastResponse> {
		let multisigAsset = transaction.multiSignature;

		if (transaction.asset && transaction.asset.multiSignature) {
			multisigAsset = transaction.asset.multiSignature;
		}

		try {
			const { id } = (
				await this.httpClient.post(`${this.#getPeer()}/transaction`, {
					data: transaction,
					multisigAsset,
				})
			).json();

			return {
				accepted: [id],
				rejected: [],
				errors: {},
			};
		} catch (error) {
			if (error instanceof Http.RequestException) {
				return {
					accepted: [],
					rejected: [transaction.id],
					errors: {
						[transaction.id]: (error as any).response.json().message,
					},
				};
			}

			throw error;
		}
	}

	/** @inheritdoc */
	public async flush(): Promise<Services.MultiSignatureTransaction> {
		return this.#delete("transactions");
	}

	/** @inheritdoc */
	public override isMultiSignatureReady(
		transaction: Contracts.SignedTransactionData,
		excludeFinal?: boolean,
	): boolean {
		return new PendingMultiSignatureTransaction(transaction.data()).isMultiSignatureReady({ excludeFinal });
	}

	/** @inheritdoc */
	public override needsSignatures(transaction: Contracts.SignedTransactionData): boolean {
		return new PendingMultiSignatureTransaction(transaction.data()).needsSignatures();
	}

	/** @inheritdoc */
	public override needsAllSignatures(transaction: Contracts.SignedTransactionData): boolean {
		return new PendingMultiSignatureTransaction(transaction.data()).needsAllSignatures();
	}

	/** @inheritdoc */
	public override needsWalletSignature(transaction: Contracts.SignedTransactionData, publicKey: string): boolean {
		return new PendingMultiSignatureTransaction(transaction.data()).needsWalletSignature(publicKey);
	}

	/** @inheritdoc */
	public override needsFinalSignature(transaction: Contracts.SignedTransactionData): boolean {
		return new PendingMultiSignatureTransaction(transaction.data()).needsFinalSignature();
	}

	/** @inheritdoc */
	public override getValidMultiSignatures(transaction: Contracts.SignedTransactionData): string[] {
		return new PendingMultiSignatureTransaction(transaction.data()).getValidMultiSignatures();
	}

	/** @inheritdoc */
	public override remainingSignatureCount(transaction: Contracts.SignedTransactionData): number {
		return new PendingMultiSignatureTransaction(transaction.data()).remainingSignatureCount();
	}

	/** @inheritdoc */
	public override async addSignature(
		transaction: Contracts.SignedTransactionData,
		signatory: Signatories.Signatory,
	): Promise<Contracts.SignedTransactionData> {
		const transactionObject = transaction.data();
		const isMultiSignatureRegistration = transactionObject.moduleID === 4;

		const { assetSchema } = this.#assets()[this.#assets[joinModuleAndAssetIds(transactionObject)]];

		let wallet: Contracts.WalletData;

		if (isMultiSignatureRegistration) {
			wallet = await this.clientService.wallet(signatory.address());
		} else {
			wallet = (
				await this.clientService.wallets({
					publicKey: transactionObject.senderPublicKey,
				})
			).first();
		}

		const { mandatoryKeys, optionalKeys } = getKeys({
			senderWallet: wallet,
			transaction: transactionObject,
			isMultiSignatureRegistration,
		});

		const { assetID, moduleID } = this.#assets()[this.#assets[joinModuleAndAssetIds(transactionObject)]];

		const transactionWithSignature: any = signMultiSignatureTransaction(
			assetSchema,
			{
				moduleID,
				assetID,
				nonce: BigInt(`${transactionObject.nonce}`),
				fee: BigInt(`${transactionObject.fee}`),
				senderPublicKey: convertString(transactionObject.senderPublicKey),
				asset: this.#createSignatureAsset(transactionObject),
				signatures: convertStringList(transactionObject.signatures),
			},
			this.#networkIdentifier(),
			signatory.actsWithSecondaryMnemonic() ? signatory.confirmKey() : signatory.signingKey(),
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

		return this.#transform(assetSchema, transactionWithSignature, {
			moduleID: transactionWithSignature.moduleID,
			assetID: transactionWithSignature.assetID,
			senderPublicKey: convertBuffer(transactionWithSignature.senderPublicKey),
			nonce: transactionWithSignature.nonce.toString(),
			fee: transactionWithSignature.fee.toString(),
			signatures: convertBufferList(transactionWithSignature.signatures),
			asset: this.#createNormalizedAsset(transactionWithSignature),
			id: convertBuffer(transactionWithSignature.id),
		});
	}

	/**
	 *
	 *
	 * @private
	 * @param {string} path
	 * @param {Contracts.KeyValuePair} [query]
	 * @returns {Promise<Contracts.KeyValuePair>}
	 * @memberof MultiSignatureService
	 */
	async #get(path: string, query?: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		return (await this.httpClient.get(`${this.#getPeer()}/${path}`, query)).json();
	}

	/**
	 *
	 *
	 * @private
	 * @param {string} path
	 * @param {Contracts.KeyValuePair} [query]
	 * @returns {Promise<Contracts.KeyValuePair>}
	 * @memberof MultiSignatureService
	 */
	async #delete(path: string, query?: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		return (await this.httpClient.delete(`${this.#getPeer()}/${path}`, query)).json();
	}

	/**
	 *
	 *
	 * @private
	 * @returns {string}
	 * @memberof MultiSignatureService
	 */
	#getPeer(): string {
		return Helpers.randomHost(this.configRepository.get<Networks.NetworkManifest>("network").hosts, "musig").host;
	}

	/**
	 *
	 *
	 * @private
	 * @param {*} transaction
	 * @returns {Record<string, any>}
	 * @memberof MultiSignatureService
	 */
	#normalizeTransaction({ data, multiSignature }: any): Record<string, any> {
		return {
			...data,
			multiSignature,
		};
	}

	/**
	 *
	 *
	 * @private
	 * @param {string} publicKey
	 * @param {string} state
	 * @returns {Promise<any[]>}
	 * @memberof MultiSignatureService
	 */
	async #fetchAll(publicKey: string, state: string): Promise<any[]> {
		return (
			await this.#get("transactions", {
				publicKey,
				state,
			})
		).map((transaction) => this.#normalizeTransaction(transaction));
	}

	#assets(): object {
		return this.configRepository.get<object>("network.meta.assets");
	}

	#networkIdentifier(): Buffer {
		return convertString(this.configRepository.get<string>("network.meta.networkId"));
	}

	#transform(schema, data, transaction): Contracts.SignedTransactionData {
		return this.dataTransferObjectService.signedTransaction(
			convertBuffer(data.id),
			transaction,
			getBytes(schema, data).toString("hex"),
		);
	}

	#createSignatureAsset(transaction: Record<string, any>): object {
		if (transaction.moduleID === 2 && transaction.assetID === 0) {
			return {
				amount: BigInt(`${transaction.asset.amount}`),
				recipientAddress: transaction.asset.recipientAddress,
				data: transaction.asset.data,
			};
		}

		if (transaction.moduleID === 4 && transaction.assetID === 0) {
			return {
				numberOfSignatures: transaction.asset.numberOfSignatures,
				mandatoryKeys: convertStringList(transaction.asset.mandatoryKeys),
				optionalKeys: convertStringList(transaction.asset.optionalKeys),
			};
		}

		if (transaction.moduleID === 5 && transaction.assetID === 0) {
			return {
				username: transaction.asset.username,
			};
		}

		if (transaction.moduleID === 5 && transaction.assetID === 1) {
			return transaction.asset.votes.map(({ delegateAddress, amount }) => ({
				delegateAddress: getAddressFromBase32Address(delegateAddress),
				amount: this.#normaliseVoteAmount(amount),
			}));
		}

		throw new Error("Failed to determine transaction type for asset signing.");
	}

	#createNormalizedAsset(transaction: Record<string, any>): object {
		if (transaction.moduleID === 2 && transaction.assetID === 0) {
			return {
				amount: transaction.asset.amount.toString(),
				recipientAddress: transaction.asset.recipientAddress,
				data: transaction.asset.data,
			};
		}

		if (transaction.moduleID === 4 && transaction.assetID === 0) {
			return {
				numberOfSignatures: transaction.asset.numberOfSignatures,
				mandatoryKeys: convertBufferList(transaction.asset.mandatoryKeys),
				optionalKeys: convertBufferList(transaction.asset.optionalKeys),
			};
		}

		if (transaction.moduleID === 5 && transaction.assetID === 0) {
			return {
				username: transaction.asset.username,
			};
		}

		if (transaction.moduleID === 5 && transaction.assetID === 1) {
			return transaction.asset.votes.map(({ delegateAddress, amount }) => ({
				delegateAddress: getLisk32AddressFromAddress(delegateAddress),
				amount: amount.toString(),
			}));
		}

		throw new Error("Failed to determine transaction type for asset normalization.");
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
