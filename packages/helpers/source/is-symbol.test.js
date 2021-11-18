import { assert, test } from "@payvo/sdk-test";

import { isSymbol } from "./is-symbol";

test("should pass", () => {
	assert.true(isSymbol(Symbol.for("string")));
});

test("should fail", () => {
	assert.false(isSymbol("string"));
});

test.run();
