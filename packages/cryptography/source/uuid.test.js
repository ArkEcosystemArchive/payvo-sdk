import { test } from "uvu";
import * as assert from "uvu/assert";

import { UUID } from "./uuid";

const dummy = "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b";

test("#timestamp", () => {
	assert.type(UUID.timestamp(), "string");
});

test("#md5", () => {
	assert.is(UUID.md5("Hello World", "1b671a64-40d5-491e-99b0-da01ff1f3341"), "d954df73-1ea5-303b-a2cc-b24265839eec");
});

test("#random", () => {
	assert.type(UUID.random(), "string");
});

test("#sha1", () => {
	assert.is(UUID.sha1("Hello World", "1b671a64-40d5-491e-99b0-da01ff1f3341"), "a572fa0f-9bfa-5103-9882-16394770ad11");
});

test("#parse", () => {
	assert.type(UUID.parse(dummy), "object");
});

test("#stringify", () => {
	assert.is(UUID.stringify(UUID.parse(dummy)), "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b");
});

test("#validate", () => {
	assert.is(UUID.validate(dummy), true);
	assert.is(UUID.validate("invalid"), false);
});

test.run();
