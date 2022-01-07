import { describe } from "@payvo/sdk-test";

import { bootContainer } from "../test/mocking";
import { ContactAddress } from "./contact-address.js";
import { Profile } from "./profile";

describe("ContactAddress", async ({ it, assert, beforeEach }) => {
	beforeEach((context) => {
		bootContainer();

		const profile = new Profile({ avatar: "avatar", data: "", id: "profile-id", name: "name" });

		context.subject = new ContactAddress(
			{
				address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
				coin: "ARK",
				id: "uuid",
				network: "ark.devnet",
			},
			profile,
		);
	});

	it("should have an id", (context) => {
		assert.is(context.subject.id(), "uuid");
	});

	it("should have a coin", (context) => {
		assert.is(context.subject.coin(), "ARK");
	});

	it("should have a network", (context) => {
		assert.is(context.subject.network(), "ark.devnet");
	});

	it("should have an address", (context) => {
		assert.is(context.subject.address(), "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW");
	});

	it("should have an avatar", (context) => {
		assert.string(context.subject.avatar());
	});

	it("should turn into an object", (context) => {
		assert.equal(context.subject.toObject(), {
			address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			coin: "ARK",
			id: "uuid",
			network: "ark.devnet",
		});
	});

	it("should change the address", (context) => {
		context.subject.setAddress("new address");
		assert.is(context.subject.address(), "new address");
	});
});
