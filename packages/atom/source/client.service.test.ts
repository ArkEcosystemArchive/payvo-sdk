import { describe, loader } from "@payvo/sdk-test";
import { IoC, Services } from "@payvo/sdk";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";
import { ClientService } from "./client.service.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";

describe("ClientService", async ({ assert, beforeAll, it, nock, loader }) => {
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

	it("#transaction should succeed", async (context) => {
		nock.fake("https://stargate.cosmos.network")
			.get("/txs/B0DB35EADB3655E954A785B1ED0402222EF8C7061B22E52720AB1CE027ADBD11")
			.reply(200, loader.json(`test/fixtures/client/transaction.json`));

		const result = await context.subject.transaction(
			"B0DB35EADB3655E954A785B1ED0402222EF8C7061B22E52720AB1CE027ADBD11",
		);

		assert.instance(result, ConfirmedTransactionData);
		assert.is(result.id(), "B0DB35EADB3655E954A785B1ED0402222EF8C7061B22E52720AB1CE027ADBD11");
		assert.is(result.type(), "transfer");
		assert.instance(result.timestamp(), DateTime);
		assert.equal(result.confirmations(), BigNumber.ZERO);
		assert.is(result.sender(), "cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0");
		assert.is(result.recipient(), "cosmos14ddvyl5t0hzmknceuv3zzu5szuum4rkygpq5ln");
		assert.equal(result.amount(), BigNumber.make(10680));
		assert.equal(result.fee(), BigNumber.make(36875));
		assert.is(result.memo(), "Hello World");
	});

	it("#transactions should succeed", async (context) => {
		nock.fake("https://stargate.cosmos.network")
			.get(
				"/txs?message.action=send&message.sender=cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0&page=1&limit=100",
			)
			.reply(200, loader.json(`test/fixtures/client/transactions.json`));

		const result = await context.subject.transactions({
			identifiers: [{ type: "address", value: "cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0" }],
		});

		assert.object(result);
		assert.instance(result.items()[0], ConfirmedTransactionData);
		assert.is(result.items()[0].id(), "B0DB35EADB3655E954A785B1ED0402222EF8C7061B22E52720AB1CE027ADBD11");
		assert.is(result.items()[0].type(), "transfer");
		assert.instance(result.items()[0].timestamp(), DateTime);
		assert.equal(result.items()[0].confirmations(), BigNumber.ZERO);
		assert.is(result.items()[0].sender(), "cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0");
		assert.is(result.items()[0].recipient(), "cosmos14ddvyl5t0hzmknceuv3zzu5szuum4rkygpq5ln");
		assert.equal(result.items()[0].amount(), BigNumber.make(10680));
		assert.equal(result.items()[0].fee(), BigNumber.make(36875));
		assert.is(result.items()[0].memo(), "Hello World");
	});

	it("#wallet should succeed", async (context) => {
		nock.fake("https://stargate.cosmos.network")
			.get("/auth/accounts/cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0")
			.reply(200, loader.json(`test/fixtures/client/wallet.json`))
			.get("/bank/balances/cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0")
			.reply(200, loader.json(`test/fixtures/client/wallet.json`));

		const result = await context.subject.wallet({
			type: "address",
			value: "cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0",
		});

		assert.instance(result, WalletData);
		assert.is(result.address(), "cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0");
		assert.is(result.publicKey(), "Ap65s+Jdgo8BtvTbkc7GyUti8yJ7RpZ7cE1zCuKgNeXY");
		assert.equal(result.balance().available, BigNumber.make(0));
		assert.equal(result.nonce(), BigNumber.make(24242));
	});

	const transactionPayload = createService(SignedTransactionData).configure(
		"id",
		{
			msg: [
				{
					type: "cosmos-sdk/MsgSend",
					value: {
						amount: [{ amount: 1, denom: "umuon" }],
						from_address: "cosmos1pnc559thh9ks4crsp5p3wta2f2m09t4gluyl2l",
						to_address: "cosmos1xvt4e7xd0j9dwv2w83g50tpcltsl90h52003e2",
					},
				},
			],
			fee: { amount: [{ amount: 5000, denom: "umuon" }], gas: "200000" },
			signatures: [
				{
					signature:
						"naiy71Wa8hPC8wMj2/J4CwnqtR8RThv9Cy3y1EGJVowVtDWJQoUmy3KfYneA2wwLQUlgI/UWgNMClCzbJdD8Ew==",
					account_number: "58976",
					sequence: "16",
					pub_key: {
						type: "tendermint/PubKeySecp256k1",
						value: "A1wiLscFDRRdEuWx5WmXbXVbMszN2cBHaJFWfJm399Yy",
					},
				},
			],
			memo: "",
		},
		"",
	);

	it("should handle successful broadcast", async (context) => {
		nock.fake("https://stargate.cosmos.network")
			.post("/txs")
			.reply(200, loader.json(`test/fixtures/client/broadcast.json`));

		const result = await context.subject.broadcast([transactionPayload]);

		assert.equal(result, {
			accepted: ["25E82BD7E457147DA29FD39E6C155365F07559A7834C7FBB4E9B21DE6A65BFC7"],
			rejected: [],
			errors: {},
		});
	});

	it("should handle broadcast failure", async (context) => {
		nock.fake("https://stargate.cosmos.network")
			.post("/txs")
			.reply(200, loader.json(`test/fixtures/client/broadcast-failure.json`));

		const result = await context.subject.broadcast([transactionPayload]);

		assert.equal(result, {
			accepted: [],
			rejected: ["535C0F6E94506C2D579CCAC76A155472394062FD2D712C662745D93E951164FB"],
			errors: {
				"535C0F6E94506C2D579CCAC76A155472394062FD2D712C662745D93E951164FB":
					"insufficient account funds; 24929994umuon < 100000000umuon",
			},
		});
	});
});
