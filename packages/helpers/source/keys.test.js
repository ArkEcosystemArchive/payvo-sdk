import { assert, test } from "@payvo/sdk-test";

import { keys } from "./keys";

	test("should work with an object", () => {
		function Foo() {
			// @ts-ignore
			this.a = 1;
			// @ts-ignore
			this.b = 2;
		}

		Foo.prototype.c = 3;

		assert.equal(keys(new Foo()), ["a", "b"]);
	});

	test("should work with a string", () => {
		assert.equal(keys("hi"), ["0", "1"]);
	});

	test("should work with an array", () => {
		assert.equal(keys([1, 2, 3, 4]), ["0", "1", "2", "3"]);
	});
