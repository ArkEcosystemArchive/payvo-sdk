import { Collections, IoC, Services } from "@payvo/sdk";
import { describe } from "@payvo/sdk-test";

import { createService } from "../test/mocking";
import { ClientService } from "./client.service.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";

describe("ClientService", async ({ assert, beforeAll, it, nock, loader }) => {
	beforeAll(async (context) => {
		context.subject = await createService(ClientService, undefined, (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.constant(IoC.BindingType.DataTransferObjects, {
				ConfirmedTransactionData,
				SignedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		});
	});

	it("should retrieve a single transaction", async (context) => {
		nock.fake()
			.post("/ext/bc/X", ({ method }) => method === "avm.getTx")
			.reply(200, loader.json("test/fixtures/client/avm-get-tx.json"))
			.get("/v2/transactions")
			.query(true)
			.reply(200, loader.json("test/fixtures/transactions.json"));

		const result = await context.subject.transaction("2qwe2tsgBZ5yqq6Qg2eTDPJ1tVVZZ9KoPLMDwurLTGTNpGMFr9");

		assert.instance(result, ConfirmedTransactionData);
	});

	it("should retrieve a list of transactions", async (context) => {
		nock.fake().get("/v2/transactions").query(true).reply(200, loader.json("test/fixtures/transactions.json"));

		const result = await context.subject.transactions({
			identifiers: [
				{
					type: "address",
					value: "X-fuji1my5kqjufcshudkzu4xdt5rlqk99j9nwseclkwq",
				},
			],
		});

		assert.instance(result, Collections.ConfirmedTransactionDataCollection);
	});

	it("#wallet should succeed", async (context) => {
		nock.fake()
			.post("/ext/bc/X", ({ method }) => method === "avm.getTx")
			.reply(200, loader.json("test/fixtures/client/avm-get-tx.json"))
			.post("/ext/bc/X", ({ method }) => method === "avm.getBalance")
			.reply(200, loader.json("test/fixtures/client/avm-get-balance.json"));

		const result = await context.subject.wallet({
			type: "address",
			value: "X-fuji1my5kqjufcshudkzu4xdt5rlqk99j9nwseclkwq",
		});

		assert.instance(result, WalletData);
	});

	it("#delegates should succeed", async (context) => {
		nock.fake()
			.post("/ext/bc/P", ({ method }) => method === "platform.sampleValidators")
			.reply(200, loader.json("test/fixtures/client/platform-sample-validators.json"));

		assert.instance(await context.subject.delegates(), Collections.WalletDataCollection);
	});
});
