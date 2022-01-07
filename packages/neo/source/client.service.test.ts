import { api, wallet } from "@cityofzion/neon-js";
import { IoC, Services, Signatories } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";
import { DateTime } from "@payvo/sdk-intl";
import { describe } from "@payvo/sdk-test";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { ClientService } from "./client.service.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";

describe("ClientService", async ({ beforeAll, afterEach, it, assert, nock, loader }) => {
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

	it("#transactions should succeed", async (context) => {
		nock.fake("https://neoscan-testnet.io/api/test_net/v1/")
			.get("/get_address_abstracts/Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF/1")
			.reply(200, loader.json(`test/fixtures/client/transactions.json`));

		const result = await context.subject.transactions({
			identifiers: [{ type: "address", value: "Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF" }],
		});

		assert.instance(result.items(context)[0], ConfirmedTransactionData);
		assert.is(result.items()[0].id(), "718bc4cfc50c361a8afe032e2c170dfebadce16ea72228a57634413b62b7cf24");
		assert.is(result.items()[0].type(), "transfer");
		assert.instance(result.items()[0].timestamp(), DateTime);
		assert.equal(result.items()[0].confirmations(), BigNumber.ZERO);
		assert.is(result.items()[0].sender(), "AStJyBXGGBK6bwrRfRUHSjp993PB5C9QgF");
		assert.is(result.items()[0].recipient(), "Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF");
		assert.equal(result.items()[0].amount(), BigNumber.make(1));
		assert.equal(result.items()[0].fee(), BigNumber.ZERO);
		assert.undefined(result.items()[0].memo());
	});

	it("#wallet should succeed", async (context) => {
		nock.fake("https://neoscan-testnet.io/api/test_net/v1/")
			.get("/get_balance/Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF")
			.reply(200, loader.json(`test/fixtures/client/wallet.json`));

		const result = await context.subject.wallet({
			type: "address",
			value: "Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF",
		});

		assert.is(result.address(context), "Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF");
		assert.equal(result.balance().available, BigNumber.make(9).times(1e8));
	});

	it("broadcast should pass", async (context) => {
		nock.fake("https://neoscan-testnet.io/api/test_net/v1")
			.get(`/get_balance/${identity.address}`)
			.reply(200, loader.json(`test/fixtures/client/balance.json`))
			.get("/get_all_nodes")
			.reply(200, loader.json(`test/fixtures/client/nodes.json`));

		nock.fake("http://seed2.neo.org:20332")
			.post("/", ({ method }) => method === "sendrawtransaction")
			.reply(200, { txid: "0cb2e1fc8caa83cfb204e5cd2f66a58f3954a3b7bcc8958aaba38b582376e652" });

		const result = await context.subject.broadcast([
			createService(SignedTransactionData).configure(
				"id",
				{
					account: new wallet.Account(
						new Signatories.Signatory(
							new Signatories.PrivateKeySignatory({
								address: identity.address,
								signingKey: identity.privateKey,
							}),
						).signingKey(),
					),
					intents: api.makeIntent({ GAS: 1e-8, NEO: 1 }, "Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF"),
				},
				"",
			),
		]);

		assert.equal(result, {
			accepted: ["0cb2e1fc8caa83cfb204e5cd2f66a58f3954a3b7bcc8958aaba38b582376e652"],
			errors: {},
			rejected: [],
		});
	});

	it("broadcast should fail", async (context) => {
		nock.fake("https://neoscan-testnet.io/api/test_net/v1")
			.get(`/get_balance/${identity.address}`)
			.reply(200, loader.json(`test/fixtures/client/balance.json`))
			.get("/get_all_nodes")
			.reply(200, loader.json(`test/fixtures/client/nodes.json`));

		nock.fake("http://seed2.neo.org:20332")
			.post("/", ({ method }) => method === "sendrawtransaction")
			.reply(200, { error: { code: 0, message: "ERR_INSUFFICIENT_FUNDS" } });

		const result = await context.subject.broadcast([
			createService(SignedTransactionData).configure(
				"0cb2e1fc8caa83cfb204e5cd2f66a58f3954a3b7bcc8958aaba38b582376e652",
				{
					account: new wallet.Account(
						new Signatories.Signatory(
							new Signatories.PrivateKeySignatory({
								address: identity.address,
								signingKey: identity.privateKey,
							}),
						).signingKey(),
					),
					intents: api.makeIntent({ GAS: 1e-8, NEO: 1 }, "Ab9QkPeMzx7ehptvjbjHviAXUfdhAmEAUF"),
				},
				"",
			),
		]);

		assert.equal(result, {
			accepted: [],
			errors: {
				"0cb2e1fc8caa83cfb204e5cd2f66a58f3954a3b7bcc8958aaba38b582376e652":
					"http://seed2.neo.org:20332: ERR_INSUFFICIENT_FUNDS",
			},
			rejected: ["0cb2e1fc8caa83cfb204e5cd2f66a58f3954a3b7bcc8958aaba38b582376e652"],
		});
	});
});
