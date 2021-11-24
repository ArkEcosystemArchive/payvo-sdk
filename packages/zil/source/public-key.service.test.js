import { describe } from "@payvo/sdk-test";

import { identity } from "../test/fixtures/identity";
import { createService, mockWallet } from "../test/mocking";
import { BindingType } from "./constants";
import { PublicKeyService } from "./public-key.service";

let subject;

describe("AddressService", async ({ assert, beforeEach, it }) => {
beforeEach(async () => {
	subject = await createService(PublicKeyService, undefined, (container) => {
		container.constant(BindingType.Zilliqa, mockWallet());
	});
});

it("should generate an output from a mnemonic", async () => {
	const result = await subject.fromMnemonic(identity.mnemonic);

	assert.equal(result, { publicKey: identity.publicKey });
});

it("should fail to generate an output from an invalid mnemonic", async () => {
	await assert.rejects(() => subject.fromMnemonic(identity.mnemonic.slice(0, 10)));
});
});
