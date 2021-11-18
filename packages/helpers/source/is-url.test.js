import { isURL } from "./is-url";
import { URL } from "url";

	test("should pass", () => {
		assert.true(isURL(new URL("https://google.com")));
	});

	test("should fail", () => {
		assert.false(isURL(1));
	});
