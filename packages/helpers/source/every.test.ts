import "jest-extended";

import { every } from "./every.js";
import { isBoolean } from "./is-boolean.js";

describe("#every", () => {
    it("should work with a functions", () => {
        expect(every([true, false], isBoolean)).toBeTrue();
        expect(every([true, false, "yes"], isBoolean)).toBeFalse();
    });
});
