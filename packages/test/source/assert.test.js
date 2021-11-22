import { test } from "uvu";
import { z } from "zod";

import { assert } from "./assert";

test("does match the given object", () => {
	assert.matchesObject(
		{
			hello: "world",
		},
		{
			hello: z.string(),
		},
	);
});

test("does not match the given object", () => {
	assert.not.matchesObject(
		{
			hello: 1,
		},
		{
			hello: z.string(),
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

test.run();
