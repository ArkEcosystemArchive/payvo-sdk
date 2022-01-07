import { describe } from "@payvo/sdk-test";

import { WalletDataCollection } from "./wallets.collection.js";

describe("WalletDataCollection", ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(
		(context) =>
			(context.subject = new WalletDataCollection(
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

	it("#findByAddress", (context) => {
		assert.object(context.subject.findByAddress("address"));
	});

	it("#findByPublicKey", (context) => {
		assert.object(context.subject.findByPublicKey("publicKey"));
	});

	it("#findByUsername", (context) => {
		assert.object(context.subject.findByUsername("username"));
	});
});
