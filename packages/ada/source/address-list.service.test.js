import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { ExtendedAddressService } from "./address-list.service";

describe("AddressListService", async ({ assert, beforeEach, it }) => {
	beforeEach((context) => {
		context.subject = new ExtendedAddressService();
	});

	it("should generate an output from a mnemonic", async (context) => {
		assert.length(await context.subject.fromMnemonic(identity.mnemonic, 20), 20);
	});
});
