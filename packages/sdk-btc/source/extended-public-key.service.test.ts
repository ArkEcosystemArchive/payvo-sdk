import "jest-extended";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { ExtendedPublicKeyService } from "./extended-public-key.service";

let subject: ExtendedPublicKeyService;

beforeEach(async () => {
	subject = createService(ExtendedPublicKeyService);
});

describe("Address", () => {
	test("#fromMnemonic", async () => {
		await expect(subject.fromMnemonic(identity.mnemonic)).resolves.toBe("xpub661MyMwAqRbcGhVeaVfEBA25e3cP9DsJQZoE8iep5fZSxy3TnPBNBgWnMZx56oreNc48ZoTkQfatNJ9VWnQ7ZcLZcVStpaXLTeG8bGrzX3n");
	});
});
