import { assert, test } from "@payvo/sdk-test";
import { Services } from "@payvo/sdk";

import { createService } from "../test/mocking";

let subject;

test.before(async () => {
	subject = await createService(Services.AbstractLinkService);
});

test("should generate a link for a block", async () => {
	assert.is(subject.block("id"), "https://polkascan.io/block/id");
});

test("should generate a link for a transaction", async () => {
	assert.is(subject.transaction("id"), "https://polkascan.io/tx/id");
});

test("should generate a link for a wallet", async () => {
	assert.is(subject.wallet("id"), "https://polkascan.io/address/id");
});

test.run();
