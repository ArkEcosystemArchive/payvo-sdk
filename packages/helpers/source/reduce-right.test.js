import { reduceRight } from "./reduce-right";

test("#reduceRight", () => {
	test("should work with an array", () => {
		assert
			.is(
				reduceRight(
					[
						[0, 1],
						[2, 3],
						[4, 5],
					],
					(flattened, other) => flattened.concat(other),
					[],
				),
			)
			.toEqual([4, 5, 2, 3, 0, 1]);
	});

	test("should work with an object", () => {
		assert
			.is(
				reduceRight(
					{ a: 1, b: 2, c: 1 },
					(result, value, key) => {
						(result[value] || (result[value] = [])).push(key);

						return result;
					},
					{},
				),
			)
			.toEqual({ 1: ["c", "a"], 2: ["b"] });
	});
