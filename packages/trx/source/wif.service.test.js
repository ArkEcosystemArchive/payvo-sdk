import { assert, test } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { WIFService } from "./wif.service";

let subject;

test.before.each(async () => {
	subject = await createService(WIFService);
});

test("should generate an output from a mnemonic", async () => {
	assert.equal(await subject.fromMnemonic(identity.mnemonic), {
		wif: "L2M8fs13JtFto4VZVN9fh3vVB2bFmEs3ykJmwuxTSpkA7yTCSUf8",
		path: "m/44'/195'/0'/0/0",
	});
});

test.run();
