import { reverse } from "./reverse";

describe("#reverse", () => {
	test("should work with a string", () => {
		assert.is(reverse("abc"), "cba");
	});
});
