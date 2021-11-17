import "jest-extended";

import { isNumber } from "./is-number.js";

describe("#isNumber", () => {
    it("should pass", () => {
        expect(isNumber(1)).toBeTrue();
    });

    it("should fail", () => {
        expect(isNumber("1")).toBeFalse();
    });
});
