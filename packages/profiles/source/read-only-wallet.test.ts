import { identity } from "../test/fixtures/identity.js";
import { ReadOnlyWallet } from "./read-only-wallet.js";

let subject: ReadOnlyWallet;

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

it("should have an address", () => {
	assert.is(subject.address(), identity.address);
});

it("should have a publicKey", () => {
	assert.is(subject.publicKey(), identity.publicKey);
});

it("should have an username", () => {
	assert.is(subject.username(), "arkx");
});

it("should have an avatar", () => {
	assert
		.is(subject.avatar())
		.toMatchInlineSnapshot(
			`"<svg version=\\"1.1\\" xmlns=\\"http://www.w3.org/2000/svg\\" class=\\"picasso\\" width=\\"100\\" height=\\"100\\" viewBox=\\"0 0 100 100\\"><style>.picasso circle{mix-blend-mode:soft-light;}</style><rect fill=\\"rgb(244, 67, 54)\\" width=\\"100\\" height=\\"100\\"/><circle r=\\"45\\" cx=\\"80\\" cy=\\"40\\" fill=\\"rgb(139, 195, 74)\\"/><circle r=\\"40\\" cx=\\"10\\" cy=\\"30\\" fill=\\"rgb(0, 188, 212)\\"/><circle r=\\"60\\" cx=\\"30\\" cy=\\"50\\" fill=\\"rgb(255, 193, 7)\\"/></svg>"`,
		);
});

it("should have an explorer link", () => {
	assert.is(subject.explorerLink(), "https://google.com");
});

it("should have an address as governance identifier", () => {
	assert.is(subject.governanceIdentifier(), identity.address);
});

it("should have an publicKey as governance identifier", () => {
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
