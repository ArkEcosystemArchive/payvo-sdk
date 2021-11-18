import { keyBy } from "./key-by";

const array = [
	{ dir: "left", code: 97 },
	{ dir: "right", code: 100 },
];

test("#keyBy", () => {
	test("should work with a function", () => {
		assert.is(
			keyBy(array, (o) => String.fromCharCode(o.code)),
			{
				a: { dir: "left", code: 97 },
				d: { dir: "right", code: 100 },
			},
		);
	});
});
