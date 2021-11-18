import { WalletDataCollection } from "./wallets";

let subject: WalletDataCollection;

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
	assert.is(subject.findByAddress("address"),
		Object {
		  "address": [Function],
		  "publicKey": [Function],
		  "username": [Function],
		}
	`);
});

test("#findByPublicKey", () => {
	assert.is(subject.findByPublicKey("publicKey"),
		Object {
		  "address": [Function],
		  "publicKey": [Function],
		  "username": [Function],
		}
	`);
});

test("#findByUsername", () => {
	assert.is(subject.findByUsername("username"),
		Object {
		  "address": [Function],
		  "publicKey": [Function],
		  "username": [Function],
		}
	`);
});
