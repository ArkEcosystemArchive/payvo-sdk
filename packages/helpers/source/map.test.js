import { map } from "./map";

	test("should work like lodash", () => {
		assert.equal(
			map([4, 8], (n) => n * n),
			[16, 64],
		);
	});

	test("should work like lodash", () => {
		assert.equal(
			map({ a: 4, b: 8 }, (n) => n * n),
			[16, 64],
		);
	});
