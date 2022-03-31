import { describe } from "@payvo/sdk-test";

import { manifest } from "../../ark/distribution/esm/manifest.js";
import { NetworkRepository } from "./network-repository.js";

describe("NetworkRepository", ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach((context) => (context.subject = new NetworkRepository(manifest.networks)));

	it("should get all values", (context) => {
		assert.length(Object.keys(context.subject.all()), 10);
	});

	it("should set, get and forget a network", (context) => {
		assert.object(context.subject.get("ark.devnet"));

		context.subject.push("ark.devnet", manifest.networks["ark.devnet"]);

		assert.object(context.subject.get("ark.devnet"));

		context.subject.forget("ark.devnet");

		assert.throws(() => context.subject.get("ark.devnet"), "The [ark.devnet] network is not supported.");
	});
});
