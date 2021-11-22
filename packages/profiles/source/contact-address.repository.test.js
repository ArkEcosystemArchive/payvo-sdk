import { assert, describe, mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { UUID } from "@payvo/sdk-cryptography";

import { bootContainer } from "../test/mocking";
import { IContactAddressInput } from "./contact-address.contract";
import { ContactAddressRepository } from "./contact-address.repository";
import { Profile } from "./profile";

let subject;
let profile;

const stubData = {
	address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
	coin: "ARK",
	network: "ark.devnet",
};

test.before.each(() => {
	profile = new Profile({ avatar: "avatar", data: "", id: "uuid", name: "name" });
	subject = new ContactAddressRepository(profile);
});

test.before(() => {
	bootContainer();
});

test("#create", () => {
	assert.length(subject.keys(), 0);

	subject.create(stubData);

	assert.length(subject.keys(), 1);

	// @TODO
	// assert.equal(subject.first().toObject(), {
	// 	id: expect.any(String),
	// 	...stubData,
	// });
});

test("#all", () => {
	assert.object(subject.all());
});

test("#first", () => {
	const address = subject.create(stubData);

	assert.is(subject.first(), address);
});

test("#last", () => {
	const address = subject.create(stubData);

	assert.is(subject.last(), address);
});

test("#count", () => {
	subject.create(stubData);

	assert.is(subject.count(), 1);
});

test("#fill", () => {
	const id = UUID.random();

	subject.fill([{ id, ...stubData }]);

	assert.object(subject.findById(id));
});

test("#toArray", () => {
	const address = subject.create(stubData);

	assert.equal(subject.toArray(), [address.toObject()]);
});

test("#find", () => {
	assert.throws(() => subject.findById("invalid"), "Failed to find");

	const address = subject.create(stubData);

	assert.object(subject.findById(address.id()));
});

test("#update invalid", () => {
	assert.throws(() => subject.update("invalid", { address: stubData.address }), "Failed to find");
});

test("#update address", () => {
	const address = subject.create(stubData);

	subject.update(address.id(), { address: "new address" });

	assert.is(subject.findByAddress("new address")[0].address(), "new address");
	assert.true(profile.status().isDirty());
});

test("#update without address", () => {
	const address = subject.create(stubData);

	subject.update(address.id(), {});

	assert.equal(subject.findByAddress("new address"), []);
});

test("#forget", () => {
	assert.throws(() => subject.forget("invalid"), "Failed to find");

	const address = subject.create(stubData);

	subject.forget(address.id());

	assert.throws(() => subject.findById(address.id()), "Failed to find");
});

test("#findByAddress", () => {
	const address = subject.create(stubData);

	assert.length(subject.findByAddress(address.address()), 1);
	assert.length(subject.findByAddress("invalid"), 0);
});

test("#findByCoin", () => {
	const address = subject.create(stubData);

	assert.length(subject.findByCoin(address.coin()), 1);
	assert.length(subject.findByCoin("invalid"), 0);
});

test("#findByNetwork", () => {
	const address = subject.create(stubData);

	assert.length(subject.findByNetwork(address.network()), 1);
	assert.length(subject.findByNetwork("invalid"), 0);
});

test("#flush", () => {
	subject.create(stubData);

	assert.length(subject.keys(), 1);

	subject.flush();

	assert.length(subject.keys(), 0);
});

test("#exists", () => {
	subject.create(stubData);

	assert.true(subject.exists(stubData));

	assert.false(
		subject.exists({
			address: "DAWdHfDFEvvu57cHjAhs5K5di33B2DdCu1",
			coin: "ARK",
			network: "ark.devnet",
		}),
	);
});

test.run();
