import { assert, test } from "@payvo/sdk-test";

import { clone } from "./clone";

test("#clone", () => {
	test("should work with an array", () => {
		const objects = [{ a: 1 }, { b: 2 }];

		assert.is(clone(objects), objects);
	});

	test("should work with an object", () => {
		const objects = { a: 1 };

		assert.is(clone(objects), objects);
	});
