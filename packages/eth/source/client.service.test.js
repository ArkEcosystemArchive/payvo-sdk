import { describe } from "@payvo/sdk-test";
import { IoC, Services } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";
import { nock } from "@payvo/sdk-test";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";
import { WalletData } from "./wallet.dto";
import { ClientService } from "./client.service";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";

describe("ClientService", async ({ assert, beforeAll, afterEach, it, loader }) => {
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

	afterEach(() => {
		nock.cleanAll();
	});

	it("#transaction should succeed", async ({ subject }) => {
		nock.fake("https://platform.ark.io/api/eth")
			.get("/transactions/0xf6ad7f16653a2070f36c5f9c243acb30109da76658b54712745136d8e8236eae")
			.reply(200, loader.json(`test/fixtures/client/transaction.json`));

		const result = await subject.transaction("0xf6ad7f16653a2070f36c5f9c243acb30109da76658b54712745136d8e8236eae");

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

	it("#transactions should succeed", async ({ subject }) => {
		nock.fake("https://platform.ark.io/api/eth")
			.get("/wallets/0x8e5231be3b71afdd0c417164986573fecddbae59/transactions")
			.reply(200, loader.json(`test/fixtures/client/transactions.json`));

		const result = await subject.transactions({
			identifiers: [{ type: "address", value: "0x8e5231be3b71afdd0c417164986573fecddbae59" }],
			limit: 1,
		});

		assert.instance(result.items()[0], ConfirmedTransactionData);
	});

	it("#wallet should succeed", async ({ subject }) => {
		nock.fake("https://platform.ark.io/api/eth")
			.get("/wallets/0x4581a610f96878266008993475f1476ca9997081")
			.reply(200, loader.json(`test/fixtures/client/wallet.json`));

		const result = await subject.wallet({
			type: "address",
			value: "0x4581a610f96878266008993475f1476ca9997081",
		});

		assert.instance(result, WalletData);
		assert.is(result.address(), "0xb5663d3a23706eb4537ffea78f56948a53ac2ebe");
		assert.object(result.balance());
		assert.is(result.nonce().toString(), "665");
	});

	it("broadcast should pass", async ({ subject }) => {
		nock.fake("https://platform.ark.io/api/eth")
			.post("/transactions")
			.reply(200, loader.json(`test/fixtures/client/broadcast.json`));

		const result = await subject.broadcast([
			createService(SignedTransactionData).configure("id", "transactionPayload", "transactionPayload"),
		]);

		assert.equal(result, {
			accepted: ["0x227cff6fc8990fecd43cc9c7768f2c98cc5ee8e7c98c67c11161e008cce2b172"],
			rejected: [],
			errors: {},
		});
	});

	it("broadcast should fail", async ({ subject }) => {
		nock.fake("https://platform.ark.io/api/eth")
			.post("/transactions")
			.reply(200, loader.json(`test/fixtures/client/broadcast-failure.json`));

		const result = await subject.broadcast([
			createService(SignedTransactionData).configure("id", "transactionPayload", "transactionPayload"),
		]);

		assert.equal(result, {
			accepted: [],
			rejected: ["0x227cff6fc8990fecd43cc9c7768f2c98cc5ee8e7c98c67c11161e008cce2b172"],
			errors: {
				"0x227cff6fc8990fecd43cc9c7768f2c98cc5ee8e7c98c67c11161e008cce2b172":
					"insufficient funds for gas * price + value",
			},
		});
	});
});
