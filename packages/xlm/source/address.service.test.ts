import { identity } from "../test/fixtures/identity.js";
import { AddressService } from "./address.service.js";

let subject: AddressService;

test.before.each(async () => (subject = new AddressService()));

describe("Address", () => {
    it("should generate an output from a mnemonic", async () => {
        const result = await subject.fromMnemonic(identity.mnemonic);

        assert.is(result).toMatchInlineSnapshot(`
		Object {
		  "address": "GCGYSPQBSQCJKNDXDISBSXAM3THK7MACUVZGEMXF6XRZCPGAWCUGXVNC",
		  "path": "m/44'/148'/0'",
		  "type": "bip44",
		}
	`);
    });

    it("should generate an output from a private key", async () => {
        const result = await subject.fromPrivateKey(identity.privateKey);

        assert.is(result).toMatchInlineSnapshot(`
		Object {
		  "address": "GCGYSPQBSQCJKNDXDISBSXAM3THK7MACUVZGEMXF6XRZCPGAWCUGXVNC",
		  "path": "m/44'/148'/0'",
		  "type": "bip44",
		}
	`);
    });

    it("should validate an address", async () => {
        await assert.is(subject.validate(identity.address)).resolves, true);
    await assert.is(subject.validate("invalid")).resolves, false);
});
});
