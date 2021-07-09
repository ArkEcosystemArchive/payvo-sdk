import "jest-extended";

import { DTO, IoC, Services } from "@payvo/sdk";
import nock from "nock";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";
import { WalletData } from "./wallet.dto";
import { DataTransferObjects } from "./coin.dtos";
import { ClientService } from "./client-three.service";
import { ConfirmedTransactionData } from "./transaction.dto";

let subject: ClientService;

beforeAll(() => {
	nock.disableNetConnect();

	subject = createService(ClientService, "lsk.testnet", (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
	});
});

beforeAll(() => {
	nock.disableNetConnect();
});

describe("ClientService", () => {
	describe("#transaction", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/v2/transactions")
				.query(true)
				.reply(200, require(`${__dirname}/../test/fixtures/client/three/transaction.json`));

			const result = await subject.transaction("827037ee7a3ec5dd1a57e38287616226f40cf1d52feb156394ae66e98bc6f2c5");

			expect(result).toBeInstanceOf(ConfirmedTransactionData);
		});
	});

	describe("#transactions", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/v2/transactions")
				.query(true)
				.reply(200, require(`${__dirname}/../test/fixtures/client/three/transactions.json`));

			const result = await subject.transactions({ address: "lsktz6b4u9x7e85nqy4mv667mabz8eaejzggvqs4m" });

			expect(result).toBeObject();
			expect(result.items()[0]).toBeInstanceOf(ConfirmedTransactionData);
		});
	});

	describe("#wallet", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/v2/accounts")
				.query(true)
				.reply(200, require(`${__dirname}/../test/fixtures/client/three/wallet.json`));

			const result = await subject.wallet("lsktz6b4u9x7e85nqy4mv667mabz8eaejzggvqs4m");

			expect(result).toBeInstanceOf(WalletData);
		});
	});

	describe("#wallets", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/v2/accounts")
				.query(true)
				.reply(200, require(`${__dirname}/../test/fixtures/client/three/wallets.json`));

			const result = await subject.wallets({ address: "lsktz6b4u9x7e85nqy4mv667mabz8eaejzggvqs4m" });

			expect(result).toBeObject();
			expect(result.items()[0]).toBeInstanceOf(WalletData);
		});
	});

	describe("#delegate", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/v2/accounts")
				.query(true)
				.reply(200, require(`${__dirname}/../test/fixtures/client/three/delegate.json`));

			const result = await subject.delegate("punkrock");

			expect(result).toBeInstanceOf(WalletData);
		});
	});

	describe("#delegates", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/v2/accounts")
				.query(true)
				.reply(200, require(`${__dirname}/../test/fixtures/client/three/delegates.json`));

			const result = await subject.delegates();

			expect(result).toBeObject();
			expect(result.items()[0]).toBeInstanceOf(WalletData);
		});
	});

	describe("#votes", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/v2/votes_sent")
				.query(true)
				.reply(200, require(`${__dirname}/../test/fixtures/client/three/votes.json`));

			const result = await subject.votes("lskbps7ge5n9y7f8nk4222c77zkqcntrj7jyhmkwp");

			expect(result).toBeObject();
			expect(result.used).toBe(1);
			expect(result.available).toBe(100);
			expect(result.publicKeys).toHaveLength(1);
		});
	});

	describe("#broadcast", () => {
		const transactionPayload = createService(SignedTransactionData).configure(
			"5961193224963457718",
			{},
			"0802100018032080ade2042a20ae7e1085bb9fb3e3a33d698ef2e03e2ce973a436c7940464f5ba9c81fb2bc99e321d0880c2d72f1214981464c1a1759eb3d6292894a7172603ed9b701f1a003a40aecd75ad1a452137cdb4061737ac69a488f75653a175fe251ff12dfcbc3b37df921f13b51c9be45357e7e598b6b60d5d4e2b27a44846442594da6de5cadfaf09",
		);

		it("should pass", async () => {
			nock(/.+/)
				.post("/api/v2/transactions")
				.reply(200, require(`${__dirname}/../test/fixtures/client/three/broadcast.json`));

			const result = await subject.broadcast([transactionPayload]);

			expect(result).toEqual({
				accepted: ["5961193224963457718"],
				rejected: [],
				errors: {},
			});
		});

		it("should fail", async () => {
			nock(/.+/)
				.post("/api/v2/transactions")
				.reply(200, require(`${__dirname}/../test/fixtures/client/three/broadcast-failure.json`));

			const result = await subject.broadcast([transactionPayload]);

			expect(result).toEqual({
				accepted: [],
				rejected: ["5961193224963457718"],
				errors: {
					"5961193224963457718": "Transaction payload was rejected by the network node",
				},
			});
		});
	});
});
