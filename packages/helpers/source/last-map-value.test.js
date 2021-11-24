import { describe } from "@payvo/sdk-test";

import { lastMapValue } from "./last-map-value";

describe("lastMapValue", async ({ assert, it }) => {
	it("should return the last value", () => {
		assert.is(
			lastMapValue(
				new Map([
					["Hello", "World"],
					["Another", "Planet"],
				]),
			),
			"Planet",
		);
	});
});
