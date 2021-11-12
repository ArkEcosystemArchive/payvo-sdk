import "jest-extended";
import "reflect-metadata";

import { bootContainer } from "../test/mocking";
import { ContactRepository } from "./contact.repository";
import { Profile } from "./profile";

let subject: ContactRepository;

const name = "John Doe";
const addr = { coin: "ARK", network: "ark.devnet", address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW" };
const addr2 = { coin: "ARK", network: "ark.devnet", address: "DAWdHfDFEvvu57cHjAhs5K5di33B2DdCu1" };

beforeAll(() => bootContainer());

beforeEach(() => {
	const profile = new Profile({ id: "profile-id", name: "name", avatar: "avatar", data: "" });

	subject = new ContactRepository(profile);

	subject.flush();
});

test("#first | #last", () => {
	const john = subject.create("John", [addr]);
	const jane = subject.create("Jane", [addr]);

	expect(subject.first()).toEqual(john);
	expect(subject.last()).toEqual(jane);
});

test("#create", () => {
	expect(subject.keys()).toHaveLength(0);

	const result = subject.create(name, [addr]);

	expect(subject.keys()).toHaveLength(1);

	expect(result.toObject()).toStrictEqual({
		id: result.id(),
		name,
		starred: false,
		addresses: [{ id: expect.any(String), ...addr }],
	});

	expect(() => subject.create(name, [addr])).toThrowError(`The contact [${name}] already exists.`);
	expect(() => subject.create("Jane Doe", [])).toThrowError('"addresses" must contain at least 1 items');
	expect(subject.count()).toEqual(1);

	expect(() =>
		subject.create("InvalidAddress", [
			{
				coin: "ARK",
				network: "ark.devnet",
				// @ts-ignore
				address: undefined,
			},
		]),
	).toThrowError('addresses[0].address" is required');

	expect(subject.count()).toEqual(1);

	expect(() =>
		subject.create("InvalidAddress", [
			{
				// @ts-ignore
				coin: undefined,
				network: "ark.devnet",
				address: "a",
			},
		]),
	).toThrowError('addresses[0].coin" is required');

	expect(subject.count()).toEqual(1);

	expect(() =>
		subject.create("InvalidAddress", [
			{
				coin: "ARK",
				// @ts-ignore
				network: undefined,
				address: "a",
			},
		]),
	).toThrowError('addresses[0].network" is required');

	expect(subject.count()).toEqual(1);
});

test("#find", () => {
	expect(() => subject.findById("invalid")).toThrowError("Failed to find");

	const contact = subject.create(name, [addr]);

	expect(subject.findById(contact.id())).toBeObject();
});

test("#update", () => {
	expect(() => subject.update("invalid", { name: "Jane Doe" })).toThrowError("Failed to find");

	const contact = subject.create(name, [addr]);

	subject.update(contact.id(), { name: "Jane Doe" });

	expect(subject.findById(contact.id()).name()).toEqual("Jane Doe");

	const anotherContact = subject.create("Another name", [addr]);

	expect(() => subject.update(anotherContact.id(), { name: "Dorothy" })).not.toThrow();

	const newContact = subject.create("Another name", [addr]);

	expect(() => subject.update(newContact.id(), { name: "Jane Doe" })).toThrowError(
		"The contact [Jane Doe] already exists.",
	);
});

test("#update with addresses", () => {
	const contact = subject.create(name, [addr]);

	expect(() => subject.update(contact.id(), { addresses: [] })).toThrowError(
		'"addresses" must contain at least 1 items',
	);

	expect(subject.findById(contact.id()).addresses().keys()).toHaveLength(1);

	subject.update(contact.id(), { addresses: [addr2] });

	expect(contact.toObject().addresses).toEqual([{ id: expect.any(String), ...addr2 }]);
});

test("#forget", () => {
	expect(() => subject.forget("invalid")).toThrowError("Failed to find");

	const contact = subject.create(name, [addr]);

	subject.forget(contact.id());

	expect(() => subject.findById(contact.id())).toThrowError("Failed to find");
});

test("#findByAddress", () => {
	subject.create(name, [addr]);

	expect(subject.findByAddress(addr.address)).toHaveLength(1);
	expect(subject.findByAddress("invalid")).toHaveLength(0);
});

test("#findByCoin", () => {
	subject.create(name, [addr]);

	expect(subject.findByCoin(addr.coin)).toHaveLength(1);
	expect(subject.findByCoin("invalid")).toHaveLength(0);
});

test("#findByNetwork", () => {
	subject.create(name, [addr]);

	expect(subject.findByNetwork(addr.network)).toHaveLength(1);
	expect(subject.findByNetwork("invalid")).toHaveLength(0);
});

test("#flush", () => {
	subject.create(name, [addr]);

	expect(subject.keys()).toHaveLength(1);

	subject.flush();

	expect(subject.keys()).toHaveLength(0);
});
