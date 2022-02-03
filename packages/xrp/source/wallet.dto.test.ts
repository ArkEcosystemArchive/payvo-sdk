import { describe } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto.js";
import { createService } from "../test/mocking";

describe("WalletData", async ({ it, assert }) => {
	it("should succeed", async () => {
		const result = createService(WalletData).fill(fixture.result.account_data);

		assert.instance(result, WalletData);
		assert.is(result.address(), "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59");
		assert.undefined(result.publicKey());
		assert.equal(result.balance().available, BigNumber.make("1331561268500000000"));
	});
});
