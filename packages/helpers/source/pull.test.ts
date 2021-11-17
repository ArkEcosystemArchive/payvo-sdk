import "jest-extended";

import { pull } from "./pull.js";

describe("#pull", () => {
    it("should work with a property", () => {
        expect(pull(["a", "b", "c", "a", "b", "c"], "a", "c")).toEqual(["b", "b"]);
    });
});
