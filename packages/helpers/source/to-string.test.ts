import { toString } from "./to-string.js";

describe("#toString", () => {
	it("should work with a string", () => {
		assert.is(toString("hi")).toEqual("hi");
	});

	it("should work with a symbol", () => {
		assert.is(toString(Symbol.for("hi"))).toEqual("Symbol(hi)");
	});

	it("should work with a null value", () => {
		assert.is(toString(null)).toEqual("");
	});

	it("should work with an undefined value", () => {
		assert.is(toString(undefined)).toEqual("");
	});

	it("should work with an array", () => {
		assert.is(toString([1, 2, 3])).toEqual("1,2,3");
	});
});
