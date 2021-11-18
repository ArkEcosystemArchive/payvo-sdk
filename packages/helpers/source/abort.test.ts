import { abort_if, abort_unless } from "./abort.js";

test("#abort_if", () => {
	assert.is(() => abort_if(false, "Hello")).not.toThrow();
	assert.is(() => abort_if(true, "Hello")).toThrow(/Hello/);
});

test("#abort_unless", () => {
	assert.is(() => abort_unless(true, "Hello")).not.toThrow();
	assert.is(() => abort_unless(false, "Hello")).toThrow(/Hello/);
});
