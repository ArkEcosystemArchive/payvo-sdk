import { isSymbol } from "./is-symbol";

test("#isSymbol", () => {
	test("should pass", () => {
		assert.is(isSymbol(Symbol.for("string")), true);
	});

	test("should fail", () => {
		assert.is(isSymbol("string"), false);
	});
