import { IoC } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService, mockWallet } from "../test/mocking";
import { BindingType } from "./constants";
import { PrivateKeyService } from "./private-key.service";

let subject: PrivateKeyService;

test.before.each(async () => {
	subject = await createService(PrivateKeyService, undefined, (container: IoC.Container) => {
		container.constant(BindingType.Zilliqa, mockWallet());
	});
});

describe("PrivateKey", () => {
	test("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.is(result, { privateKey: identity.privateKey });
	});

	test("should fail to generate an output from an invalid mnemonic", async () => {
		await assert.is(subject.fromMnemonic(identity.mnemonic.slice(0, 10))).rejects.toThrowError();
	});
});
