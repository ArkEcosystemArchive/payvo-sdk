import { describe, describeWithContext } from "./describe";

describe("Date.now()", ({ assert, beforeAll, afterAll, each, only, skip, test }) => {
	let _Date;

	beforeAll(() => {
		let count = 0;
		_Date = global.Date;
		global.Date = { now: () => 100 + count++ };
	});

	afterAll(() => {
		global.Date = _Date;
	});

	skip("should be a function", () => {
		assert.type(Date.now, "function");
	});

	test("should return a number", () => {
		assert.type(Date.now(), "number");
	});

	only("should progress with time", () => {
		assert.is(Date.now(), 100);
		assert.is(Date.now(), 101);
		assert.is(Date.now(), 102);
	});

	each("should progress with time", ({ dataset }) => {
		console.log(dataset)
		assert.true(dataset > 0);
	}, [1, 2, 3]);
});

describeWithContext("Context (Object)", { hello: "world" }, ({ assert, test }) => {
	test("should have context from an object", (context) => {
		assert.is(context.hello, "world");
	});
});

describeWithContext(
	"Context (Function)",
	() => ({ hello: "world" }),
	({ assert, test }) => {
		test("should have context from an object", (context) => {
			assert.is(context.hello, "world");
		});
	},
);

describeWithContext(
	"Context (Promise Function)",
	async () => Promise.resolve({ hello: "world" }),
	({ assert, test }) => {
		test("should have context from an object", (context) => {
			assert.is(context.hello, "world");
		});
	},
);
