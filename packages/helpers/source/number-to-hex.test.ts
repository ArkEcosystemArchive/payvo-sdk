import "jest-extended";

import { numberToHex } from "./number-to-hex.js";

describe("#numberToHex", () => {
	it("should return the number as hex", () => {
		expect(numberToHex(1)).toBe("01");
	});
});
