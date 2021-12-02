import { Interfaces } from "./crypto/index.js";
import { uniq } from "@payvo/sdk-helpers";
import { UUID } from "@payvo/sdk-cryptography";
import { DateTime } from "@payvo/sdk-intl";
import { Coins, Contracts, Helpers, IoC, Networks, Services, Signatories } from "@payvo/sdk";
import { Http } from "@payvo/sdk";
import { BindingType } from "./coin.contract.js";
import { applyCryptoConfiguration } from "./config.js";
import { MultiSignatureSigner } from "./multi-signature.signer.js";

import { PendingMultiSignatureTransaction } from "./multi-signature.transaction";

export class MultiSignatureService extends Services.AbstractMultiSignatureService {
	readonly #configRepository!: Coins.ConfigRepository;
	readonly #dataTransferObjectService!: Services.DataTransferObjectService;
	readonly #httpClient!: Http.HttpClient;
	readonly #multiSignatureSigner!: MultiSignatureSigner;
	readonly #packageCrypto!: Interfaces.NetworkConfig;
	readonly #packageHeight!: number;

	// @TODO: remove or inject
	#configCrypto!: { crypto: Interfaces.NetworkConfig; height: number };

	public constructor(container: IoC.IContainer) {
		super();

		this.#configRepository = container.get(IoC.BindingType.ConfigRepository);
		this.#dataTransferObjectService = container.get(IoC.BindingType.DataTransferObjectService);
		this.#httpClient = container.get(IoC.BindingType.HttpClient);
		this.#multiSignatureSigner = container.get(BindingType.MultiSignatureSigner);
		this.#packageCrypto = container.get(BindingType.Crypto);
		this.#packageHeight = container.get(BindingType.Height);
	}

	private onPostConstruct(): void {
		this.#configCrypto = { crypto: this.#packageCrypto, height: this.#packageHeight };
	}

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
		return this.#normalizeTransaction(await this.#post("show", { id }));
	}

	/** @inheritdoc */
	public override async forgetById(id: string): Promise<void> {
		await this.#post("delete", { id });
	}

	/** @inheritdoc */
	public override async broadcast(
		transaction: Services.MultiSignatureTransaction,
	): Promise<Services.BroadcastResponse> {
		let multisigAsset = transaction.multiSignature;

		if (transaction.asset && transaction.asset.multiSignature) {
			multisigAsset = transaction.asset.multiSignature;
		}

		if (Array.isArray(transaction.signatures)) {
			transaction.signatures = uniq(transaction.signatures);
		}

		try {
			const { id } = await this.#post("store", {
				data: transaction,
				multisigAsset,
			});

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
	public override remainingSignatureCount(transaction: Contracts.SignedTransactionData): number {
		return new PendingMultiSignatureTransaction(transaction.data()).remainingSignatureCount();
	}

	/** @inheritdoc */
	public override async addSignature(
		transaction: Contracts.RawTransactionData,
		signatory: Signatories.Signatory,
	): Promise<Contracts.SignedTransactionData> {
		applyCryptoConfiguration(this.#configCrypto);

		const transactionWithSignature = await this.#multiSignatureSigner.addSignature(transaction, signatory);

		return this.#dataTransferObjectService.signedTransaction(transactionWithSignature.id!, transactionWithSignature);
	}

	async #post(method: string, params: any): Promise<Contracts.KeyValuePair> {
		return (
			await this.#httpClient.post(
				Helpers.randomHost(this.#configRepository.get<Networks.NetworkManifest>("network").hosts, "musig").host,
				{
					jsonrpc: "2.0",
					id: UUID.random(),
					method,
					params,
				},
			)
		).json().result;
	}

	/**
	 *
	 *
	 * @private
	 * @param {*} transaction
	 * @returns {Record<string, any>}
	 * @memberof MultiSignatureService
	 */
	#normalizeTransaction({ data, id, multisigAsset, timestampReceived }: any): Record<string, any> {
		const result = {
			...{ ...data, timestamp: DateTime.fromUnix(timestampReceived) },
			id, // This is the real ID, computed by the MuSig Server.
			multiSignature: multisigAsset,
		};

		if (Array.isArray(result.signatures)) {
			result.signatures = uniq(result.signatures);
		}

		return result;
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
			await this.#post("list", {
				publicKey,
				state,
			})
		).map((transaction) => this.#normalizeTransaction(transaction));
	}
}
