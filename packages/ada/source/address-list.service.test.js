import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { ExtendedAddressService } from "./address-list.service";

let subject;

describe("AddressListService", async ({ assert, beforeEach, it }) => {
	beforeEach(() => {
		subject = new ExtendedAddressService();
	});

	it("should generate an output from a mnemonic", async () => {
		assert.length(await subject.fromMnemonic(identity.mnemonic, 20), 20);
	});
});
