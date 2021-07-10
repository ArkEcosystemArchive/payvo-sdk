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

			const result = await subject.transaction(
				"827037ee7a3ec5dd1a57e38287616226f40cf1d52feb156394ae66e98bc6f2c5",
			);

			expect(result).toBeInstanceOf(ConfirmedTransactionData);
			expect(result.id()).toMatchInlineSnapshot(
				`"827037ee7a3ec5dd1a57e38287616226f40cf1d52feb156394ae66e98bc6f2c5"`,
			);
			expect(result.blockId()).toMatchInlineSnapshot(
				`"52bb109394008afc59fae3bc288c0c52e4f50ad1e173afb164c7df40d44ff0ec"`,
			);
			expect(result.timestamp()).toMatchInlineSnapshot(`"2021-07-04T14:38:10.000Z"`);
			expect(result.confirmations().toString()).toMatchInlineSnapshot(`"0"`);
			expect(result.sender()).toMatchInlineSnapshot(`"lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3"`);
			expect(result.recipient()).toMatchInlineSnapshot(`"lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3"`);
			expect(result.amount().toString()).toMatchInlineSnapshot(`"0"`);
			expect(result.fee().toString()).toMatchInlineSnapshot(`"144000"`);
			expect(result.memo()).toMatchInlineSnapshot(`undefined`);
			expect(result.isTransfer()).toMatchInlineSnapshot(`false`);
			expect(result.isSecondSignature()).toMatchInlineSnapshot(`false`);
			expect(result.isDelegateRegistration()).toMatchInlineSnapshot(`false`);
			expect(result.isVoteCombination()).toMatchInlineSnapshot(`false`);
			expect(result.isVote()).toMatchInlineSnapshot(`true`);
			expect(result.isUnvote()).toMatchInlineSnapshot(`false`);
			expect(result.isMultiSignatureRegistration()).toMatchInlineSnapshot(`false`);
			expect(result.username()).toMatchInlineSnapshot(`undefined`);
			expect(result.votes()).toMatchInlineSnapshot(`
			Array [
			  "lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3",
			]
		`);
			expect(result.unvotes()).toMatchInlineSnapshot(`Array []`);
			expect(result.secondPublicKey()).toMatchInlineSnapshot(`undefined`);
			expect(result.publicKeys()).toMatchInlineSnapshot(`undefined`);
			expect(result.min()).toMatchInlineSnapshot(`undefined`);
		});
	});

	describe("#transactions", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/v2/transactions")
				.query(true)
				.reply(200, require(`${__dirname}/../test/fixtures/client/three/transactions.json`));

			const result = await subject.transactions({ address: "lsktz6b4u9x7e85nqy4mv667mabz8eaejzggvqs4m" });
			const transaction = result.items()[0];

			expect(result).toBeObject();
			expect(transaction).toBeInstanceOf(ConfirmedTransactionData);
			expect(transaction.id()).toMatchInlineSnapshot(
				`"eae780f7a5233cd06084f6cc7ae1939f83a31af4e4d9caa294f3a6e7b99130ed"`,
			);
			expect(transaction.blockId()).toMatchInlineSnapshot(
				`"34750351b180d0698ffc777d89bcf6d79a3e2447b05ff1df353b47790f51aa68"`,
			);
			expect(transaction.timestamp()).toMatchInlineSnapshot(`"2021-07-02T11:22:20.000Z"`);
			expect(transaction.confirmations().toString()).toMatchInlineSnapshot(`"0"`);
			expect(transaction.sender()).toMatchInlineSnapshot(`"lskzrja9we9f2hvtc6uoxtbwutb9b8cqmde8vnfro"`);
			expect(transaction.recipient()).toMatchInlineSnapshot(`"lskpadb4stdcswz9cof7423bwvkwxvcowvq8gexob"`);
			expect(transaction.amount().toString()).toMatchInlineSnapshot(`"2000000000000"`);
			expect(transaction.fee().toString()).toMatchInlineSnapshot(`"100000000"`);
			expect(transaction.memo()).toMatchInlineSnapshot(`"helping"`);
			expect(transaction.isTransfer()).toMatchInlineSnapshot(`true`);
			expect(transaction.isSecondSignature()).toMatchInlineSnapshot(`false`);
			expect(transaction.isDelegateRegistration()).toMatchInlineSnapshot(`false`);
			expect(transaction.isVoteCombination()).toMatchInlineSnapshot(`false`);
			expect(transaction.isVote()).toMatchInlineSnapshot(`false`);
			expect(transaction.isUnvote()).toMatchInlineSnapshot(`false`);
			expect(transaction.isMultiSignatureRegistration()).toMatchInlineSnapshot(`false`);
			expect(transaction.username()).toMatchInlineSnapshot(`undefined`);
			expect(transaction.votes()).toMatchInlineSnapshot(`Array []`);
			expect(transaction.unvotes()).toMatchInlineSnapshot(`Array []`);
			expect(transaction.secondPublicKey()).toMatchInlineSnapshot(`undefined`);
			expect(transaction.publicKeys()).toMatchInlineSnapshot(`undefined`);
			expect(transaction.min()).toMatchInlineSnapshot(`undefined`);
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
			expect(result.primaryKey()).toMatchInlineSnapshot(`"lskckzngagcs4d5gvsgxmgnabyfyj8pz266gv8s8t"`);
			expect(result.address()).toMatchInlineSnapshot(`"lskckzngagcs4d5gvsgxmgnabyfyj8pz266gv8s8t"`);
			expect(result.publicKey()).toMatchInlineSnapshot(`null`);
			expect(result.balance().available.toString()).toMatchInlineSnapshot(`"8361961317361193"`);
			expect(result.balance().fees.toString()).toMatchInlineSnapshot(`"8361961317361193"`);
			expect(result.nonce().toString()).toMatchInlineSnapshot(`"0"`);
			expect(result.secondPublicKey()).toMatchInlineSnapshot(`undefined`);
			expect(result.username()).toMatchInlineSnapshot(`""`);
			expect(result.rank()).toMatchInlineSnapshot(`undefined`);
			expect(result.votes()?.toString()).toMatchInlineSnapshot(`"0"`);
			expect(result.isDelegate()).toMatchInlineSnapshot(`false`);
			expect(result.isResignedDelegate()).toMatchInlineSnapshot(`false`);
			expect(result.isMultiSignature()).toMatchInlineSnapshot(`false`);
			expect(result.isSecondSignature()).toMatchInlineSnapshot(`false`);
		});
	});

	describe("#wallets", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/v2/accounts")
				.query(true)
				.reply(200, require(`${__dirname}/../test/fixtures/client/three/wallets.json`));

			const result = await subject.wallets({ address: "lsktz6b4u9x7e85nqy4mv667mabz8eaejzggvqs4m" });
			const wallet = result.items()[0];

			expect(result).toBeObject();
			expect(wallet).toBeInstanceOf(WalletData);
			expect(wallet.primaryKey()).toMatchInlineSnapshot(`"lskckzngagcs4d5gvsgxmgnabyfyj8pz266gv8s8t"`);
			expect(wallet.address()).toMatchInlineSnapshot(`"lskckzngagcs4d5gvsgxmgnabyfyj8pz266gv8s8t"`);
			expect(wallet.publicKey()).toMatchInlineSnapshot(`null`);
			expect(wallet.balance().toString()).toMatchInlineSnapshot(`"[object Object]"`);
			expect(wallet.nonce().toString()).toMatchInlineSnapshot(`"0"`);
			expect(wallet.secondPublicKey()).toMatchInlineSnapshot(`undefined`);
			expect(wallet.username()).toMatchInlineSnapshot(`""`);
			expect(wallet.rank()).toMatchInlineSnapshot(`undefined`);
			expect(wallet.votes()?.toString()).toMatchInlineSnapshot(`"0"`);
			expect(wallet.isDelegate()).toMatchInlineSnapshot(`false`);
			expect(wallet.isResignedDelegate()).toMatchInlineSnapshot(`false`);
			expect(wallet.isMultiSignature()).toMatchInlineSnapshot(`false`);
			expect(wallet.isSecondSignature()).toMatchInlineSnapshot(`false`);
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
			expect(result.primaryKey()).toMatchInlineSnapshot(`"lskbps7ge5n9y7f8nk4222c77zkqcntrj7jyhmkwp"`);
			expect(result.address()).toMatchInlineSnapshot(`"lskbps7ge5n9y7f8nk4222c77zkqcntrj7jyhmkwp"`);
			expect(result.publicKey()).toMatchInlineSnapshot(
				`"3193057832bb1c9782a8e4a32e543b535ed9d750b1b10383f8b6f50853569609"`,
			);
			expect(result.balance().available.toString()).toMatchInlineSnapshot(`"20115467794"`);
			expect(result.balance().fees.toString()).toMatchInlineSnapshot(`"20115467794"`);
			expect(result.nonce().toString()).toMatchInlineSnapshot(`"2"`);
			expect(result.secondPublicKey()).toMatchInlineSnapshot(`undefined`);
			expect(result.username()).toMatchInlineSnapshot(`"punkrock"`);
			expect(result.rank()).toMatchInlineSnapshot(`1`);
			expect(result.votes()?.toString()).toMatchInlineSnapshot(`"307554000000000"`);
			expect(result.isDelegate()).toMatchInlineSnapshot(`false`);
			expect(result.isResignedDelegate()).toMatchInlineSnapshot(`false`);
			expect(result.isMultiSignature()).toMatchInlineSnapshot(`true`);
			expect(result.isSecondSignature()).toMatchInlineSnapshot(`false`);
		});
	});

	describe("#delegates", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/v2/accounts")
				.query(true)
				.reply(200, require(`${__dirname}/../test/fixtures/client/three/delegates.json`));

			const result = await subject.delegates();
			const wallet = result.items()[0];

			expect(result).toBeObject();
			expect(wallet).toBeInstanceOf(WalletData);
			expect(wallet.primaryKey()).toMatchInlineSnapshot(`"lskbps7ge5n9y7f8nk4222c77zkqcntrj7jyhmkwp"`);
			expect(wallet.address()).toMatchInlineSnapshot(`"lskbps7ge5n9y7f8nk4222c77zkqcntrj7jyhmkwp"`);
			expect(wallet.publicKey()).toMatchInlineSnapshot(
				`"3193057832bb1c9782a8e4a32e543b535ed9d750b1b10383f8b6f50853569609"`,
			);
			expect(wallet.balance().toString()).toMatchInlineSnapshot(`"[object Object]"`);
			expect(wallet.nonce().toString()).toMatchInlineSnapshot(`"2"`);
			expect(wallet.secondPublicKey()).toMatchInlineSnapshot(`undefined`);
			expect(wallet.username()).toMatchInlineSnapshot(`"punkrock"`);
			expect(wallet.rank()).toMatchInlineSnapshot(`1`);
			expect(wallet.votes()?.toString()).toMatchInlineSnapshot(`"307554000000000"`);
			expect(wallet.isDelegate()).toMatchInlineSnapshot(`false`);
			expect(wallet.isResignedDelegate()).toMatchInlineSnapshot(`false`);
			expect(wallet.isMultiSignature()).toMatchInlineSnapshot(`true`);
			expect(wallet.isSecondSignature()).toMatchInlineSnapshot(`false`);
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
			expect(result.available).toBe(19);
			expect(result.votes).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "amount": "307554000000000",
			    "id": "lskbps7ge5n9y7f8nk4222c77zkqcntrj7jyhmkwp",
			  },
			]
		`);
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
