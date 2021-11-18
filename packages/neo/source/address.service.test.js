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

	assert.equal(result, {
		address: "APPJtAkysCKBssD5EJzEpakntNk81nR7X2",
		type: "bip44",
	});
});

test("should generate an output from a publicKey", async () => {
	const result = await subject.fromPublicKey(identity.publicKey);

	assert.equal(result, {
		address: "APPJtAkysCKBssD5EJzEpakntNk81nR7X2",
		type: "bip44",
	});
});

test("should generate an output from a privateKey", async () => {
	const result = await subject.fromPrivateKey(identity.privateKey);

	assert.equal(result, {
		address: "APPJtAkysCKBssD5EJzEpakntNk81nR7X2",
		type: "bip44",
	});
});

test("should generate an output from a wif", async () => {
	const result = await subject.fromWIF(identity.wif);

	assert.equal(result, {
		address: "APPJtAkysCKBssD5EJzEpakntNk81nR7X2",
		type: "bip44",
	});
});

test("should validate an address", async () => {
	assert.true(await subject.validate("AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX"));
	assert.false(await subject.validate("ABC"));
});

test.run();
