import { describe } from "@payvo/sdk-test";

import { identity } from "../test/fixtures/identity";
import { createService, mockWallet } from "../test/mocking";
import { BindingType } from "./constants";
import { PrivateKeyService } from "./private-key.service";

let subject;

describe("PrivateKeyService", async ({ assert, beforeEach, it }) => {
	beforeEach(async () => {
		subject = await createService(PrivateKeyService, undefined, (container) => {
			container.constant(BindingType.Zilliqa, mockWallet());
		});
	});

	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { privateKey: identity.privateKey });
	});

	it("should fail to generate an output from an invalid mnemonic", async () => {
		await assert.rejects(() => subject.fromMnemonic(identity.mnemonic.slice(0, 10)));
	});
});
