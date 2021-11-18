import { isURL } from "./is-url";
import { URL } from "url";

test("#isURL", () => {
	test("should pass", () => {
		assert.is(isURL(new URL("https://google.com")), true);
	});

	test("should fail", () => {
		assert.is(isURL(1), false);
	});
