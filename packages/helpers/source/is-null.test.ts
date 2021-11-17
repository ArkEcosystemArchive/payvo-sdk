import "jest-extended";

import { isNull } from "./is-null.js";

describe("#isNull", () => {
    it("should pass", () => {
        expect(isNull(null)).toBeTrue();
    });

    it("should fail", () => {
        expect(isNull("null")).toBeFalse();
    });
});
