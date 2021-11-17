import "jest-extended";

import { isDate } from "./is-date.js";

describe("#isDate", () => {
    it("should pass", () => {
        expect(isDate(new Date())).toBeTrue();
    });

    it("should fail", () => {
        expect(isDate(1)).toBeFalse();
    });
});
