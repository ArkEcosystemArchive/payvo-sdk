import "jest-extended";

import { isNil } from "./is-nil.js";

describe("#isNil", () => {
    it("should pass", () => {
        expect(isNil(undefined)).toBeTrue();
        expect(isNil(null)).toBeTrue();
    });

    it("should fail", () => {
        expect(isNil("undefined")).toBeFalse();
        expect(isNil("null")).toBeFalse();
    });
});
