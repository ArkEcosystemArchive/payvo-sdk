import { test } from "uvu";
import * as uvu from "uvu/assert";
import nock from "nock";
import sinon from "sinon";

const assert = {
	...uvu,
	rejects: async (fn: Function): Promise<void> => {
		try {
			await fn();

			uvu.ok(false, "Expected promise to be rejected but it resolved.");
		} catch (error) {
			if (error instanceof uvu.Assertion) {
				throw error;
			}

			uvu.ok(true);
		}
	},
	array: (value: unknown): void => uvu.ok(Array.isArray(value)),
	string: (value: unknown): void => uvu.type(value, "string"),
	number: (value: unknown): void => uvu.type(value, "number"),
	boolean: (value: unknown): void => uvu.type(value, "boolean"),
	object: (value: unknown): void => uvu.type(value, "object"),
	undefined: (value: unknown): void => uvu.type(value, "undefined"),
	function: (value: unknown): void => uvu.type(value, "function"),
	true: (value: unknown): void => uvu.is(value, true),
	false: (value: unknown): void => uvu.is(value, false),
	length: (value: string | unknown[], length: number): void => uvu.is(value.length, length),
	gt: (a: number, b: number): void => uvu.ok(a > b),
	gte: (a: number, b: number): void => uvu.ok(a >= b),
	lt: (a: number, b: number): void => uvu.ok(a < b),
	lte: (a: number, b: number): void => uvu.ok(a <= b),
};

export { assert, nock, sinon, test };
