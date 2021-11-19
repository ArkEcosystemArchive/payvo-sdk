import { assert, test } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { ExtendedAddressService } from "./address-list.service";

test("#fromMnemonic", async () => {
	const subject = new ExtendedAddressService();

	assert.length(await subject.fromMnemonic(identity.mnemonic, 20), 20);
});

test.run();
