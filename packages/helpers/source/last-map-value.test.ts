import { lastMapValue } from "./last-map-value.js";

describe("#lastMapValue", () => {
	it("should return the last value", () => {
		expect(
			lastMapValue(
				new Map([
					["Hello", "World"],
					["Another", "Planet"],
				]),
			),
		).toBe("Planet");
	});
});
