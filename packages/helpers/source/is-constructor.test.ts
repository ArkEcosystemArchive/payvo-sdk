import { isConstructor } from "./is-constructor.js";

describe("#isConstructor", () => {
	it("should pass", () => {
		assert.is(isConstructor(Date), true);
	});

	it("should fail", () => {
		assert.is(isConstructor([]), false);
	});
});
