import { isConstructor } from "./is-constructor";

describe("#isConstructor", () => {
	it("should pass", () => {
		assert.is(isConstructor(Date), true);
	});

	it("should fail", () => {
		assert.is(isConstructor([]), false);
	});
});
