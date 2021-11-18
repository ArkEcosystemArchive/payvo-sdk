import { isURI } from "./is-uri";

describe("#isURI", () => {
	test("should pass", () => {
		assert.is(isURI("https://domain.com/"), true);
	});

	test("should fail", () => {
		assert.is(isURI("random string"), true);
	});
});
