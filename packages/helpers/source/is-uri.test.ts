import "jest-extended";

import { isURI } from "./is-uri.js";

describe("#isURI", () => {
	it("should pass", () => {
		expect(isURI("https://domain.com/")).toBeTrue();
	});

	it("should fail", () => {
		expect(isURI("random string")).toBeTrue();
	});
});
