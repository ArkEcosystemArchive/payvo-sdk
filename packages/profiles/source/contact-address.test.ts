import "reflect-metadata";

import { bootContainer } from "../test/mocking.js";
import { ContactAddress } from "./contact-address.js";
import { Profile } from "./profile.js";

let subject: ContactAddress;

beforeAll(() => bootContainer());

beforeEach(() => {
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

it("should have an id", () => {
	expect(subject.id()).toBe("uuid");
});

it("should have a coin", () => {
	expect(subject.coin()).toBe("ARK");
});

it("should have a network", () => {
	expect(subject.network()).toBe("ark.devnet");
});

it("should have an address", () => {
	expect(subject.address()).toBe("D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW");
});

it("should have an avatar", () => {
	expect(subject.avatar()).toMatchInlineSnapshot(
		`"<svg version=\\"1.1\\" xmlns=\\"http://www.w3.org/2000/svg\\" class=\\"picasso\\" width=\\"100\\" height=\\"100\\" viewBox=\\"0 0 100 100\\"><style>.picasso circle{mix-blend-mode:soft-light;}</style><rect fill=\\"rgb(244, 67, 54)\\" width=\\"100\\" height=\\"100\\"/><circle r=\\"45\\" cx=\\"80\\" cy=\\"40\\" fill=\\"rgb(139, 195, 74)\\"/><circle r=\\"40\\" cx=\\"10\\" cy=\\"30\\" fill=\\"rgb(0, 188, 212)\\"/><circle r=\\"60\\" cx=\\"30\\" cy=\\"50\\" fill=\\"rgb(255, 193, 7)\\"/></svg>"`,
	);
});

it("should turn into an object", () => {
	expect(subject.toObject()).toEqual({
		address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
		coin: "ARK",
		id: "uuid",
		network: "ark.devnet",
	});
});

it("should change the address", () => {
	subject.setAddress("new address");
	expect(subject.address()).toBe("new address");
});
