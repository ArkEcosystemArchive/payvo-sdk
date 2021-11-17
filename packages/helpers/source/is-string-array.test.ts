import "jest-extended";

import { isStringArray } from "./is-string-array.js";

describe("#isStringArray", () => {
    it("should pass", () => {
        expect(isStringArray(["string"])).toBeTrue();
    });

    it("should fail", () => {
        expect(isStringArray([1])).toBeFalse();
    });
});
