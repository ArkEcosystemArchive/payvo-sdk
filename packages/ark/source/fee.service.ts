import { Contracts, Services } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";

export class FeeService extends Services.AbstractFeeService {
	public override async all(): Promise<Services.TransactionFees> {
		const node = await this.#get("node/fees");
		const type = await this.#get("transactions/fees");

		const staticFees: object = type.data;
		const dynamicFees: object = node.data;

		return {
			delegateRegistration: this.#transform("delegateRegistration", 1, staticFees, dynamicFees),
			delegateResignation: this.#transform("delegateResignation", 1, staticFees, dynamicFees),
			ipfs: this.#transform("ipfs", 1, staticFees, dynamicFees),
			multiPayment: this.#transform("multiPayment", 1, staticFees, dynamicFees),
			multiSignature: this.#transform("multiSignature", 1, staticFees, dynamicFees),
			secondSignature: this.#transform("secondSignature", 1, staticFees, dynamicFees),
			transfer: this.#transform("transfer", 1, staticFees, dynamicFees),
			vote: this.#transform("vote", 1, staticFees, dynamicFees),
		};
	}

	public override async calculate(
		transaction: Contracts.RawTransactionData,
		options?: Services.TransactionFeeOptions,
	): Promise<BigNumber> {
		const { multiSignature } = await this.all();

		if (Array.isArray(transaction.data()?.asset?.multiSignature?.publicKeys)) {
			return multiSignature.static.times(transaction.data().asset.multiSignature.publicKeys.length + 1);
		}

		return BigNumber.ZERO;
	}

	#transform(type: string, typeGroup: number, staticFees: object, dynamicFees: object): Services.TransactionFee {
		const dynamicFee = (dynamicFees[typeGroup] ?? staticFees[typeGroup])[type] ?? "0";
		let minimumFee = this.bigNumberService.make(dynamicFee?.min ?? "0");
		let averageFee = this.bigNumberService.make(dynamicFee?.avg ?? "0");
		const maximumFee = this.bigNumberService.make(staticFees[typeGroup][type] ?? "0");

		if (type === "multiPayment") {
			minimumFee = maximumFee;
			averageFee = maximumFee;
		}

		return {
			avg: averageFee.isGreaterThan(maximumFee) ? maximumFee : averageFee,
			isDynamic:
				this.configRepository.get<string>("network.transactions.fees.type") !== "static" &&
				type !== "multiSignature",
			max: maximumFee,
			min: minimumFee.isGreaterThan(maximumFee) ? maximumFee : minimumFee,
			static: maximumFee,
		};
	}

	async #get(path: string, query?: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		return (await this.httpClient.get(`${this.hostSelector(this.configRepository).host}/${path}`, query)).json();
	}
}
