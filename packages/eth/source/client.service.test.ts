import { IoC, Services } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";
import { describe } from "@payvo/sdk-test";

import { createService } from "../test/mocking";
import { ClientService } from "./client.service";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { SignedTransactionData } from "./signed-transaction.dto";
import { WalletData } from "./wallet.dto";

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

	it("#transaction should succeed", async (context) => {
		nock.fake("https://eth-live.payvo.com/api")
			.get("/transactions/0xf6ad7f16653a2070f36c5f9c243acb30109da76658b54712745136d8e8236eae")
			.reply(200, loader.json(`test/fixtures/client/transaction.json`));

		const result = await context.subject.transaction(
			"0xf6ad7f16653a2070f36c5f9c243acb30109da76658b54712745136d8e8236eae",
		);

		assert.instance(result, ConfirmedTransactionData);
		assert.is(result.id(), "0xf6ad7f16653a2070f36c5f9c243acb30109da76658b54712745136d8e8236eae");
		assert.is(result.type(), "transfer");
		assert.undefined(result.timestamp());
		assert.equal(result.confirmations(), BigNumber.ZERO);
		assert.is(result.sender(), "0xac1a0f50604c430c25a9fa52078f7f7ec9523519");
		assert.is(result.recipient(), "0xb5663d3a23706eb4537ffea78f56948a53ac2ebe");
		assert.is(result.amount().toString(), "10000000000000000000");
		assert.is(result.fee().toString(), "28000");
		assert.undefined(result.memo());
	});

	it("#transactions should succeed", async (context) => {
		nock.fake("https://eth-live.payvo.com/api")
			.get("/wallets/0x8e5231be3b71afdd0c417164986573fecddbae59/transactions")
			.reply(200, loader.json(`test/fixtures/client/transactions.json`));

		const result = await context.subject.transactions({
			identifiers: [{ type: "address", value: "0x8e5231be3b71afdd0c417164986573fecddbae59" }],
			limit: 1,
		});

		// TODO: Improve test...

		assert.instance(result.items()[0], ConfirmedTransactionData);
	});

	it("#wallet should succeed", async (context) => {
		nock.fake("https://eth-live.payvo.com/api")
			.get("/wallets/0x4581a610f96878266008993475f1476ca9997081")
			.reply(200, loader.json(`test/fixtures/client/wallet.json`));

		const result = await context.subject.wallet({
			type: "address",
			value: "0x4581a610f96878266008993475f1476ca9997081",
		});

		assert.instance(result, WalletData);
		assert.is(result.address(), "0xb5663d3a23706eb4537ffea78f56948a53ac2ebe");
		assert.object(result.balance());
		assert.equal(result.balance().available.toString(), "10");
		assert.length(Object.keys(result.balance().tokens), 2);
		assert.instance(result.balance().tokens["0xB8c77482e45F1F44dE1745F52C74426C631bDD52"], BigNumber);
		assert.instance(result.balance().tokens["0x2b591e99afe9f32eaa6214f7b7629768c40eeb39"], BigNumber);
		assert.equal(result.balance().tokens["0xB8c77482e45F1F44dE1745F52C74426C631bDD52"].toString(), "10");
		assert.equal(result.balance().tokens["0x2b591e99afe9f32eaa6214f7b7629768c40eeb39"].toString(), "25.5");
		assert.is(result.nonce().toString(), "665");
	});

	it("broadcast should pass", async (context) => {
		nock.fake("https://eth-live.payvo.com/api")
			.post("/transactions")
			.reply(200, loader.json(`test/fixtures/client/broadcast.json`));

		const result = await context.subject.broadcast([
			createService(SignedTransactionData).configure("id", "transactionPayload", "transactionPayload"),
		]);

		assert.equal(result, {
			accepted: ["dfe2e16d1f6cd7fc666abdb91866e77db3091d2b9a7745fa01f39fe537ce4b03"],
			errors: {},
			rejected: [],
		});
	});

	it("broadcast should fail", async (context) => {
		nock.fake("https://eth-live.payvo.com/api")
			.post("/transactions")
			.reply(200, loader.json(`test/fixtures/client/broadcast-failure.json`));

		const result = await context.subject.broadcast([
			createService(SignedTransactionData).configure("id", "transactionPayload", "transactionPayload"),
		]);

		assert.equal(result, {
			accepted: [],
			errors: {
				dfe2e16d1f6cd7fc666abdb91866e77db3091d2b9a7745fa01f39fe537ce4b03:
					"insufficient funds for gas * price + value",
			},
			rejected: ["dfe2e16d1f6cd7fc666abdb91866e77db3091d2b9a7745fa01f39fe537ce4b03"],
		});
	});
});
