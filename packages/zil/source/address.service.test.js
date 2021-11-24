import { describe } from "@payvo/sdk-test";

import { identity } from "../test/fixtures/identity";
import { createService, mockWallet } from "../test/mocking";
import { BindingType } from "./constants";
import { AddressService } from "./address.service";

let subject;

describe("AddressService", async ({ assert, beforeEach, it }) => {
	beforeEach(async () => {
		subject = await createService(AddressService, undefined, (container) => {
			container.constant(BindingType.Zilliqa, mockWallet());
		});
	});

	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { type: "bip44", address: identity.bech32Address });
	});

	it("should generate an output from a privateKey", async () => {
		const result = await subject.fromPrivateKey(identity.privateKey);

		assert.equal(result, { type: "bip44", address: identity.bech32Address });
	});

	it("should validate an address", async () => {
		assert.true(await subject.validate(identity.address));
		assert.true(await subject.validate(identity.bech32Address));
		assert.false(await subject.validate(identity.address.slice(0, 10)));
	});
});
