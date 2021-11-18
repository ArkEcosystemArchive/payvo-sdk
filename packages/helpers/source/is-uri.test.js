import { isURI } from "./is-uri";

test("#isURI", () => {
	test("should pass", () => {
		assert.is(isURI("https://domain.com/"), true);
	});

	test("should fail", () => {
		assert.is(isURI("random string"), true);
	});
