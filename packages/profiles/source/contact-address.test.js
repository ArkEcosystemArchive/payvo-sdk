import "reflect-metadata";

import { bootContainer } from "../test/mocking";
import { ContactAddress } from "./contact-address";
import { Profile } from "./profile";

let subject: ContactAddress;

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
	assert
		.is(subject.avatar())
		.toMatchInlineSnapshot(
			`"<svg version=\\"1.1\\" xmlns=\\"http://www.w3.org/2000/svg\\" class=\\"picasso\\" width=\\"100\\" height=\\"100\\" viewBox=\\"0 0 100 100\\"><style>.picasso circle{mix-blend-mode:soft-light;}</style><rect fill=\\"rgb(244, 67, 54)\\" width=\\"100\\" height=\\"100\\"/><circle r=\\"45\\" cx=\\"80\\" cy=\\"40\\" fill=\\"rgb(139, 195, 74)\\"/><circle r=\\"40\\" cx=\\"10\\" cy=\\"30\\" fill=\\"rgb(0, 188, 212)\\"/><circle r=\\"60\\" cx=\\"30\\" cy=\\"50\\" fill=\\"rgb(255, 193, 7)\\"/></svg>"`,
		);
});

test("should turn into an object", () => {
	assert.is(subject.toObject(), {
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
