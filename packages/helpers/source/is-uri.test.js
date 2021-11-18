import { isURI } from "./is-uri";

	test("should pass", () => {
		assert.true(isURI("https://domain.com/"));
	});

	test("should fail", () => {
		assert.true(isURI("random string"));
	});
