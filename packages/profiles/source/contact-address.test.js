import { assert, describe, stub, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { bootContainer } from "../test/mocking";
import { ContactAddress } from "./contact-address";
import { Profile } from "./profile";

let subject;

test.before(() => bootContainer());

test.before.each(() => {
	const profile = new Profile({ id: "profile-id", name: "name", avatar: "avatar", data: "" });

	subject = new ContactAddress(
		{
			id: "uuid",
			coin: "ARK",
			network: "ark.devnet",
			address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
		},
		profile,
	);
});

test("should have an id", () => {
	assert.is(subject.id(), "uuid");
});

test("should have a coin", () => {
	assert.is(subject.coin(), "ARK");
});

test("should have a network", () => {
	assert.is(subject.network(), "ark.devnet");
});

test("should have an address", () => {
	assert.is(subject.address(), "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW");
});

test("should have an avatar", () => {
	assert.string(subject.avatar());
});

test("should turn into an object", () => {
	assert.equal(subject.toObject(), {
		address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
		coin: "ARK",
		id: "uuid",
		network: "ark.devnet",
	});
});

test("should change the address", () => {
	subject.setAddress("new address");
	assert.is(subject.address(), "new address");
});

test.run();
