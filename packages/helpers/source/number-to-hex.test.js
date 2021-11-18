import { numberToHex } from "./number-to-hex";

test("#numberToHex", () => {
	test("should return the number as hex", () => {
		assert.is(numberToHex(1), "01");
	});
});
