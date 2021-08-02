/* istanbul ignore file */

import { BigNumber } from "@payvo/helpers";
import { SignedTransactionData } from "../dto";
import { NotImplemented } from "../exceptions";
import { HttpClient } from "../http";
import { inject, injectable } from "../ioc";
import { BindingType } from "../ioc/service-provider.contract";
import { FeeService, TransactionFeeOptions, TransactionFees } from "./fee.contract";

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
