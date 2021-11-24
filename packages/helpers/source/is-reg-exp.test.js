import { describe } from "@payvo/sdk-test";

import { isRegExp } from "./is-reg-exp";

describe("isRegExp", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isRegExp(/a/));
	});

	it("should fail", () => {
		assert.false(isRegExp([]));
	});
});
