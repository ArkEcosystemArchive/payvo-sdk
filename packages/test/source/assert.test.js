import { describe } from "./describe";

describe("assert", ({ assert, test, zod }) => {
	test("does match the given object", () => {
		assert.matchesObject(
			{
				hello: "world",
			},
			{
				hello: zod.string(),
			},
		);
	});

	test("does not match the given object", () => {
		assert.not.matchesObject(
			{
				hello: 1,
			},
			{
				hello: zod.string(),
			},
		);
	});

	test("creates a snapshot", () => {
		assert.snapshot("object", { hello: "world" });
		assert.snapshot("number", 1);
		assert.snapshot("hello", "hello");
		assert.snapshot("true", true);
		assert.snapshot("false", false);
		assert.snapshot("nan", Number.NaN);
	});
});
