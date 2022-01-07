import { describe } from "@payvo/sdk-test";

import { WIF } from "./wif.js";

describe("WIF", ({ assert, it, nock, loader }) => {
	it("should encode the given value", () => {
		assert.type(
			WIF.encode({
				compressed: true,
				privateKey: "d8839c2432bfd0a67ef10a804ba991eabba19f154a3d707917681d45822a5712",
				version: 170,
			}),
			"string",
		);
	});

	it("should decode the given value", () => {
		assert.equal(WIF.decode("SGq4xLgZKCGxs7bjmwnBrWcT4C1ADFEermj846KC97FSv1WFD1dA"), {
			compressed: true,
			privateKey: "d8839c2432bfd0a67ef10a804ba991eabba19f154a3d707917681d45822a5712",
			version: 170,
		});
	});
});
