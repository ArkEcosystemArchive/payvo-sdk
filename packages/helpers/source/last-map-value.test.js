import { lastMapValue } from "./last-map-value";

describe("#lastMapValue", () => {
    it("should return the last value", () => {
        assert.is(
            lastMapValue(
                new Map([
                    ["Hello", "World"],
                    ["Another", "Planet"],
                ]),
            ),
		, "Planet");
    });
});
