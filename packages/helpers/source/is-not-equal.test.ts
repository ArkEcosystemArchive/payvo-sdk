import "jest-extended";

import { isNotEqual } from "./is-not-equal.js";

describe("#isNotEqual", () => {
    it("should pass", () => {
        expect(isNotEqual<any>(1, "1")).toBeTrue();
    });

    it("should fail", () => {
        expect(isNotEqual(1, 1)).toBeFalse();
    });
});
