import { upperFirst } from "./upper-first";

const dummies = {
	fred: "Fred",
	FRED: "FRED",
	"test space": "Test space",
};

test("#upperFirst", () => {
	test("should capitalize the given input", () => {
		Object.keys(dummies).forEach((key) => {
			assert.is(upperFirst(key), dummies[key]);
		});
	});
