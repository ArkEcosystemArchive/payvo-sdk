import "reflect-metadata";

import { bootContainer } from "../test/mocking";
import { Contact } from "./contact";
import { ContactAddressRepository } from "./contact-address.repository";
import { Profile } from "./profile";

test.before(() => bootContainer());

describe("contact", () => {
	let subject: Contact;

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
		assert.is(subject.isStarred(), true);
	});

	test("should be able to toggle starred state", () => {
		subject.toggleStarred();
		assert.is(subject.isStarred(), false);
	});

	test("should have an avatar", () => {
		assert
			.is(subject.avatar())
			.toMatchInlineSnapshot(
				`"<svg version=\\"1.1\\" xmlns=\\"http://www.w3.org/2000/svg\\" class=\\"picasso\\" width=\\"100\\" height=\\"100\\" viewBox=\\"0 0 100 100\\"><style>.picasso circle{mix-blend-mode:soft-light;}</style><rect fill=\\"rgb(233, 30, 99)\\" width=\\"100\\" height=\\"100\\"/><circle r=\\"45\\" cx=\\"80\\" cy=\\"30\\" fill=\\"rgb(76, 175, 80)\\"/><circle r=\\"55\\" cx=\\"0\\" cy=\\"60\\" fill=\\"rgb(255, 152, 0)\\"/><circle r=\\"40\\" cx=\\"50\\" cy=\\"50\\" fill=\\"rgb(3, 169, 244)\\"/></svg>"`,
			);
	});

	test("should map to object", () => {
		assert.is(subject.toObject()).toStrictEqual({
			addresses: [],
			id: "uuid",
			name: "John Doe",
			starred: true,
		});
	});

	test("should return addresses", () => {
		assert.is(subject.addresses() instanceof ContactAddressRepository);
	});

	test("should be able to set addresses", () => {
		assert.is(() => subject.setAddresses([])).toThrowError('"addresses" must contain at least 1 items');

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
