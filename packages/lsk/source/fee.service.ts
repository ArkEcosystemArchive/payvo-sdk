import { computeMinFee, getBytes } from "@liskhq/lisk-transactions";
import { Contracts, IoC, Services } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";

import { isMultiSignatureRegistration } from "./helpers.js";
import { joinModuleAndAssetIds } from "./multi-signature.domain.js";
import { TransactionSerializer } from "./transaction.serializer.js";

export class FeeService extends Services.AbstractFeeService {
	readonly #transactionSerializer: IoC.Factory<TransactionSerializer>;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#transactionSerializer = container.factory(TransactionSerializer);
	}

	public override async all(): Promise<Services.TransactionFees> {
		return {
			delegateRegistration: this.#transform(25 * 1e8),
			delegateResignation: this.#transform(0),
			ipfs: this.#transform(0),
			multiPayment: this.#transform(0),
			multiSignature: this.#transform(5 * 1e8),
			secondSignature: this.#transform(5 * 1e8),
			transfer: this.#transform(0.1 * 1e8),
			vote: this.#transform(1 * 1e8),
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

		const { data } = (await this.httpClient.get(`${this.hostSelector(this.configRepository).host}/fees`)).json();

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
					assetID: Number(assetID),
					baseFee: fee[1] as string,
					moduleID: Number(moduleID),
				};
			}),
			numberOfSignatures,
		});

		const size: number = getBytes(assetSchema as object, {
			...normalisedTransaction,
			signatures: new Array(numberOfSignatures).fill(Buffer.alloc(64)),
		}).length;

		const feePerByte = {
			average: data.feeEstimatePerByte.medium,
			fast: data.feeEstimatePerByte.high,
			slow: data.feeEstimatePerByte.low,
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
			avg: fee,
			max: fee,
			min: fee,
			static: fee,
		};
	}

	#asset(transaction: Contracts.RawTransactionData): Record<string, number | object> {
		const moduleAssetId: string | undefined = {
			"1000:0": "legacyAccount:reclaimLSK",
			"2:0": "token:transfer",
			"4:0": "keys:registerMultisignatureGroup",
			"5:0": "dpos:registerDelegate",
			"5:1": "dpos:voteDelegate",
			"5:2": "dpos:unlockToken",
			"5:3": "dpos:reportDelegateMisbehavior",
		}[joinModuleAndAssetIds(transaction)];

		if (!moduleAssetId) {
			throw new Error("Failed to determine module and asset ID.");
		}

		return this.configRepository.get<object>("network.meta.assets")[moduleAssetId];
	}
}
