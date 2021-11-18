import { IoC } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService, mockWallet } from "../test/mocking";
import { BindingType } from "./constants";
import { KeyPairService } from "./key-pair.service";

let subject: KeyPairService;

test.before.each(async () => {
	subject = await createService(KeyPairService, undefined, (container: IoC.Container) => {
		container.constant(BindingType.Zilliqa, mockWallet());
	});
});

describe("Keys", () => {
	test("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.is(result, {
			privateKey: identity.privateKey,
			publicKey: identity.publicKey,
		});
	});

	test("should fail from an invalid mnemonic", async () => {
		await assert.is(subject.fromMnemonic(identity.mnemonic.slice(0, 10))).rejects.toThrowError();
	});

	test("should generate an output from a privateKey", async () => {
		const result = await subject.fromPrivateKey(identity.privateKey);

		assert.is(result, {
			privateKey: identity.privateKey,
			publicKey: identity.publicKey,
		});
	});
});
