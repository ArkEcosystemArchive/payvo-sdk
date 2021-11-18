import { isURI } from "./is-uri";

describe("#isURI", () => {
	it("should pass", () => {
		assert.is(isURI("https://domain.com/"), true);
	});

	it("should fail", () => {
		assert.is(isURI("random string"), true);
	});
});
