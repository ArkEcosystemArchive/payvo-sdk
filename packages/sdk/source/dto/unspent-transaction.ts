/* istanbul ignore file */

import { BigNumber } from "@payvo/helpers";
import { DateTime } from "@payvo/intl";

import { KeyValuePair } from "../contracts";
import { injectable } from "../ioc";
import { UnspentTransactionData as Contract } from "./confirmed-transaction.contract";

@injectable()
export class UnspentTransactionData implements Contract {
	readonly #data: KeyValuePair;

	public constructor(data: KeyValuePair) {
		this.#data = data;
	}

	public id(): string {
		return this.#data.id;
	}

	public timestamp(): DateTime {
		return this.#data.timestamp;
	}

	public amount(): BigNumber {
		return this.#data.amount;
	}

	public address(): string {
		return this.#data.address;
	}
}
