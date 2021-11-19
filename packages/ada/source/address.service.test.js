import { assert, test } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service";

let subject;

test.before.each(async () => {
    subject = await createService(AddressService);
});

    test("should generate an output from a mnemonic", async () => {
        const result = await subject.fromMnemonic(identity.mnemonic);

        assert.equal(result,
		{
		  "address": "addr_test1qqy6nhfyks7wdu3dudslys37v252w2nwhv0fw2nfawemmn8k8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33sw96paj",
		  "type": "bip44",
		}
	);
    });

    test("should generate an output from a publicKey", async () => {
        const result = await subject.fromPublicKey(identity.extPublicKey);

        assert.equal(result,
		{
		  "address": "addr_test1qqy6nhfyks7wdu3dudslys37v252w2nwhv0fw2nfawemmn8k8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33sw96paj",
		  "type": "bip44",
		}
	);
    });

    test("should validate an address", async () => {
        assert.true(await subject.validate(identity.address));
		assert.false(await subject.validate(identity.address.slice(0, 10)));
});
