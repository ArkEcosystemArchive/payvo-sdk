import "jest-extended";

import { firstMapKey } from "./first-map-key.js";

describe("#firstMapKey", () => {
    it("should return the first key", () => {
        expect(firstMapKey(new Map([["Hello", "World"]]))).toBe("Hello");
    });
});
