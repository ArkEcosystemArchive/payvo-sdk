import { lastMapKey } from "./last-map-key";

test("#lastMapKey", () => {
    test("should return the last key", () => {
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
