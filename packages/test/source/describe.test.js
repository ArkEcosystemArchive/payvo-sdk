import { describe } from "./describe";

describe("Date.now()", ({ assert, before, after, only, skip, test }) => {
	let _Date;

	before(() => {
		let count = 0;
		_Date = global.Date;
		global.Date = { now: () => 100 + count++ };
	});

	after(() => {
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
});
