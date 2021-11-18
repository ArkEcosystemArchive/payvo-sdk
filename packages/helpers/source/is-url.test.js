import { isURL } from "./is-url";
import { URL } from "url";

describe("#isURL", () => {
	it("should pass", () => {
		assert.is(isURL(new URL("https://google.com")), true);
	});

	it("should fail", () => {
		assert.is(isURL(1), false);
	});
});
