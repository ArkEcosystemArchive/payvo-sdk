import { Contracts, Helpers, IoC, Services } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";
import { computeMinFee, getBytes } from "@liskhq/lisk-transactions";

import { isMultiSignatureRegistration } from "./helpers.js";
import { TransactionSerializer } from "./transaction.serializer.js";
import { joinModuleAndAssetIds } from "./multi-signature.domain.js";

export class FeeService extends Services.AbstractFeeService {
	readonly #transactionSerializer: IoC.Factory<TransactionSerializer>;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#transactionSerializer = container.factory(TransactionSerializer);
	}

	public override async all(): Promise<Services.TransactionFees> {
		return {
			transfer: this.#transform(0.1 * 1e8),
			secondSignature: this.#transform(5 * 1e8),
			delegateRegistration: this.#transform(25 * 1e8),
			vote: this.#transform(1 * 1e8),
			multiSignature: this.#transform(5 * 1e8),
			ipfs: this.#transform(0),
			multiPayment: this.#transform(0),
			delegateResignation: this.#transform(0),
		};
	}

	public override async calculate(
		rawTransactionData: Contracts.RawTransactionData,
		options?: Services.TransactionFeeOptions,
	): Promise<BigNumber> {
		const transaction = JSON.parse(
			JSON.stringify(
				rawTransactionData.constructor.name === "SignedTransactionData"
					? rawTransactionData.data()
					: rawTransactionData,
			),
		);

		const { data } = (
			await this.httpClient.get(`${Helpers.randomHostFromConfig(this.configRepository)}/fees`)
		).json();

		let numberOfSignatures = 1;

		if (isMultiSignatureRegistration(transaction)) {
			numberOfSignatures = transaction.asset.mandatoryKeys.length + transaction.asset.optionalKeys.length + 1;
		}

		const { assetSchema, maximumFee } = this.#asset(transaction);

		const normalisedTransaction = {
			...this.#transactionSerializer().toMachine({ ...transaction }),
			signatures: undefined,
		};

		const minFee: bigint = computeMinFee(assetSchema as object, normalisedTransaction, {
			baseFees: Object.entries(data.baseFeeById).map((fee: [string, unknown]) => {
				const [moduleID, assetID] = fee[0].split(":");

				return {
					moduleID: Number(moduleID),
					assetID: Number(assetID),
					baseFee: fee[1] as string,
				};
			}),
			numberOfSignatures,
		});

		const size: number = getBytes(assetSchema as object, {
			...normalisedTransaction,
			signatures: new Array(numberOfSignatures).fill(Buffer.alloc(64)),
		}).length;

		const feePerByte = {
			slow: data.feeEstimatePerByte.low,
			average: data.feeEstimatePerByte.medium,
			fast: data.feeEstimatePerByte.high,
		}[options?.priority ?? "average"];

		let tieBreaker = 0;

		if (options?.priority !== "slow") {
			tieBreaker = data.minFeePerByte * feePerByte * Math.random();
		}

		return this.bigNumberService.make(
			Math.min(Number(minFee) + size * feePerByte + tieBreaker, maximumFee as number),
		);
	}

	#transform(value: string | number): Services.TransactionFee {
		const fee: BigNumber = this.bigNumberService.make(value);

		return {
			static: fee,
			max: fee,
			min: fee,
			avg: fee,
		};
	}

	#asset(transaction: Contracts.RawTransactionData): Record<string, number | object> {
		const moduleAssetId: string | undefined = {
			"2:0": "token:transfer",
			"4:0": "keys:registerMultisignatureGroup",
			"5:0": "dpos:registerDelegate",
			"5:1": "dpos:voteDelegate",
			"5:2": "dpos:unlockToken",
			"5:3": "dpos:reportDelegateMisbehavior",
			"1000:0": "legacyAccount:reclaimLSK",
		}[joinModuleAndAssetIds(transaction)];

		if (!moduleAssetId) {
			throw new Error("Failed to determine module and asset ID.");
		}

		return this.configRepository.get<object>("network.meta.assets")[moduleAssetId];
	}
}
