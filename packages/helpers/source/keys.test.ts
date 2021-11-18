import { keys } from "./keys.js";

describe("#keys", () => {
	it("should work with an object", () => {
		function Foo() {
			// @ts-ignore
			this.a = 1;
			// @ts-ignore
			this.b = 2;
		}

		Foo.prototype.c = 3;

		assert.is(keys(new Foo()), ["a", "b"]);
	});

	it("should work with a string", () => {
		assert.is(keys("hi"), ["0", "1"]);
	});

	it("should work with an array", () => {
		assert.is(keys([1, 2, 3, 4]), ["0", "1", "2", "3"]);
	});
});
