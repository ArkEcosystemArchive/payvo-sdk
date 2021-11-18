import { assert, test } from "@payvo/sdk-test";

import { CappedSet } from "./capped-set";

test("CappedSet", () => {
	test("basic", () => {
		const cappedSet = new CappedSet<number>();

		cappedSet.add(20);

		assert.is(cappedSet.has(20), true);
		assert.is(cappedSet.has(21), false);
	});

	test("overflow", () => {
		const maxSize = 10;
		const cappedSet = new CappedSet<number>(maxSize);

		for (let i = 0; i < 15; i++) {
			cappedSet.add(i);
		}

		for (let i = 0; i < 5; i++) {
			assert.is(cappedSet.has(i), false);
		}

		for (let i = 5; i < 15; i++) {
			assert.is(cappedSet.has(i), true);
		}
	});
});
