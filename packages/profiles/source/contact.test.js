import { assert, describe, Mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { bootContainer } from "../test/mocking";
import { Contact } from "./contact";
import { ContactAddressRepository } from "./contact-address.repository";
import { Profile } from "./profile";

test.before(() => bootContainer());

describe("contact", ({ afterEach, beforeEach, test }) => {
	let subject;

	test.before.each(() => {
		const profile = new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" });
		profile.coins().set("ARK", "ark.devnet");

		subject = new Contact(
			{
				id: "uuid",
				name: "John Doe",
				starred: true,
			},
			profile,
		);
	});

	test("should have an id", () => {
		assert.is(subject.id(), "uuid");
	});

	test("should have a name", () => {
		assert.is(subject.name(), "John Doe");
	});

	test("should be able to change name", () => {
		subject.setName("Jane Doe");
		assert.is(subject.name(), "Jane Doe");
	});

	test("should have starred state", () => {
		assert.true(subject.isStarred());
	});

	test("should be able to toggle starred state", () => {
		subject.toggleStarred();
		assert.false(subject.isStarred());
	});

	test("should have an avatar", () => {
		assert.string(subject.avatar());
	});

	test("should map to object", () => {
		assert.equal(subject.toObject(), {
			addresses: [],
			id: "uuid",
			name: "John Doe",
			starred: true,
		});
	});

	test("should return addresses", () => {
		assert.instance(subject.addresses(), ContactAddressRepository);
	});

	test("should be able to set addresses", () => {
		assert.throws(() => subject.setAddresses([]), '"addresses" must contain at least 1 items');

		subject.setAddresses([
			{
				coin: "ARK",
				network: "ark.devnet",
				address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			},
		]);

		assert.is(subject.addresses().count(), 1);
	});
});

test.run();
