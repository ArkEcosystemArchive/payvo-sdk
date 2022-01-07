import { describe } from "@payvo/sdk-test";

import { FeatureFlag } from "./enums.js";

describe("Enums", ({ assert, it, nock, loader }) => {
	it("should have feature flags", () => {
		assert.snapshot("enums-feature-flags", FeatureFlag);
	});
});
