import { identity } from "../test/fixtures/identity";
import { createService, requireModule } from "../test/mocking";
import { AddressService } from "./address.service";

let subject: AddressService;

test.before.each(async () => {
    subject = await createService(AddressService);
});

describe("Address", () => {
    test("should generate an output from a mnemonic", async () => {
        const result = await subject.fromMnemonic(identity.mnemonic);

        assert.is(result).toMatchInlineSnapshot(`
		Object {
		  "address": "APPJtAkysCKBssD5EJzEpakntNk81nR7X2",
		  "type": "bip44",
		}
	`);
    });

    test("should generate an output from a publicKey", async () => {
        const result = await subject.fromPublicKey(identity.publicKey);

        assert.is(result).toMatchInlineSnapshot(`
		Object {
		  "address": "APPJtAkysCKBssD5EJzEpakntNk81nR7X2",
		  "type": "bip44",
		}
	`);
    });

    test("should generate an output from a privateKey", async () => {
        const result = await subject.fromPrivateKey(identity.privateKey);

        assert.is(result).toMatchInlineSnapshot(`
		Object {
		  "address": "APPJtAkysCKBssD5EJzEpakntNk81nR7X2",
		  "type": "bip44",
		}
	`);
    });

    test("should generate an output from a wif", async () => {
        const result = await subject.fromWIF(identity.wif);

        assert.is(result).toMatchInlineSnapshot(`
		Object {
		  "address": "APPJtAkysCKBssD5EJzEpakntNk81nR7X2",
		  "type": "bip44",
		}
	`);
    });

    test("should validate an address", async () => {
        await assert.is(subject.validate("AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX")).resolves, true);
    await assert.is(subject.validate("ABC")).resolves, false);
});
});
