import { describe } from "@payvo/sdk-test";
import { Collections, IoC, Services } from "@payvo/sdk";

import { createService } from "../test/mocking";
import { ClientService } from "./client.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

describe("ClientService", async ({ assert, beforeAll, skip, it, nock, loader }) => {
	beforeAll(async (context) => {
		context.subject = await createService(ClientService, undefined, (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.constant(IoC.BindingType.DataTransferObjects, {
				SignedTransactionData,
				ConfirmedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		});
	});

	skip("should retrieve a single transaction", async (context) => {
		const result = await context.subject.transaction("2qwe2tsgBZ5yqq6Qg2eTDPJ1tVVZZ9KoPLMDwurLTGTNpGMFr9");

		assert.instance(result, ConfirmedTransactionData);
	});

	skip("should retrieve a list of transactions", async (context) => {
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

	skip("#wallet", async (context) => {
		const result = await context.subject.wallet({
			type: "address",
			value: "X-fuji1my5kqjufcshudkzu4xdt5rlqk99j9nwseclkwq",
		});

		assert.instance(result, WalletData);
	});

	skip("#delegates", async (context) => {
		assert.instance(await context.subject.delegates(), Collections.WalletDataCollection);
	});
});
