import { describe } from "@payvo/sdk-test";

import { createValue } from "./transaction.factory";

describe("createValue", async ({ assert, it }) => {
	it("should succeed", async () => {
		assert.is(createValue("2").coin().to_str(), "2");
	});
});
