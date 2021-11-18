/* istanbul ignore file */

import { BigNumber } from "@payvo/sdk-helpers";

import { SignedTransactionData } from "../dto/index.js";
import { NotImplemented } from "../exceptions.js";
import { HttpClient } from "../http/index.js";
import { inject, injectable } from "../ioc/index.js";
import { BindingType } from "../ioc/service-provider.contract.js";
import { FeeService, TransactionFeeOptions, TransactionFees } from "./fee.contract.js";

@injectable()
export class AbstractFeeService implements FeeService {
	@inject(BindingType.HttpClient)
	protected readonly httpClient!: HttpClient;

	public async all(): Promise<TransactionFees> {
		throw new NotImplemented(this.constructor.name, this.all.name);
	}

	public async calculate(transaction: SignedTransactionData, options?: TransactionFeeOptions): Promise<BigNumber> {
		throw new NotImplemented(this.constructor.name, this.calculate.name);
	}
}
