import { IoC, Services, Test } from "@payvo/sdk";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";
import nock from "nock";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";
import { WalletData } from "./wallet.dto";
import { ClientService } from "./client.service";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";

let subject: ClientService;

test.before(async () => {
	nock.disableNetConnect();

	subject = await createService(ClientService, undefined, (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
	});
});

test.before(async () => {
	nock.disableNetConnect();
});

describe("ClientService", () => {
	describe("#transaction", () => {
		test("should succeed", async () => {
			nock("https://stargate.cosmos.network")
				.get("/txs/B0DB35EADB3655E954A785B1ED0402222EF8C7061B22E52720AB1CE027ADBD11")
				.reply(200, loader.json(`test/fixtures/client/transaction.json`));

			const result = await subject.transaction(
				"B0DB35EADB3655E954A785B1ED0402222EF8C7061B22E52720AB1CE027ADBD11",
			);

			assert.is(result instanceof ConfirmedTransactionData);
			assert.is(result.id(), "B0DB35EADB3655E954A785B1ED0402222EF8C7061B22E52720AB1CE027ADBD11");
			assert.is(result.type(), "transfer");
			assert.is(result.timestamp() instanceof DateTime);
			assert.is(result.confirmations(), BigNumber.ZERO);
			assert.is(result.sender(), "cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0");
			assert.is(result.recipient(), "cosmos14ddvyl5t0hzmknceuv3zzu5szuum4rkygpq5ln");
			assert.is(result.amount(), BigNumber.make(10680));
			assert.is(result.fee(), BigNumber.make(36875));
			// @ts-ignore - Better types so that memo gets detected on TransactionDataType
			assert.is(result.memo(), "Hello World");
		});
	});

	describe("#transactions", () => {
		test("should succeed", async () => {
			nock("https://stargate.cosmos.network")
				.get(
					"/txs?message.action=send&message.sender=cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0&page=1&limit=100",
				)
				.reply(200, loader.json(`test/fixtures/client/transactions.json`));

			const result = await subject.transactions({
				identifiers: [{ type: "address", value: "cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0" }],
			});

			assert.is(result, "object");
			assert.is(result.items()[0] instanceof ConfirmedTransactionData);
			assert.is(result.items()[0].id(), "B0DB35EADB3655E954A785B1ED0402222EF8C7061B22E52720AB1CE027ADBD11");
			assert.is(result.items()[0].type(), "transfer");
			assert.is(result.items()[0].timestamp() instanceof DateTime);
			assert.is(result.items()[0].confirmations(), BigNumber.ZERO);
			assert.is(result.items()[0].sender(), "cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0");
			assert.is(result.items()[0].recipient(), "cosmos14ddvyl5t0hzmknceuv3zzu5szuum4rkygpq5ln");
			assert.is(result.items()[0].amount(), BigNumber.make(10680));
			assert.is(result.items()[0].fee(), BigNumber.make(36875));
			// @ts-ignore - Better types so that memo gets detected on TransactionDataType
			assert.is(result.items()[0].memo(), "Hello World");
		});
	});

	describe("#wallet", () => {
		test("should succeed", async () => {
			nock("https://stargate.cosmos.network")
				.get("/auth/accounts/cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0")
				.reply(200, loader.json(`test/fixtures/client/wallet.json`))
				.get("/bank/balances/cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0")
				.reply(200, loader.json(`test/fixtures/client/wallet.json`));

			const result = await subject.wallet({
				type: "address",
				value: "cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0",
			});

			assert.is(result instanceof WalletData);
			assert.is(result.address(), "cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0");
			assert.is(result.publicKey(), "Ap65s+Jdgo8BtvTbkc7GyUti8yJ7RpZ7cE1zCuKgNeXY");
			assert.is(result.balance().available, BigNumber.make(22019458509));
			assert.is(result.nonce(), BigNumber.make(24242));
		});
	});

	describe("#broadcast", () => {
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

		test("should pass", async () => {
			nock("https://stargate.cosmos.network")
				.post("/txs")
				.reply(200, loader.json(`test/fixtures/client/broadcast.json`));

			const result = await subject.broadcast([transactionPayload]);

			assert.is(result, {
				accepted: ["25E82BD7E457147DA29FD39E6C155365F07559A7834C7FBB4E9B21DE6A65BFC7"],
				rejected: [],
				errors: {},
			});
		});

		test("should fail", async () => {
			nock("https://stargate.cosmos.network")
				.post("/txs")
				.reply(200, loader.json(`test/fixtures/client/broadcast-failure.json`));

			const result = await subject.broadcast([transactionPayload]);

			assert.is(result, {
				accepted: [],
				rejected: ["535C0F6E94506C2D579CCAC76A155472394062FD2D712C662745D93E951164FB"],
				errors: {
					"535C0F6E94506C2D579CCAC76A155472394062FD2D712C662745D93E951164FB":
						"insufficient account funds; 24929994umuon < 100000000umuon",
				},
			});
		});
	});
});
