import { merge } from "./merge";

test("#merge", () => {
	test("should merge the given objects", () => {
		assert
			.is(
				merge(
					{
						a: [{ b: 2 }, { d: 4 }],
					},
					{
						a: [{ c: 3 }, { e: 5 }],
					},
				),
			)
			.toEqual({ a: [{ b: 2 }, { d: 4 }, { c: 3 }, { e: 5 }] });
	});
});
