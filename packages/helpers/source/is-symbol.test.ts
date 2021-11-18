import { isSymbol } from "./is-symbol.js";

describe("#isSymbol", () => {
	it("should pass", () => {
		assert.is(isSymbol(Symbol.for("string")), true);
	});

	it("should fail", () => {
		assert.is(isSymbol("string"), false);
	});
});
