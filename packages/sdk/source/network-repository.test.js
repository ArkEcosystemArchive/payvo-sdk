import { assert, test } from "@payvo/sdk-test";
import { manifest } from "../../../ark/distribution/manifest";
import { NetworkRepository } from "./network-repository";

let subject;

test.before.each(() => (subject = new NetworkRepository(manifest.networks)));

test("#all", () => {
	assert.length(subject.all(), 6);
});

test("#get | #push | #forget", () => {
	assert.is(subject.get("ark.devnet"), "object");

	subject.push("ark.devnet", manifest.networks["ark.devnet"]);

	assert.is(subject.get("ark.devnet"), "object");

	subject.forget("ark.devnet");

	assert.throws(() => subject.get("ark.devnet"), "The [ark.devnet] network is not supported.");
});
