import "jest-extended";

import { BigNumber } from "@payvo/helpers";

import fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto";
import { createService, require } from "../test/mocking";

describe("WalletData", () => {
	it("should succeed", async () => {
		const result = createService(WalletData).fill(fixture.result.account_data);

		expect(result).toBeInstanceOf(WalletData);
		expect(result.address()).toEqual("r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59");
		expect(result.publicKey()).toBeUndefined();
		expect(result.balance().available).toEqual(BigNumber.make("92291324300"));
	});
});
