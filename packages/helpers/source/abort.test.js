import { assert, test } from "@payvo/sdk-test";

import { abort_if, abort_unless } from "./abort";

test("#abort_if", () => {
	assert.not.throws(() => abort_if(false, "Hello"));
	assert.throws(() => abort_if(true, "Hello"));
});

test("#abort_unless", () => {
	assert.not.throws(() => abort_unless(true, "Hello"));
	assert.throws(() => abort_unless(false, "Hello"));
});

test.run();
