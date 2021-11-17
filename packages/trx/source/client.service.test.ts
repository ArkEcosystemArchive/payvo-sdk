import { Collections, IoC, Services, Test } from "@payvo/sdk";
import nock from "nock";

import { createService, requireModule } from "../test/mocking.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";
import { ClientService } from "./client.service.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";

let subject: ClientService;

beforeAll(async () => {
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

beforeAll(async () => {
	nock.disableNetConnect();
});

describe("ClientService", () => {
	describe("#transaction", () => {
		it("should succeed", async () => {
			nock("https://api.shasta.trongrid.io")
				.post("/wallet/gettransactionbyid")
				.reply(200, requireModule(`../test/fixtures/client/transaction.json`));

			const result = await subject.transaction(
				"0daa9f2507c4e79e39391ea165bb76ed018c4cd69d7da129edf9e95f0dae99e2",
			);

			expect(result).toBeInstanceOf(ConfirmedTransactionData);
		});
	});

	describe("#transactions", () => {
		it("should succeed", async () => {
			nock("https://api.shasta.trongrid.io")
				.get("/v1/accounts/TUrM3F7b7WVZSZVjgrqsVBYXQL3GVgAqXq/transactions")
				.query(true)
				.reply(200, requireModule(`../test/fixtures/client/transactions.json`));

			const result = await subject.transactions({
				identifiers: [{ type: "address", value: "TUrM3F7b7WVZSZVjgrqsVBYXQL3GVgAqXq" }],
			});

			expect(result).toBeInstanceOf(Collections.ConfirmedTransactionDataCollection);
		});
	});

	describe("#wallet", () => {
		it("should succeed", async () => {
			nock("https://api.shasta.trongrid.io")
				.get("/v1/accounts/TTSFjEG3Lu9WkHdp4JrWYhbGP6K1REqnGQ")
				.reply(200, requireModule(`../test/fixtures/client/wallet.json`));

			const result = await subject.wallet({
				type: "address",
				value: "TTSFjEG3Lu9WkHdp4JrWYhbGP6K1REqnGQ",
			});

			expect(result).toBeInstanceOf(WalletData);
			expect(result.balance()).toMatchInlineSnapshot(`
			Object {
			  "available": BigNumber {},
			  "fees": BigNumber {},
			  "locked": BigNumber {},
			  "tokens": Object {
			    "TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7": BigNumber {},
			  },
			  "total": BigNumber {},
			}
		`);
		});
	});

	describe("#broadcast", () => {
		it("should pass", async () => {
			nock("https://api.shasta.trongrid.io")
				.post("/wallet/broadcasttransaction")
				.reply(200, requireModule(`../test/fixtures/client/broadcast.json`));

			const result = await subject.broadcast([
				createService(SignedTransactionData).configure(
					requireModule(`../test/fixtures/crypto/transferSigned.json`).txID,
					requireModule(`../test/fixtures/crypto/transferSigned.json`),
					requireModule(`../test/fixtures/crypto/transferSigned.json`),
				),
			]);

			expect(result).toEqual({
				accepted: ["8768a0f9849e2189fe323d4bb9d7485e7a045273096275f1bcb51b1433f73fc3"],
				rejected: [],
				errors: {},
			});
		});

		it("should fail", async () => {
			nock("https://api.shasta.trongrid.io")
				.post("/wallet/broadcasttransaction")
				.reply(200, requireModule(`../test/fixtures/client/broadcast-failure.json`));

			const result = await subject.broadcast([
				createService(SignedTransactionData).configure(
					requireModule(`../test/fixtures/crypto/transferSigned.json`).txID,
					requireModule(`../test/fixtures/crypto/transferSigned.json`),
					requireModule(`../test/fixtures/crypto/transferSigned.json`),
				),
			]);

			expect(result).toEqual({
				accepted: [],
				rejected: ["8768a0f9849e2189fe323d4bb9d7485e7a045273096275f1bcb51b1433f73fc3"],
				errors: {
					"8768a0f9849e2189fe323d4bb9d7485e7a045273096275f1bcb51b1433f73fc3": "SIGERROR",
				},
			});
		});
	});
});
