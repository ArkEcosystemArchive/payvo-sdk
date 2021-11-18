import { assert, test } from "@payvo/sdk-test";


import { abort_if, abort_unless } from "./abort";

test("#abort_if", () => {
	assert.not.throw(() => abort_if(false, "Hello"));
	assert.throw(() => abort_if(true, "Hello"));
});

test("#abort_unless", () => {
	assert.not.throw(() => abort_unless(true, "Hello"));
	assert.throw(() => abort_unless(false, "Hello"));
});
