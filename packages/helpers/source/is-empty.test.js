import { isEmpty } from "./is-empty";

test("should return true for an empty array", () => {
	assert.true(isEmpty([]));
});

test("should return true for an empty object", () => {
	assert.true(isEmpty({}));
});

test("should return true for a false boolean", () => {
	assert.true(isEmpty(false));
});

test("should return true for null", () => {
	assert.true(isEmpty(null));
});

test("should return true for undefined", () => {
	assert.true(isEmpty(undefined));
});

test("should return true for an empty map", () => {
	assert.true(isEmpty(new Map()));
});

test("should return true for an empty set", () => {
	assert.true(isEmpty(new Set()));
});

test("should return false if the value contains something", () => {
	assert.false(isEmpty([1]));
});
