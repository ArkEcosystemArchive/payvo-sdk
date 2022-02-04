import { describe } from "@payvo/sdk-test";
import { IoC, Services } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";

import { identity } from "../test/fixtures/identity";
import { createService, mockWallet } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";
import { ClientService } from "./client.service.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { BindingType } from "./constants";

describe("ClientService", async ({ assert, afterEach, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(ClientService, undefined, (container) => {
			container.constant(BindingType.Zilliqa, mockWallet());
			container.constant(IoC.BindingType.Container, container);
			container.constant(IoC.BindingType.DataTransferObjects, {
				SignedTransactionData,
				ConfirmedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		});
	});

	it("should retrieve a transaction", async (context) => {
		nock.fake(/.+/).post("/").reply(200, loader.json(`test/fixtures/client/transaction.json`));

		const result = await context.subject.transaction(
			"b2e78cb571fcee734fb6e3e34a16d735e3a3550c09100b79d017dd364b8770cb",
		);

		assert.instance(result, ConfirmedTransactionData);
		assert.is(result.id(), "b2e78cb571fcee734fb6e3e34a16d735e3a3550c09100b79d017dd364b8770cb");
		assert.true(result.isConfirmed());
		assert.is(result.sender(), "0xE77555ff2103cAF9b8Ed5AC46277A50504bbC0EE");
		assert.is(result.recipient(), "0xA54E49719267E8312510D7b78598ceF16ff127CE");
		assert.equal(result.amount(), BigNumber.make("1000000000000"));
		assert.equal(result.fee(), BigNumber.make("100000000000"));
	});

	it("should retrieve a wallet", async (context) => {
		nock.fake(/.+/).post("/").reply(200, loader.json(`test/fixtures/client/wallet.json`));

		const result = await context.subject.wallet({
			type: "address",
			value: identity.address,
		});

		assert.instance(result, WalletData);
		assert.is(result.address(), identity.address);
		assert.equal(result.balance().available, BigNumber.make(499890000000));
		assert.equal(result.nonce(), BigNumber.make(1));
	});

	it("should broadcast", async (context) => {
		nock.fake(/.+/)
			.post("/")
			.reply(200, loader.json(`test/fixtures/client/broadcast-minimum-gas-price.json`))
			.post("/")
			.reply(200, loader.json(`test/fixtures/client/broadcast-create.json`))
			.post("/")
			.reply(200, loader.json(`test/fixtures/client/broadcast-success.json`));

		const signedData = {
			sender: "",
			recipient: "",
			amount: "",
			fee: "2000000000",
		};

		const broadcastData = JSON.stringify(loader.json(`test/fixtures/client/broadcast-request-payload.json`));
		const transaction = createService(SignedTransactionData).configure("id", signedData, broadcastData);
		const result = await context.subject.broadcast([transaction]);

		assert.equal(result, {
			accepted: ["id"],
			rejected: [],
			errors: {},
		});
	});

	it("should fail to broadcast", async (context) => {
		nock.fake(/.+/)
			.post("/")
			.reply(200, loader.json(`test/fixtures/client/broadcast-minimum-gas-price.json`))
			.post("/")
			.reply(200, loader.json(`test/fixtures/client/broadcast-failure.json`));

		const signedData = {
			sender: "",
			recipient: "",
			amount: "",
			fee: "2000000000", // keeping it high here to test lib code
		};

		const broadcastData = JSON.stringify(loader.json(`test/fixtures/client/broadcast-request-payload.json`));
		const transaction = createService(SignedTransactionData).configure("id", signedData, broadcastData);
		const result = await context.subject.broadcast([transaction]);

		assert.equal(result, {
			accepted: [],
			rejected: ["id"],
			errors: {
				id: "GasPrice 1 lower than minimum allowable 2000000000",
			},
		});
	});
});
