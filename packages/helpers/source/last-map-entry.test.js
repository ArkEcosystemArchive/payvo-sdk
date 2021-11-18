import { lastMapEntry } from "./last-map-entry";

test("#lastMapEntry", () => {
	test("should return the last entry", () => {
		assert
			.is(
				lastMapEntry(
					new Map([
						["Hello", "World"],
						["Another", "Planet"],
					]),
				),
			)
			.toEqual(["Another", "Planet"]);
	});
});
