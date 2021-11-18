import { reverse } from "./reverse";

test("#reverse", () => {
	test("should work with a string", () => {
		assert.is(reverse("abc"), "cba");
	});
});
