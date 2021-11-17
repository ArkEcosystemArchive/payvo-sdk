import { lastMapKey } from "./last-map-key.js";

describe("#lastMapKey", () => {
	it("should return the last key", () => {
		expect(
			lastMapKey(
				new Map([
					["Hello", "World"],
					["Another", "Planet"],
				]),
			),
		).toBe("Another");
	});
});
