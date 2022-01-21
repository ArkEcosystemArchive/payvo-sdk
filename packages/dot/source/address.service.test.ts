import { describe } from "@payvo/sdk-test";
import { IoC } from "@payvo/sdk";
import { cryptoWaitReady } from "@polkadot/util-crypto";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { BindingType } from "./constants";
import { createKeyring } from "./factories";
import { AddressService } from "./address.service.js";

describe("AddressService", async ({ beforeEach, assert, it, nock, loader }) => {
	beforeEach(async (context) => {
		await cryptoWaitReady();

		context.subject = await createService(AddressService, undefined, async (container) => {
			container.constant(BindingType.Keyring, createKeyring(container.get(IoC.BindingType.ConfigRepository)));
		});
	});

	it("should generate an output from a mnemonic", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { type: "ss58", address: identity.address });
	});

	it("should generate an output from a multiSignature", async (context) => {
		const result = await context.subject.fromMultiSignature({
			min: identity.multiSignature.min,
			publicKeys: identity.multiSignature.publicKeys,
		});

		assert.equal(result, { type: "ss58", address: identity.multiSignatureAddress });
	});

	it("should validate an address", async (context) => {
		assert.true(await context.subject.validate(identity.address));
		assert.false(await context.subject.validate(identity.address.slice(0, 10)));
	});
});
