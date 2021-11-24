import { describe } from "@payvo/sdk-test";

import { isPromise } from "./is-promise";

describe("isPromise", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isPromise(new Promise(() => {})));
	});

	it("should fail", () => {
		assert.false(isPromise(1));
	});
});
