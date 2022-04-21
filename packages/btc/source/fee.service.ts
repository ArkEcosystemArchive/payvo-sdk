import { Services } from "@payvo/sdk";

export class FeeService extends Services.AbstractFeeService {
	public override async all(): Promise<Services.TransactionFees> {
		const { min, avg, max } = (
			await this.httpClient.get(`${this.hostSelector(this.configRepository).host}/fees`)
		).json().data;

		return {
			delegateRegistration: this.#transform(0, 0, 0),
			delegateResignation: this.#transform(0, 0, 0),
			ipfs: this.#transform(0, 0, 0),
			multiPayment: this.#transform(0, 0, 0),
			multiSignature: this.#transform(min, avg, max),
			secondSignature: this.#transform(0, 0, 0),
			transfer: this.#transform(min, avg, max),
			vote: this.#transform(0, 0, 0),
		};
	}

	#transform(min: number, avg: number, max: number): Services.TransactionFee {
		return {
			avg: this.bigNumberService.make(avg).toSatoshi(),
			max: this.bigNumberService.make(max).toSatoshi(),
			min: this.bigNumberService.make(min).toSatoshi(),
			static: this.bigNumberService.make(max).toSatoshi(),
		};
	}
}
