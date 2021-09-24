import "jest-extended";

import { jest } from "@jest/globals";
import { IoC, Services } from "@payvo/sdk";
import nock from "nock";

import { createService, require } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";
import { WalletData } from "./wallet.dto";
import { DataTransferObjects } from "./coin.dtos";
import { ClientService } from "./client.service";
import { ConfirmedTransactionData } from "./transaction.dto";
import { TransactionSerializer } from "./transaction.serializer";
import { BindingType } from "./coin.contract";
import { DateTime } from "@payvo/intl";

let subject: ClientService;

beforeAll(async () => {
	nock.disableNetConnect();

	subject = await createService(ClientService, "lsk.testnet", (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(BindingType.TransactionSerializer, TransactionSerializer);
	});
});

describe("ClientService", () => {
	describe("#transaction", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/v2/transactions")
				.query(true)
				.reply(200, await require(`../test/fixtures/client/transaction.json`));

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
			expect(result.memo()).toMatchInlineSnapshot(`"Account initialization"`);
			expect(result.isTransfer()).toMatchInlineSnapshot(`false`);
			expect(result.isSecondSignature()).toMatchInlineSnapshot(`false`);
			expect(result.isDelegateRegistration()).toMatchInlineSnapshot(`false`);
			expect(result.isVoteCombination()).toMatchInlineSnapshot(`false`);
			expect(result.isVote()).toMatchInlineSnapshot(`true`);
			expect(result.isUnvote()).toMatchInlineSnapshot(`false`);
			expect(result.isUnlockToken()).toMatchInlineSnapshot(`false`);
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
				.reply(200, await require(`../test/fixtures/client/transactions.json`));

			const result = await subject.transactions({
				identifiers: [{ type: "address", value: "lsktz6b4u9x7e85nqy4mv667mabz8eaejzggvqs4m" }],
			});
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
			expect(transaction.isUnlockToken()).toMatchInlineSnapshot(`false`);
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
				.reply(200, await require(`../test/fixtures/client/wallet.json`));

			const result = await subject.wallet({
				type: "address",
				value: "lsktz6b4u9x7e85nqy4mv667mabz8eaejzggvqs4m",
			});

			expect(result).toBeInstanceOf(WalletData);
			expect(result.primaryKey()).toMatchInlineSnapshot(`"lskk8upba9sj8zsktr8hb2vcgk3quvgmx8h27h4gr"`);
			expect(result.address()).toMatchInlineSnapshot(`"lskk8upba9sj8zsktr8hb2vcgk3quvgmx8h27h4gr"`);
			expect(result.publicKey()).toMatchInlineSnapshot(
				`"414934d5c70dec65c4c01ddef4cb131913cc53b18e0c1c375857a5e7db52484b"`,
			);
			expect(result.balance().total.toString()).toMatchInlineSnapshot(`"150999716000"`);
			expect(result.balance().available.toString()).toMatchInlineSnapshot(`"148999716000"`);
			expect(result.balance().fees.toString()).toMatchInlineSnapshot(`"148999716000"`);
			expect(result.balance().locked?.toString()).toMatchInlineSnapshot(`"2000000000"`);
			expect(result.balance().lockedVotes?.toString()).toMatchInlineSnapshot(`"1000000000"`);
			expect(result.balance().lockedUnvotes?.toString()).toMatchInlineSnapshot(`"1000000000"`);
			expect(result.nonce().toString()).toMatchInlineSnapshot(`"2"`);
			expect(result.secondPublicKey()).toMatchInlineSnapshot(`undefined`);
			expect(result.username()).toMatchInlineSnapshot(`"username"`);
			expect(result.rank()).toMatchInlineSnapshot(`undefined`);
			expect(result.votes()?.toString()).toMatchInlineSnapshot(`"0"`);
			expect(result.isDelegate()).toMatchInlineSnapshot(`true`);
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
				.reply(200, await require(`../test/fixtures/client/wallets.json`));

			const result = await subject.wallets({
				identifiers: [{ type: "address", value: "lsktz6b4u9x7e85nqy4mv667mabz8eaejzggvqs4m" }],
			});
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
				.reply(200, await require(`../test/fixtures/client/delegate.json`));

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
			expect(result.isDelegate()).toMatchInlineSnapshot(`true`);
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
				.reply(200, await require(`../test/fixtures/client/delegates.json`));

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
			expect(wallet.isDelegate()).toMatchInlineSnapshot(`true`);
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
				.reply(200, await require(`../test/fixtures/client/votes.json`));

			const result = await subject.votes("lskbps7ge5n9y7f8nk4222c77zkqcntrj7jyhmkwp");

			expect(result).toBeObject();
			expect(result.used).toBe(1);
			expect(result.available).toBe(19);
			expect(result.votes).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "amount": 3075540,
			    "id": "lskbps7ge5n9y7f8nk4222c77zkqcntrj7jyhmkwp",
			  },
			]
		`);
		});
	});

	describe("#unlockableBalances", () => {
		it('should return empty when the property "unlocking" is missing in the response', async () => {
			nock(/.+/)
				.get("/api/v2/accounts")
				.query(true)
				.reply(200, {
					data: [
						{
							dpos: {},
						},
					],
				})
				.get("/api/v2/network/status")
				.reply(200, {
					data: {
						blockTime: 10,
						height: 14216291,
					},
				});

			const { current, pending, objects } = await subject.unlockableBalances(
				"lskbps7ge5n9y7f8nk4222c77zkqcntrj7jyhmkwp",
			);

			expect(current.toHuman()).toBe(0);
			expect(pending.toHuman()).toBe(0);
			expect(objects).toMatchInlineSnapshot("Array []");
		});

		it("should have a pending balance if the current height is not greater than the unlock height", async () => {
			jest.spyOn(DateTime, "make").mockReturnValueOnce(DateTime.make("2021-07-28 12:00"));

			nock(/.+/)
				.get("/api/v2/accounts")
				.query(true)
				.reply(200, {
					data: [
						{
							dpos: {
								unlocking: [
									{
										delegateAddress: "lsknnwoty8tmzoc96rscwu7bw4kmcwvdatawerehw",
										amount: "1000000000",
										height: {
											start: 14216291,
											end: 14218291,
										},
									},
								],
							},
						},
					],
				})
				.get("/api/v2/network/status")
				.reply(200, {
					data: {
						blockTime: 10,
						height: 14216291,
					},
				});

			const { current, pending, objects } = await subject.unlockableBalances(
				"lskbps7ge5n9y7f8nk4222c77zkqcntrj7jyhmkwp",
			);

			expect(current.toHuman()).toBe(0);
			expect(pending.toHuman()).toBe(10);
			expect(objects).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "address": "lsknnwoty8tmzoc96rscwu7bw4kmcwvdatawerehw",
			    "amount": BigNumber {},
			    "height": 14216291,
			    "isReady": false,
			    "timestamp": "2021-07-28T17:33:20.000Z",
			  },
			]
		`);
		});

		it("should have a current balance if the current height is greater than or equal to the unlock height", async () => {
			jest.spyOn(DateTime, "make").mockReturnValueOnce(DateTime.make("2021-07-28 12:00"));

			nock(/.+/)
				.get("/api/v2/accounts")
				.query(true)
				.reply(200, {
					data: [
						{
							dpos: {
								unlocking: [
									{
										delegateAddress: "lsknnwoty8tmzoc96rscwu7bw4kmcwvdatawerehw",
										amount: "1000000000",
										height: {
											start: 14216291,
											end: 14218291,
										},
									},
								],
							},
						},
					],
				})
				.get("/api/v2/network/status")
				.reply(200, {
					data: {
						blockTime: 10,
						height: 14218295,
					},
				});

			const { current, pending, objects } = await subject.unlockableBalances(
				"lskbps7ge5n9y7f8nk4222c77zkqcntrj7jyhmkwp",
			);

			expect(current.toHuman()).toBe(10);
			expect(pending.toHuman()).toBe(0);
			expect(objects[0].amount.toHuman()).toBe(10);
			expect(objects).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "address": "lsknnwoty8tmzoc96rscwu7bw4kmcwvdatawerehw",
			    "amount": BigNumber {},
			    "height": 14216291,
			    "isReady": true,
			    "timestamp": "2021-07-28T11:59:20.000Z",
			  },
			]
		`);
		});
	});

	describe("#broadcast", () => {
		let transactionPayload;

		beforeEach(async () => {
			const transactionSigned = {
				moduleID: 2,
				assetID: 0,
				senderPublicKey: "5e93fd5cfe306ea2c34d7082a6c79692cf2f5c6e07aa6f9b4a11b4917d33f16b",
				nonce: "3",
				fee: "207000",
				signatures: [
					"64e1c880e844f970e46ebdcc7c9c89a80bf8618de82706f3873ee91fa666657de610a8899f1370664721cdcb08eb5ac1e12aa6e1611b85a12050711aca478604",
				],
				asset: { recipientAddress: "lsk72fxrb264kvw6zuojntmzzsqds35sqvfzz76d7", amount: "100000000", data: "" },
				id: "73413ba3034d67f794b5c151c0a148b058ee476415c631e5f3d68d37c7b64db0",
			};

			transactionPayload = createService(SignedTransactionData).configure(
				"5961193224963457718",
				transactionSigned,
				transactionSigned,
			);
		});

		it("should pass", async () => {
			nock(/.+/)
				.post("/api/v2/transactions")
				.reply(200, await require(`../test/fixtures/client/broadcast.json`));

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
				.reply(200, await require(`../test/fixtures/client/broadcast-failure.json`));

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
