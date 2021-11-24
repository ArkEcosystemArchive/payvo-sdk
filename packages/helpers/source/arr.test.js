import { describe } from "@payvo/sdk-test";

import { Arr } from "./arr";

describe("randomElement", async ({ assert, it }) => {
	it("should pick random elements", () => {
		const data = [...Array(1000).keys()];

		assert.is.not(Arr.randomElement(data), Arr.randomElement(data));
	});
});
