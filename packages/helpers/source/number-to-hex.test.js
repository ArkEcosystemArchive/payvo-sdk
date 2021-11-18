import { numberToHex } from "./number-to-hex";

describe("#numberToHex", () => {
	it("should return the number as hex", () => {
		assert.is(numberToHex(1), "01");
	});
});
