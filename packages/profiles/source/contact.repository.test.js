import { assert, describe, mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { bootContainer } from "../test/mocking";
import { ContactRepository } from "./contact.repository";
import { Profile } from "./profile";

let subject;

const name = "John Doe";
const addr = { coin: "ARK", network: "ark.devnet", address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW" };
const addr2 = { coin: "ARK", network: "ark.devnet", address: "DAWdHfDFEvvu57cHjAhs5K5di33B2DdCu1" };

test.before(() => bootContainer());

test.before.each(() => {
	const profile = new Profile({ id: "profile-id", name: "name", avatar: "avatar", data: "" });

	subject = new ContactRepository(profile);

	subject.flush();
});

test("#first | #last", () => {
	const john = subject.create("John", [addr]);
	const jane = subject.create("Jane", [addr]);

	assert.is(subject.first(), john);
	assert.is(subject.last(), jane);
});

test("#create", () => {
	assert.length(subject.keys(), 0);

	const result = subject.create(name, [addr]);

	assert.length(subject.keys(), 1);

	// @TODO
	// assert.equal(result.toObject(), {
	// 	id: result.id(),
	// 	name,
	// 	starred: false,
	// 	addresses: [
	// 		{
	// 			"id": "37c41631-1452-4d0a-b951-b3a25be96fe9",
	// 			"coin": "ARK",
	// 			"network": "ark.devnet",
	// 			"address": "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW"
	// 			}
	// 	],
	// });

	assert.throws(() => subject.create(name, [addr]), `The contact [${name}] already exists.`);
	assert.throws(() => subject.create("Jane Doe", []), '"addresses" must contain at least 1 items');
	assert.is(subject.count(), 1);

	assert.throws(
		() =>
			subject.create("InvalidAddress", [
				{
					coin: "ARK",
					network: "ark.devnet",
					address: undefined,
				},
			]),
		'addresses[0].address" is required',
	);

	assert.is(subject.count(), 1);

	assert.throws(
		() =>
			subject.create("InvalidAddress", [
				{
					coin: undefined,
					network: "ark.devnet",
					address: "a",
				},
			]),
		'addresses[0].coin" is required',
	);

	assert.is(subject.count(), 1);

	assert.throws(
		() =>
			subject.create("InvalidAddress", [
				{
					coin: "ARK",
					network: undefined,
					address: "a",
				},
			]),
		'addresses[0].network" is required',
	);

	assert.is(subject.count(), 1);
});

test("#find", () => {
	assert.throws(() => subject.findById("invalid"), "Failed to find");

	const contact = subject.create(name, [addr]);

	assert.object(subject.findById(contact.id()));
});

test("#update", () => {
	assert.throws(() => subject.update("invalid", { name: "Jane Doe" }), "Failed to find");

	const contact = subject.create(name, [addr]);

	subject.update(contact.id(), { name: "Jane Doe" });

	assert.is(subject.findById(contact.id()).name(), "Jane Doe");

	const anotherContact = subject.create("Another name", [addr]);

	assert.not.throws(() => subject.update(anotherContact.id(), { name: "Dorothy" }));

	const newContact = subject.create("Another name", [addr]);

	assert.throws(
		() => subject.update(newContact.id(), { name: "Jane Doe" }),
		"The contact [Jane Doe] already exists.",
	);
});

test("#update with addresses", () => {
	const contact = subject.create(name, [addr]);

	assert.throws(() => subject.update(contact.id(), { addresses: [] }), '"addresses" must contain at least 1 items');

	assert.length(subject.findById(contact.id()).addresses().keys(), 1);

	subject.update(contact.id(), { addresses: [addr2] });

	assert.array(contact.toObject().addresses);
});

test("#forget", () => {
	assert.throws(() => subject.forget("invalid"), "Failed to find");

	const contact = subject.create(name, [addr]);

	subject.forget(contact.id());

	assert.throws(() => subject.findById(contact.id()), "Failed to find");
});

test("#findByAddress", () => {
	subject.create(name, [addr]);

	assert.length(subject.findByAddress(addr.address), 1);
	assert.length(subject.findByAddress("invalid"), 0);
});

test("#findByCoin", () => {
	subject.create(name, [addr]);

	assert.length(subject.findByCoin(addr.coin), 1);
	assert.length(subject.findByCoin("invalid"), 0);
});

test("#findByNetwork", () => {
	subject.create(name, [addr]);

	assert.length(subject.findByNetwork(addr.network), 1);
	assert.length(subject.findByNetwork("invalid"), 0);
});

test("#flush", () => {
	subject.create(name, [addr]);

	assert.length(subject.keys(), 1);

	subject.flush();

	assert.length(subject.keys(), 0);
});

test.run();
