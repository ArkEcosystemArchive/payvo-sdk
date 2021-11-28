import { describe } from "@payvo/sdk-test";

import { every } from "./every";
import { isBoolean } from "./is-boolean";

describe("every", async ({ assert, it, nock, loader }) => {
	it("should work with a functions", () => {
		assert.true(every([true, false], isBoolean));
		assert.false(every([true, false, "yes"], isBoolean));
	});
});
