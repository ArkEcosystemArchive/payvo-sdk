import { Value } from "@emurgo/cardano-serialization-lib-nodejs";

import { createValue } from "./transaction.factory";

describe("createValue", () => {
	it("should work", () => {
		const result: Value = createValue("2");

		assert.is(result.coin().to_str(), "2");
	});
});
