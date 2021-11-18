import { assert, test } from "@payvo/sdk-test";

import { reduceRightArray } from "./reduce-right-array";

	test("should work with a function", () => {
		assert
			.equal(
				reduceRightArray(
					[
						[0, 1],
						[2, 3],
						[4, 5],
					],
					(flattened, other) => flattened.concat(other),
					[],
				), [4, 5, 2, 3, 0, 1]);
	});
