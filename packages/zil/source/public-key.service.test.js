import { IoC } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService, mockWallet } from "../test/mocking";
import { BindingType } from "./constants";
import { PublicKeyService } from "./public-key.service";

let subject: PublicKeyService;

test.before.each(async () => {
	subject = await createService(PublicKeyService, undefined, (container: IoC.Container) => {
		container.constant(BindingType.Zilliqa, mockWallet());
	});
});

describe("PublicKey", () => {
	test("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.is(result, { publicKey: identity.publicKey });
	});

	test("should fail to generate an output from an invalid mnemonic", async () => {
		await assert.is(subject.fromMnemonic(identity.mnemonic.slice(0, 10))).rejects.toThrowError();
	});
});
