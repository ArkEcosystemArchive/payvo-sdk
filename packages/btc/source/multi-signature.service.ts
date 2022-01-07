import { UUID } from "@payvo/sdk-cryptography";
import { Coins, Contracts, Helpers, Http, IoC, Networks, Services, Signatories } from "@payvo/sdk";
import { PendingMultiSignatureTransaction } from "./multi-signature.transaction.js";
import { BindingType } from "./constants.js";
import { MultiSignatureSigner } from "./multi-signature.signer.js";
import { getNetworkConfig } from "./config.js";
import * as bitcoin from "bitcoinjs-lib";

export class MultiSignatureService extends Services.AbstractMultiSignatureService {
	readonly #configRepository: Coins.ConfigRepository;
	readonly #dataTransferObjectService: Services.DataTransferObjectService;
	readonly #httpClient: Http.HttpClient;
	readonly #multiSignatureSigner: MultiSignatureSigner;
	readonly #network: bitcoin.networks.Network;

	public constructor(container: IoC.IContainer) {
		super();

		this.#configRepository = container.get(IoC.BindingType.ConfigRepository);
		this.#dataTransferObjectService = container.get(IoC.BindingType.DataTransferObjectService);
		this.#httpClient = container.get(IoC.BindingType.HttpClient);
		this.#multiSignatureSigner = container.get(BindingType.MultiSignatureSigner);
		this.#network = getNetworkConfig(this.#configRepository);
	}

	/** @inheritdoc */
	public override async allWithPendingState(publicKey: string): Promise<Services.MultiSignatureTransaction[]> {
		return (
			await this.#post("list", {
				publicKey,
				state: "pending",
			})
		).map((transaction) => this.#normalizeTransaction(transaction));
	}

	/** @inheritdoc */
	public override async allWithReadyState(publicKey: string): Promise<Services.MultiSignatureTransaction[]> {
		return (
			await this.#post("list", {
				publicKey,
				state: "ready",
			})
		).map((transaction) => this.#normalizeTransaction(transaction));
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
		const { multiSignature, ...data } = transaction;
		try {
			const { id } = await this.#post("store", {
				data,
				multiSignature,
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
		return new PendingMultiSignatureTransaction(transaction.data(), this.#network).isMultiSignatureReady();
	}

	/** @inheritdoc */
	public override needsSignatures(transaction: Contracts.SignedTransactionData): boolean {
		return new PendingMultiSignatureTransaction(transaction.data(), this.#network).needsSignatures();
	}

	/** @inheritdoc */
	public override needsAllSignatures(transaction: Contracts.SignedTransactionData): boolean {
		return new PendingMultiSignatureTransaction(transaction.data(), this.#network).needsAllSignatures();
	}

	/** @inheritdoc */
	public override needsWalletSignature(transaction: Contracts.SignedTransactionData, publicKey: string): boolean {
		return new PendingMultiSignatureTransaction(transaction.data(), this.#network).needsWalletSignature(publicKey);
	}

	/** @inheritdoc */
	public override needsFinalSignature(transaction: Contracts.SignedTransactionData): boolean {
		return new PendingMultiSignatureTransaction(transaction.data(), this.#network).needsFinalSignature();
	}

	/** @inheritdoc */
	public override remainingSignatureCount(transaction: Contracts.SignedTransactionData): number {
		return new PendingMultiSignatureTransaction(transaction.data(), this.#network).remainingSignatureCount();
	}

	/** @inheritdoc */
	public override async addSignature(
		transaction: Contracts.RawTransactionData,
		signatory: Signatories.Signatory,
	): Promise<Contracts.SignedTransactionData> {
		const transactionWithSignature = await this.#multiSignatureSigner.addSignature(transaction, signatory);

		return this.#dataTransferObjectService.signedTransaction(
			transaction.id,
			transactionWithSignature,
			transactionWithSignature.psbt,
		);
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

	#normalizeTransaction({ data, multiSignature }: Contracts.KeyValuePair): Services.MultiSignatureTransaction {
		return {
			...data,
			multiSignature,
		};
	}
}
