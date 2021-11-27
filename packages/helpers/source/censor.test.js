import { describe } from "@payvo/sdk-test";

import { Censor } from "./censor";

describe("Censor", async ({ assert, beforeEach, it }) => {
	beforeEach((context) => (context.subject = new Censor()));

	it("#isBad", (context) => {
		assert.true(context.subject.isBad("onion"));
		assert.true(context.subject.isBad("zyva.org"));
		assert.true(context.subject.isBad("tighturl.com")); // allow uppercase in code
		assert.true(context.subject.isBad("ZYVA.ORG")); // allow uppercase in data
		assert.false(context.subject.isBad("tree"));
		assert.false(context.subject.isBad(""));
	});

	it("#process", (context) => {
		assert.is(context.subject.process("pedo"), "****");
		assert.is(context.subject.process("pedophile"), "*********");
		assert.is(context.subject.process("zyva.org"), "********");
		assert.is(
			context.subject.process("https://www.google.com/ Don't be an ash0le :smile:"),
			"*********************** Don't be an ****** :smile:",
		);
		assert.is(context.subject.process("tree"), "tree");
		assert.is(context.subject.process(""), "");
	});
});
