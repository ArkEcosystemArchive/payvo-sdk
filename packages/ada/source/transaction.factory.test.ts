import { describe } from "@payvo/sdk-test";

import { createValue } from "./transaction.factory.js";

describe("createValue", async ({ assert, it, nock, loader }) => {
	it("should succeed", async () => {
		assert.is(createValue("2").coin().to_str(), "2");
	});
});
