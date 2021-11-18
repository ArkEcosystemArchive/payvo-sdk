import { lastMapEntry } from "./last-map-entry";

	test("should return the last entry", () => {
		assert
			.equal(
				lastMapEntry(
					new Map([
						["Hello", "World"],
						["Another", "Planet"],
					]),
				), ["Another", "Planet"]);
	});
