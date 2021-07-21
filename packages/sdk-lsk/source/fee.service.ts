import { Coins, Contracts, Helpers, IoC, Services } from "@payvo/sdk";
import { BigNumber } from "@payvo/helpers";
import { constants } from "@liskhq/lisk-transactions";

import { isMultiSignatureRegistration } from "./helpers";
import { BindingType } from "./coin.contract";
import { TransactionSerializer } from "./transaction.serializer";
import { computeMinFee, getBytes } from "@liskhq/lisk-transactions-beta";
import { joinModuleAndAssetIds } from "./multi-signature.domain";

@IoC.injectable()
export class FeeService extends Services.AbstractFeeService {
	@IoC.inject(IoC.BindingType.BigNumberService)
	protected readonly bigNumberService!: Services.BigNumberService;

	@IoC.inject(IoC.BindingType.ConfigRepository)
	protected readonly configRepository!: Coins.ConfigRepository;

	@IoC.inject(BindingType.TransactionSerializer)
	protected readonly transactionSerializer!: TransactionSerializer;

	public override async all(): Promise<Services.TransactionFees> {
		return {
			transfer: this.#transform("TRANSFER_FEE"),
			secondSignature: this.#transform("SIGNATURE_FEE"),
			delegateRegistration: this.#transform("DELEGATE_FEE"),
			vote: this.#transform("VOTE_FEE"),
			multiSignature: this.#transform("MULTISIGNATURE_FEE"),
			ipfs: this.#transform(0),
			multiPayment: this.#transform(0),
			delegateResignation: this.#transform(0),
			htlcLock: this.#transform(0),
			htlcClaim: this.#transform(0),
			htlcRefund: this.#transform(0),
		};
	}

	public override async calculate(
		transaction: Contracts.RawTransactionData,
		options?: Services.TransactionFeeOptions,
	): Promise<number> {
		const { data } = (
			await this.httpClient.get(`${Helpers.randomHostFromConfig(this.configRepository)}/fees`)
		).json();

		let numberOfSignatures = 1;

		if (isMultiSignatureRegistration(transaction)) {
			numberOfSignatures = transaction.asset.mandatoryKeys.length + transaction.asset.optionalKeys.length + 1;
		}

		const { assetSchema, maximumFee } = this.#asset(transaction);

		const minFee: bigint = computeMinFee(
			assetSchema as object,
			{
				...this.transactionSerializer.toMachine(transaction),
				signatures: undefined,
			},
			{
				baseFees: Object.entries(data.baseFeeById).map((fee: [string, unknown]) => {
					const [moduleID, assetID] = fee[0].split(":");

					return {
						moduleID: Number(moduleID),
						assetID: Number(assetID),
						baseFee: fee[1] as string,
					};
				}),
				numberOfSignatures,
			},
		);

		const size: number = getBytes(assetSchema as object, {
			...this.transactionSerializer.toMachine(transaction),
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

		return Math.min(Number(minFee) + size * feePerByte + tieBreaker, maximumFee as number) / 1e8;
	}

	#transform(type: string | number): Services.TransactionFee {
		const fee: BigNumber = this.bigNumberService.make(type === 0 ? 0 : constants[type]);

		return {
			static: fee,
			max: fee,
			min: fee,
			avg: fee,
		};
	}

	#asset(transaction: Contracts.RawTransactionData): Record<string, number | object> {
		return this.configRepository.get<object>("network.meta.assets")[
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
}
