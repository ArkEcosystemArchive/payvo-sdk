import { assert, test } from "@payvo/sdk-test";

import { CappedSet } from "./capped-set";

test("basic", () => {
	const cappedSet = new CappedSet();

	cappedSet.add(20);

	assert.true(cappedSet.has(20));
	assert.false(cappedSet.has(21));
});

test("overflow", () => {
	const maxSize = 10;
	const cappedSet = new CappedSet(maxSize);

	for (let i = 0; i < 15; i++) {
		cappedSet.add(i);
	}

	for (let i = 0; i < 5; i++) {
		assert.false(cappedSet.has(i));
	}

	for (let i = 5; i < 15; i++) {
		assert.true(cappedSet.has(i));
	}
});

test.run();
