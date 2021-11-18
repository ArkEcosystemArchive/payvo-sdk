import { identity } from "../test/fixtures/identity.js";
import { createService, requireModule } from "../test/mocking.js";
import { AddressService } from "./address.service.js";

let subject: AddressService;

test.before.each(async () => {
    subject = await createService(AddressService);
});

describe("Address", () => {
    it("should generate an output from a mnemonic", async () => {
        const result = await subject.fromMnemonic(identity.mnemonic);

        assert.is(result).toMatchInlineSnapshot(`
		Object {
		  "address": "addr_test1qqy6nhfyks7wdu3dudslys37v252w2nwhv0fw2nfawemmn8k8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33sw96paj",
		  "type": "bip44",
		}
	`);
    });

    it("should generate an output from a publicKey", async () => {
        const result = await subject.fromPublicKey(identity.extPublicKey);

        assert.is(result).toMatchInlineSnapshot(`
		Object {
		  "address": "addr_test1qqy6nhfyks7wdu3dudslys37v252w2nwhv0fw2nfawemmn8k8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33sw96paj",
		  "type": "bip44",
		}
	`);
    });

    it("should validate an address", async () => {
        await assert.is(subject.validate(identity.address)).resolves, true);
    await assert.is(subject.validate(identity.address.slice(0, 10))).resolves, false);
});
});
