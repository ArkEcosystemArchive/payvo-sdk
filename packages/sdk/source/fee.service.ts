/* istanbul ignore file */

import { BigNumber } from "@payvo/sdk-helpers";

import { BigNumberService } from "./big-number.service.js";
import { ConfigRepository } from "./config.js";
import { IContainer } from "./container.contracts.js";
import { SignedTransactionData } from "./dto.js";
import { NotImplemented } from "./exceptions.js";
import { FeeService, TransactionFeeOptions, TransactionFees } from "./fee.contract.js";
import { HttpClient } from "./http.js";
import { NetworkHostSelector } from "./network.models.js";
import { BindingType } from "./service-provider.contract.js";

export class AbstractFeeService implements FeeService {
	protected readonly configRepository: ConfigRepository;
	protected readonly bigNumberService: BigNumberService;
	protected readonly httpClient: HttpClient;
	protected readonly hostSelector: NetworkHostSelector;

	public constructor(container: IContainer) {
		this.configRepository = container.get(BindingType.ConfigRepository);
		this.bigNumberService = container.get(BindingType.BigNumberService);
		this.httpClient = container.get(BindingType.HttpClient);
		this.hostSelector = container.get(BindingType.NetworkHostSelector);
	}

	public async all(): Promise<TransactionFees> {
		throw new NotImplemented(this.constructor.name, this.all.name);
	}

	public async calculate(transaction: SignedTransactionData, options?: TransactionFeeOptions): Promise<BigNumber> {
		throw new NotImplemented(this.constructor.name, this.calculate.name);
	}
}
