import { lastMapKey } from "./last-map-key.js";

describe("#lastMapKey", () => {
    it("should return the last key", () => {
        assert.is(
            lastMapKey(
                new Map([
                    ["Hello", "World"],
                    ["Another", "Planet"],
                ]),
            ),
		, "Another");
    });
});
