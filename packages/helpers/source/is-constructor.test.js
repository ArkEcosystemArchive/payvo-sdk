import { isConstructor } from "./is-constructor";

test("#isConstructor", () => {
	test("should pass", () => {
		assert.is(isConstructor(Date), true);
	});

	test("should fail", () => {
		assert.is(isConstructor([]), false);
	});
});
