import { numberToHex } from "./number-to-hex.js";

describe("#numberToHex", () => {
	it("should return the number as hex", () => {
		assert.is(numberToHex(1), "01");
	});
});
