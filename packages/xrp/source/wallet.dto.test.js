import { BigNumber } from "@payvo/sdk-helpers";

import fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto";
import { createService } from "../test/mocking";

describe("WalletData", () => {
    test("should succeed", async () => {
        const result = createService(WalletData).fill(fixture.result.account_data);

        assert.instance(result, WalletData);
        assert.is(result.address(), "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59");
        assert.is(result.publicKey()), "undefined");
    assert.is(result.balance().available, BigNumber.make("92291324300"));
});
});
