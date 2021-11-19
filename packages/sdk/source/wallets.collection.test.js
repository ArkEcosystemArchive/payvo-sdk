import { assert, test } from "@payvo/sdk-test";
import { WalletDataCollection } from "./wallets";

let subject;

test.before.each(
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

test("#findByAddress", () => {
	assert.object(subject.findByAddress("address"));
});

test("#findByPublicKey", () => {
	assert.object(subject.findByPublicKey("publicKey"));
});

test("#findByUsername", () => {
	assert.object(subject.findByUsername("username"));
});

test.run();
