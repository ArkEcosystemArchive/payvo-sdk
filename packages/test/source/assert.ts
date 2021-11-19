import * as uvu from "uvu/assert";

export const assert = {
	...uvu,
	not: {
		...uvu.not,
		containKey: (value: object, key: string): void => assert.false(Object.keys(value).includes(key)),
		empty: (value: unknown[]): void => uvu.ok(value.length > 0),
	},
	resolves: async (fn: Function, expected?: uvu.Message): Promise<void> => {
		try {
			await fn();

			uvu.ok(true);
		} catch (error) {
			if (error instanceof uvu.Assertion) {
				throw error;
			}

			if (expected instanceof Error) {
				uvu.instance(error, expected);
			}

			if (typeof expected === "string") {
				uvu.ok(error.message.includes(expected));
			}

			uvu.ok(false, "Expected promise to be resolved but it rejected.");
		}
	},
	rejects: async (fn: Function, expected?: uvu.Message): Promise<void> => {
		try {
			await fn();

			uvu.ok(false, "Expected promise to be rejected but it resolved.");
		} catch (error) {
			if (error instanceof uvu.Assertion) {
				throw error;
			}

			if (expected instanceof Error) {
				uvu.instance(error, expected);
			}

			if (typeof expected === "string") {
				uvu.ok(error.message.includes(expected));
			}

			uvu.ok(true);
		}
	},
	containKey: (value: object, key: string): void => assert.true(Object.keys(value).includes(key)),
	containValues: (value: object, key: string): void => assert.false(Object.values(value).includes(key)),
	array: (value: unknown): void => uvu.ok(Array.isArray(value)),
	boolean: (value: unknown): void => uvu.type(value, "boolean"),
	buffer: (value: unknown): void => uvu.instance(value, Buffer),
	bufferArray: (values: unknown[]): void => uvu.ok(values.every((value) => value instanceof Buffer)),
	false: (value: unknown): void => uvu.is(value, false),
	function: (value: unknown): void => uvu.type(value, "function"),
	gt: (a: number, b: number): void => uvu.ok(a > b),
	gte: (a: number, b: number): void => uvu.ok(a >= b),
	length: (value: string | unknown[], length: number): void => uvu.is(value.length, length),
	lt: (a: number, b: number): void => uvu.ok(a < b),
	lte: (a: number, b: number): void => uvu.ok(a <= b),
	null: (value: unknown): void => uvu.ok(value === null),
	number: (value: unknown): void => uvu.type(value, "number"),
	object: (value: unknown): void => uvu.type(value, "object"),
	string: (value: unknown): void => uvu.type(value, "string"),
	stringArray: (values: unknown[]): void => uvu.ok(values.every((value) => typeof value === "string")),
	true: (value: unknown): void => uvu.is(value, true),
	truthy: (value: unknown): void => uvu.ok(!!value),
	defined: (value: unknown): void => uvu.ok(value !== undefined),
	undefined: (value: unknown): void => uvu.type(value, "undefined"),
	includeAllMembers: (values: unknown[], items: unknown[]): void =>
		uvu.ok(items.every((item) => values.includes(item))),
	startsWith: (value: string, prefix: string): void => uvu.ok(value.startsWith(prefix)),
	containKeys: (value: object, keys: string[]): void => {
		for (const key of keys) {
			uvu.ok(value[key] !== undefined);
		}
	},
};
