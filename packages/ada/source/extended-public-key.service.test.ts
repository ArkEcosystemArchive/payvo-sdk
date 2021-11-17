import "jest-extended";

import { createService } from "../test/mocking";
import { ExtendedPublicKeyService } from "./extended-public-key.service";

let subject: ExtendedPublicKeyService;

beforeEach(async () => {
	subject = await createService(ExtendedPublicKeyService);
});

describe("ExtendedPublicKeyService", () => {
	test("#fromMnemonic", async () => {
		await expect(
			subject.fromMnemonic(
				"excess behave track soul table wear ocean cash stay nature item turtle palm soccer lunch horror start stumble month panic right must lock dress",
			),
		).resolves.toBe(
			"xpub14mpsxvx74mxaw5p3jksdwvp9d7h0sup8qg43hhd8eg9xr09q540y64667k5nhh6fqk3hqtadah69r6jcg7gayvadayykt4sghtzhxpqca4vve",
		);
	});
});
