import { map } from "./map";

test("#map", () => {
	test("should work like lodash", () => {
		assert.is(
			map([4, 8], (n) => n * n),
			[16, 64],
		);
	});

	test("should work like lodash", () => {
		assert.is(
			map({ a: 4, b: 8 }, (n) => n * n),
			[16, 64],
		);
	});
