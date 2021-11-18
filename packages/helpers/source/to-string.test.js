import { toString } from "./to-string";

describe("#toString", () => {
	test("should work with a string", () => {
		assert.is(toString("hi"), "hi");
	});

	test("should work with a symbol", () => {
		assert.is(toString(Symbol.for("hi")), "Symbol(hi)");
	});

	test("should work with a null value", () => {
		assert.is(toString(null), "");
	});

	test("should work with an undefined value", () => {
		assert.is(toString(undefined), "");
	});

	test("should work with an array", () => {
		assert.is(toString([1, 2, 3]), "1,2,3");
	});
});
