import { identity } from "../test/fixtures/identity";
import { createService, require } from "../test/mocking";
import { AddressService } from "./address.service";

let subject: AddressService;

beforeEach(async () => {
	subject = await createService(AddressService);
});

describe("Address", () => {
	describe("#fromMnemonic", () => {
		it("should generate an output from a mnemonic", async () => {
			await expect(subject.fromMnemonic(identity.mnemonic)).resolves.toMatchInlineSnapshot(`
						Object {
						  "address": "TAq9SwPACv2Ut6YGJK4T8Pw57AGNmFArdP",
						  "path": "m/44'/195'/0'/0/0",
						  "type": "bip44",
						}
					`);
		});
	});
});
