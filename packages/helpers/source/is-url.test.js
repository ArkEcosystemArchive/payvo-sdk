import { describe } from "@payvo/sdk-test";

import { isURL } from "./is-url";
import { URL } from "url";

describe("isURL", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isURL(new URL("https://google.com")));
	});

	it("should fail", () => {
		assert.false(isURL(1));
	});
});
