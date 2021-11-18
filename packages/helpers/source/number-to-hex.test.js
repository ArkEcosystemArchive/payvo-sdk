import { numberToHex } from "./number-to-hex";

describe("#numberToHex", () => {
	test("should return the number as hex", () => {
		assert.is(numberToHex(1), "01");
	});
});
