import { identity } from "../test/fixtures/identity.js";
import { createService, requireModule } from "../test/mocking.js";
import { AddressService } from "./address.service.js";

let subject: AddressService;

beforeEach(async () => {
    subject = await createService(AddressService);
});

describe("Address", () => {
    it("should generate an output from a mnemonic", async () => {
        await assert.is(subject.fromMnemonic(identity.mnemonic)).resolves.toMatchInlineSnapshot(`
					Object {
					  "address": "X-fuji1rusf9c2uwlqxg5crfrqr8xrt4r49yk6rskehvm",
					  "path": "m/44'/9000'/0'/0/0",
					  "type": "bip44",
					}
				`);
    });

    it("should fail to generate an output from a privateKey", async () => {
        await assert.is(subject.fromPrivateKey(identity.privateKey)).resolves.toEqual({
            type: "bip44",
            address: identity.address,
        });
    });

    it("should fail to validate an address", async () => {
        await assert.is(subject.validate(identity.address)).resolves, true);
});
});
