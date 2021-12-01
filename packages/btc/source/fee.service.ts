import { Coins, Helpers, IoC, Services } from "@payvo/sdk";

@IoC.injectable()
export class FeeService extends Services.AbstractFeeService {
	@IoC.inject(IoC.BindingType.ConfigRepository)
	private readonly configRepository!: Coins.ConfigRepository;

	@IoC.inject(IoC.BindingType.BigNumberService)
	private readonly bigNumberService!: Services.BigNumberService;

	public override async all(): Promise<Services.TransactionFees> {
		const { min, avg, max } = (
			await this.httpClient.get(`${Helpers.randomHostFromConfig(this.configRepository)}/fees`)
		).json().data;

		return {
			transfer: this.#transform(min, avg, max),
			secondSignature: this.#transform(0, 0, 0),
			delegateRegistration: this.#transform(0, 0, 0),
			vote: this.#transform(0, 0, 0),
			multiSignature: this.#transform(min, avg, max),
			ipfs: this.#transform(0, 0, 0),
			multiPayment: this.#transform(0, 0, 0),
			delegateResignation: this.#transform(0, 0, 0),
		};
	}

	#transform(min: number, avg: number, max: number): Services.TransactionFee {
		return {
			static: this.bigNumberService.make(max).toSatoshi(),
			min: this.bigNumberService.make(min).toSatoshi(),
			avg: this.bigNumberService.make(avg).toSatoshi(),
			max: this.bigNumberService.make(max).toSatoshi(),
		};
	}
}
