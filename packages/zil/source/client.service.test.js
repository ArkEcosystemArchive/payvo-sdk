import { describe } from "@payvo/sdk-test";
import { IoC, Services } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";
import { nock } from "@payvo/sdk-test";

import { identity } from "../test/fixtures/identity";
import { createService, mockWallet } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";
import { WalletData } from "./wallet.dto";
import { ClientService } from "./client.service";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { BindingType } from "./constants";

let subject;

describe("ClientService", async ({ assert, afterEach, beforeEach, it, loader }) => {
	beforeEach(async () => {
		nock.disableNetConnect();

		subject = await createService(ClientService, undefined, (container) => {
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

	afterEach(() => nock.cleanAll());

	it("should retrieve a transaction", async () => {
		nock.fake(/.+/).post("/").reply(200, loader.json(`test/fixtures/client/transaction.json`));

		const result = await subject.transaction("b2e78cb571fcee734fb6e3e34a16d735e3a3550c09100b79d017dd364b8770cb");

		assert.instance(result, ConfirmedTransactionData);
		assert.is(result.id(), "b2e78cb571fcee734fb6e3e34a16d735e3a3550c09100b79d017dd364b8770cb");
		assert.true(result.isConfirmed());
		assert.is(result.sender(), "0xE77555ff2103cAF9b8Ed5AC46277A50504bbC0EE");
		assert.is(result.recipient(), "0xA54E49719267E8312510D7b78598ceF16ff127CE");
		assert.equal(result.amount(), BigNumber.make(1));
		assert.equal(result.fee(), BigNumber.make("0.1"));
	});

	it("should retrieve a wallet", async () => {
		nock.fake(/.+/).post("/").reply(200, loader.json(`test/fixtures/client/wallet.json`));

		const result = await subject.wallet({
			type: "address",
			value: identity.address,
		});

		assert.instance(result, WalletData);
		assert.is(result.address(), identity.address);
		assert.equal(result.balance().available, BigNumber.make(499890000000));
		assert.equal(result.nonce(), BigNumber.make(1));
	});

	it("should broadcast", async () => {
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
		const result = await subject.broadcast([transaction]);

		assert.equal(result, {
			accepted: ["id"],
			rejected: [],
			errors: {},
		});
	});

	it("should fail to broadcast", async () => {
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
		const result = await subject.broadcast([transaction]);

		assert.equal(result, {
			accepted: [],
			rejected: ["id"],
			errors: {
				id: "GasPrice 1 lower than minimum allowable 2000000000",
			},
		});
	});
});
