import { UUID } from "@payvo/cryptography";
import { convertString } from "@payvo/helpers";
import { Coins, Contracts, Helpers, Http, IoC, Networks, Services, Signatories } from "@payvo/sdk";

import { joinModuleAndAssetIds } from "./multi-signature.domain";
import { PendingMultiSignatureTransaction } from "./multi-signature.transaction";
import { isMultiSignatureRegistration } from "./helpers";
import { BindingType } from "./constants";
import { MultiSignatureSigner } from "./multi-signature.signer";

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

	@IoC.inject(BindingType.MultiSignatureSigner)
	private readonly multiSignatureSigner!: MultiSignatureSigner;

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
		let multiSignature = transaction.multiSignature;

		if (transaction.asset) {
			multiSignature = transaction.asset;
		}

		try {
			const { id } = await this.#post("store", {
				data: transaction,
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
		transaction: Contracts.RawTransactionData,
		signatory: Signatories.Signatory,
	): Promise<Contracts.SignedTransactionData> {
		const transactionWithSignature = await this.multiSignatureSigner.addSignature(transaction, signatory);

		return this.dataTransferObjectService.signedTransaction(transactionWithSignature.id!, transactionWithSignature);
	}

	async #post(method: string, params: any): Promise<Contracts.KeyValuePair> {
		return (
			await this.httpClient.post(
				Helpers.randomHost(this.configRepository.get<Networks.NetworkManifest>("network").hosts, "musig").host,
				{
					jsonrpc: "2.0",
					id: UUID.random(),
					method,
					params,
				},
			)
		).json().result;
	}

	#assets(): object {
		return this.configRepository.get<object>("network.meta.assets");
	}

	#networkIdentifier(): Buffer {
		return convertString(this.configRepository.get<string>("network.meta.networkId"));
	}

	#asset(transaction: Contracts.RawTransactionData): Record<string, any> {
		return this.#assets()[
			{
				"2:0": "token:transfer",
				"4:0": "keys:registerMultisignatureGroup",
				"5:0": "dpos:registerDelegate",
				"5:1": "dpos:voteDelegate",
				"5:2": "dpos:unlockToken",
				"5:3": "dpos:reportDelegateMisbehavior",
				"1000:0": "legacyAccount:reclaimLSK",
			}[joinModuleAndAssetIds(transaction)]!
		];
	}

	#multiSignatureAsset({ transaction, mandatoryKeys, optionalKeys, wallet }): object {
		if (isMultiSignatureRegistration(transaction)) {
			return {
				numberOfSignatures: transaction.asset.numberOfSignatures,
				mandatoryKeys,
				optionalKeys,
			};
		}

		const result = wallet.multiSignature();
		delete result.members;

		return result;
	}

	#normalizeTransaction({ data, multiSignature }: Contracts.KeyValuePair): Services.MultiSignatureTransaction {
		return {
			...data,
			multiSignature,
		};
	}
}
