import { describe } from "@payvo/sdk-test";
import "reflect-metadata";

import { identity } from "../test/fixtures/identity";
import { bootContainer, importByMnemonic } from "../test/mocking";
import { ExtendedConfirmedTransactionDataCollection } from "./transaction.collection";
import * as promiseHelpers from "./helpers/promise";
import { Profile } from "./profile";
import { TransactionAggregate } from "./transaction.aggregate";

let subject;

describe("TransactionAggregate", ({ beforeAll, nock, assert, stub, it }) => {
	beforeAll(async (context) => {
		bootContainer();

		nock.fake()
			.get("/api/node/configuration/crypto")
			.reply(200, require("../test/fixtures/client/cryptoConfiguration.json"))
			.get("/api/node/configuration")
			.reply(200, require("../test/fixtures/client/configuration.json"))
			.get("/api/peers")
			.reply(200, require("../test/fixtures/client/peers.json"))
			.get("/api/node/syncing")
			.reply(200, require("../test/fixtures/client/syncing.json"))
			.get("/api/wallets/D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW")
			.reply(200, require("../test/fixtures/client/wallet.json"))
			.persist();

		const profile = new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" });

		await importByMnemonic(profile, identity.mnemonic, "ARK", "ark.devnet");

		context.subject = new TransactionAggregate(profile);
	});

	// describe.each(["all", "sent", "received"])("%s", (method) => {
	// 	it("should have more transactions", async (context) => {
	// 		nock.fake()
	// 			.get("/api/transactions")
	// 			.query(true)
	// 			.reply(200, require("../test/fixtures/client/transactions.json"));

	// 		const result = await subject[method]();

	// 		assert.instance(result, ExtendedConfirmedTransactionDataCollection);
	// 		assert.length(result.items(), 100);
	// 		assert.is(result.items()[0].amount(), 7.99999999);
	// 	});

	// 	it("should not have more transactions", async (context) => {
	// 		nock.fake()
	// 			.get("/api/transactions")
	// 			.query(true)
	// 			.reply(200, require("../test/fixtures/client/transactions-no-more.json"));

	// 		const result = await subject[method]();

	// 		assert.instance(result, ExtendedConfirmedTransactionDataCollection);
	// 		assert.length(result.items(), 100);
	// 		assert.false(context.subject.hasMore(method));
	// 	});

	// 	it("should skip error responses for processing", async (context) => {
	// 		nock.fake().get("/api/transactions").query(true).reply(404);

	// 		const result = await subject[method]();

	// 		assert.instance(result, ExtendedConfirmedTransactionDataCollection);
	// 		assert.length(result.items(), 0);
	// 		assert.false(context.subject.hasMore(method));
	// 	});

	// 	it("should skip empty responses for processing", async (context) => {
	// 		nock.fake()
	// 			.get("/api/transactions")
	// 			.query(true)
	// 			.reply(200, require("../test/fixtures/client/transactions-empty.json"));

	// 		const result = await subject[method]();

	// 		assert.instance(result, ExtendedConfirmedTransactionDataCollection);
	// 		assert.length(result.items(), 0);
	// 		assert.false(context.subject.hasMore(method));
	// 	});

	// 	it("should fetch transactions twice and then stop because no more are available", async (context) => {
	// 		nock.fake()
	// 			.get("/api/transactions")
	// 			.query(true)
	// 			.reply(200, require("../test/fixtures/client/transactions.json"))
	// 			.get("/api/transactions")
	// 			.query(true)
	// 			.reply(200, require("../test/fixtures/client/transactions-no-more.json"));

	// 		// We receive a response that does contain a "next" cursor
	// 		const firstRequest = await subject[method]();

	// 		assert.instance(firstRequest, ExtendedConfirmedTransactionDataCollection);
	// 		assert.length(firstRequest.items(), 100);
	// 		assert.true(context.subject.hasMore(method));

	// 		// We receive a response that does not contain a "next" cursor
	// 		const secondRequest = await subject[method]();

	// 		assert.instance(secondRequest, ExtendedConfirmedTransactionDataCollection);
	// 		assert.length(secondRequest.items(), 100);
	// 		assert.false(context.subject.hasMore(method));

	// 		// We do not send any requests because no more data is available
	// 		const thirdRequest = await subject[method]();

	// 		assert.instance(thirdRequest, ExtendedConfirmedTransactionDataCollection);
	// 		assert.length(thirdRequest.items(), 0);
	// 		assert.false(context.subject.hasMore(method));
	// 	});

	// 	it("should determine if it has more transactions to be requested", async (context) => {
	// 		nock.fake()
	// 			.get("/api/transactions")
	// 			.query(true)
	// 			.reply(200, require("../test/fixtures/client/transactions.json"));

	// 		assert.false(context.subject.hasMore(method));

	// 		await subject[method]();

	// 		assert.true(context.subject.hasMore(method));
	// 	});

	// 	it("should flush the history", async (context) => {
	// 		nock.fake()
	// 			.get("/api/transactions")
	// 			.query(true)
	// 			.reply(200, require("../test/fixtures/client/transactions.json"));

	// 		assert.false(context.subject.hasMore(method));

	// 		await subject[method]();

	// 		assert.true(context.subject.hasMore(method));

	// 		context.subject.flush(method);
	// 	});
	// });

	it("should flush all the history", async (context) => {
		nock.fake()
			.get("/api/transactions")
			.query(true)
			.reply(200, require("../test/fixtures/client/transactions.json"));

		assert.false(context.subject.hasMore("transactions"));

		await context.subject.all();

		assert.true(context.subject.hasMore("all"));

		context.subject.flush();
	});

	it("should handle undefined  promiseAllSettledByKey responses in aggregate", async (context) => {
		nock.fake()
			.get("/api/transactions")
			.query(true)
			.reply(200, require("../test/fixtures/client/transactions.json"));

		stub(promiseHelpers, "promiseAllSettledByKey").callsFake(() => {
			return Promise.resolve(undefined);
		});

		const results = await context.subject.all();
		assert.instance(results, ExtendedConfirmedTransactionDataCollection);
	});

	it("should aggregate and filter transactions based on provided identifiers of type `address`", async (context) => {
		nock.fake()
			.get("/api/transactions")
			.query(true)
			.reply(200, require("../test/fixtures/client/transactions.json"));

		const result = await context.subject.all({
			identifiers: [{ type: "address", value: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW" }],
		});

		assert.instance(result, ExtendedConfirmedTransactionDataCollection);
		assert.length(result.items(), 100);

		context.subject.flush();
	});

	it("should aggregate and filter transactions based on provided identifiers of type `extendedPublicKey`", async (context) => {
		nock.fake()
			.get("/api/transactions")
			.query(true)
			.reply(200, require("../test/fixtures/client/transactions.json"));

		const result = await context.subject.all({
			identifiers: [
				{
					type: "extendedPublicKey",
					value: "030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
				},
			],
		});

		assert.instance(result, ExtendedConfirmedTransactionDataCollection);
		assert.length(result.items(), 100);

		context.subject.flush();
	});
});