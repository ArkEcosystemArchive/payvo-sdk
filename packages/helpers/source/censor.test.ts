import { Censor } from "./censor.js";

let subject: Censor;
beforeEach(() => (subject = new Censor()));

test("#isBad", () => {
	assert.is(subject.isBad("onion"), true);
	assert.is(subject.isBad("zyva.org"), true);
	assert.is(subject.isBad("tighturl.com"), true); // allow uppercase in code
	assert.is(subject.isBad("ZYVA.ORG"), true); // allow uppercase in data
	assert.is(subject.isBad("tree"), false);
	assert.is(subject.isBad(""), false);
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
