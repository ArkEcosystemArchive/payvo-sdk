import { describe } from "@payvo/sdk-test";
import { manifest } from "../../ark/distribution/manifest";
import { NetworkRepository } from "./network-repository";

let subject;

describe("NetworkRepository", ({ assert, beforeEach, it }) => {
	beforeEach(() => (subject = new NetworkRepository(manifest.networks)));

	it("should get all values", () => {
		assert.length(Object.keys(subject.all()), 8);
	});

	it("should set, get and forget a network", () => {
		assert.object(subject.get("ark.devnet"));

		subject.push("ark.devnet", manifest.networks["ark.devnet"]);

		assert.object(subject.get("ark.devnet"));

		subject.forget("ark.devnet");

		assert.throws(() => subject.get("ark.devnet"), "The [ark.devnet] network is not supported.");
	});
});
