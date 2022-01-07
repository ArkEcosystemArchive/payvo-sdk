import { signMultiSignatureTransaction } from "@liskhq/lisk-transactions";
import { UUID } from "@payvo/sdk-cryptography";
import { convertBuffer, convertString, convertStringList } from "@payvo/sdk-helpers";
import { Coins, Contracts, Helpers, Http, IoC, Networks, Services, Signatories } from "@payvo/sdk";

import { getKeys, joinModuleAndAssetIds } from "./multi-signature.domain.js";
import { PendingMultiSignatureTransaction } from "./multi-signature.transaction.js";
import { TransactionSerializer } from "./transaction.serializer.js";
import { AssetSerializer } from "./asset.serializer.js";
import { isMultiSignatureRegistration } from "./helpers.js";
import { DateTime } from "@payvo/sdk-intl";

export class MultiSignatureService extends Services.AbstractMultiSignatureService {
	readonly #clientService: Services.ClientService;
	readonly #configRepository: Coins.ConfigRepository;
	readonly #dataTransferObjectService: Services.DataTransferObjectService;
	readonly #httpClient: Http.HttpClient;
	readonly #assetSerializer: IoC.Factory<AssetSerializer>;
	readonly #transactionSerializer: IoC.Factory<TransactionSerializer>;

	public constructor(container: IoC.IContainer) {
		super();

		this.#clientService = container.get(IoC.BindingType.ClientService);
		this.#configRepository = container.get(IoC.BindingType.ConfigRepository);
		this.#dataTransferObjectService = container.get(IoC.BindingType.DataTransferObjectService);
		this.#httpClient = container.get(IoC.BindingType.HttpClient);
		this.#assetSerializer = container.factory(AssetSerializer);
		this.#transactionSerializer = container.factory(TransactionSerializer);
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
		let multiSignature = transaction.multiSignature;

		if (transaction.asset && transaction.asset.mandatoryKeys) {
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
			return {
				accepted: [],
				rejected: [transaction.id],
				errors: {
					[transaction.id]: (error as any).response?.json?.()?.message,
				},
			};
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
		// Normalise to ensure consistent behaviour
		transaction = this.#transactionSerializer().toHuman(transaction);

		const { assetSchema, assetID, moduleID } = this.#asset(transaction);

		let wallet: Contracts.WalletData;

		if (isMultiSignatureRegistration(transaction)) {
			wallet = await this.#clientService.wallet({ type: "address", value: signatory.address() });
		} else {
			wallet = (
				await this.#clientService.wallets({
					identifiers: [
						{
							type: "publicKey",
							value: transaction.senderPublicKey,
						},
					],
				})
			).first();
		}

		const { mandatoryKeys, optionalKeys } = getKeys({
			senderWallet: wallet,
			transaction: transaction,
			isMultiSignatureRegistration: isMultiSignatureRegistration(transaction),
		});

		const transactionWithSignature: any = signMultiSignatureTransaction(
			assetSchema,
			{
				moduleID,
				assetID,
				nonce: BigInt(`${transaction.nonce}`),
				fee: BigInt(`${transaction.fee}`),
				senderPublicKey: convertString(transaction.senderPublicKey),
				asset: this.#assetSerializer().toMachine(+moduleID, +assetID, transaction.asset),
				signatures: convertStringList(transaction.signatures),
			},
			this.#networkIdentifier(),
			signatory.actsWithConfirmationMnemonic() ? signatory.confirmKey() : signatory.signingKey(),
			{
				mandatoryKeys: convertStringList(mandatoryKeys),
				optionalKeys: convertStringList(optionalKeys),
			},
			isMultiSignatureRegistration(transaction),
		);

		return this.#dataTransferObjectService.signedTransaction(convertBuffer(transactionWithSignature.id), {
			...this.#transactionSerializer().toHuman(transactionWithSignature),
			multiSignature: this.#multiSignatureAsset({ transaction, mandatoryKeys, optionalKeys, wallet }),
			timestamp: DateTime.make(),
		});
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

	#assets(): object {
		return this.#configRepository.get<object>("network.meta.assets");
	}

	#networkIdentifier(): Buffer {
		return convertString(this.#configRepository.get<string>("network.meta.networkId"));
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
