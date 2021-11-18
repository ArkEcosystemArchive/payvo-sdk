import { identity } from "../test/fixtures/identity";
import { AddressService } from "./address.service";

let subject;

test.before.each(async () => (subject = new AddressService());

describe("Address", () => {
    test("should generate an output from a mnemonic", async () => {
        const result = await subject.fromMnemonic(identity.mnemonic);

        assert.is(result,
		Object {
		  "address": "GCGYSPQBSQCJKNDXDISBSXAM3THK7MACUVZGEMXF6XRZCPGAWCUGXVNC",
		  "path": "m/44'/148'/0'",
		  "type": "bip44",
		}
	`);
    });

    test("should generate an output from a private key", async () => {
        const result = await subject.fromPrivateKey(identity.privateKey);

        assert.is(result,
		Object {
		  "address": "GCGYSPQBSQCJKNDXDISBSXAM3THK7MACUVZGEMXF6XRZCPGAWCUGXVNC",
		  "path": "m/44'/148'/0'",
		  "type": "bip44",
		}
	`);
    });

    test("should validate an address", async () => {
        await assert.is(subject.validate(identity.address)).resolves, true);
    await assert.is(subject.validate("invalid")).resolves, false);
});
});
