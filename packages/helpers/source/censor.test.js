import { assert, test } from "@payvo/sdk-test";

import { Censor } from "./censor";

let subject;

test.before.each(() => (subject = new Censor()));

test("#isBad", () => {
	assert.true(subject.isBad("onion"));
	assert.true(subject.isBad("zyva.org"));
	assert.true(subject.isBad("tighturl.com")); // allow uppercase in code
	assert.true(subject.isBad("ZYVA.ORG")); // allow uppercase in data
	assert.false(subject.isBad("tree"));
	assert.false(subject.isBad(""));
});

test("#process", () => {
	assert.is(subject.process("pedo"), "****");
	assert.is(subject.process("pedophile"), "*********");
	assert.is(subject.process("zyva.org"), "********");
	assert.is(
		subject.process("https://www.google.com/ Don't be an ash0le :smile:"),
		"*********************** Don't be an ****** :smile:",
	);
	assert.is(subject.process("tree"), "tree");
	assert.is(subject.process(""), "");
});

test.run();
