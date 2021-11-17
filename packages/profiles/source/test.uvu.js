import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { ARK } from "@payvo/sdk-ark";

test('Math.sqrt()', () => {
	assert.is(Math.sqrt(4), 2);
	assert.is(Math.sqrt(144), 12);
	assert.is(Math.sqrt(2), Math.SQRT2);
});

test.run();
