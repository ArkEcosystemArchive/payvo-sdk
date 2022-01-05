import { describe } from "@payvo/sdk-test";

import { isURI } from "./is-uri";

describe("isURI", async ({ assert, it, nock, loader }) => {
	it("should pass", () => {
		assert.true(isURI("https://domain.com/"));
	});

	it("should fail", () => {
		assert.true(isURI("random string"));
	});
});
