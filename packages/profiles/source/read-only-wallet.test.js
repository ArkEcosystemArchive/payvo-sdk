import { assert, describe, stub, loader, test } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { ReadOnlyWallet } from "./read-only-wallet";

let subject;

test.before.each(async () => {
	subject = new ReadOnlyWallet({
		address: identity.address,
		publicKey: identity.publicKey,
		username: "arkx",
		rank: 1,
		explorerLink: "https://google.com",
		isDelegate: false,
		isResignedDelegate: false,
		governanceIdentifier: "address",
	});
});

test("should have an address", () => {
	assert.is(subject.address(), identity.address);
});

test("should have a publicKey", () => {
	assert.is(subject.publicKey(), identity.publicKey);
});

test("should have an username", () => {
	assert.is(subject.username(), "arkx");
});

test("should have an avatar", () => {
	assert.string(subject.avatar());
});

test("should have an explorer link", () => {
	assert.is(subject.explorerLink(), "https://google.com");
});

test("should have an address as governance identifier", () => {
	assert.is(subject.governanceIdentifier(), identity.address);
});

test("should have an publicKey as governance identifier", () => {
	subject = new ReadOnlyWallet({
		address: identity.address,
		publicKey: identity.publicKey,
		username: "arkx",
		rank: 1,
		explorerLink: "https://google.com",
		isDelegate: false,
		isResignedDelegate: false,
		governanceIdentifier: "publicKey",
	});

	assert.is(subject.governanceIdentifier(), identity.publicKey);
});

test.run();
