import { describe } from "@payvo/sdk-test";
import { WalletDataCollection } from "./wallets.collection";

let subject;

describe("WalletDataCollection", ({ assert, beforeEach, it }) => {
	beforeEach(
		() =>
			(subject = new WalletDataCollection(
				[
					// @ts-ignore
					{
						address: () => "address",
						publicKey: () => "publicKey",
						username: () => "username",
					},
				],
				{ next: "", prev: "", self: "" },
			)),
	);

	it("#findByAddress", () => {
		assert.object(subject.findByAddress("address"));
	});

	it("#findByPublicKey", () => {
		assert.object(subject.findByPublicKey("publicKey"));
	});

	it("#findByUsername", () => {
		assert.object(subject.findByUsername("username"));
	});
});
