import { describe } from "@payvo/sdk-test";

import { isDate } from "./is-date";

describe("isDate", async ({ assert, it, nock, loader }) => {
	it("should pass", () => {
		assert.true(isDate(new Date()));
	});

	it("should fail", () => {
		assert.false(isDate(1));
	});
});
