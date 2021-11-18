import { IoC, Services, Test } from "@payvo/sdk";
import nock from "nock";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";
import { WalletData } from "./wallet.dto";
import { ClientService } from "./client.service";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { TransactionSerializer } from "./transaction.serializer";
import { BindingType } from "./coin.contract";
import { DateTime } from "@payvo/sdk-intl";

let subject;

test.before(async () => {
	nock.disableNetConnect();

	subject = await createService(ClientService, "lsk.testnet", (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(BindingType.TransactionSerializer, TransactionSerializer);
	});
});

describe("ClientService", () => {
	describe("#transaction", () => {
		test("should succeed", async () => {
			nock(/.+/)
				.get("/api/v2/transactions")
				.query(true)
				.reply(200, loader.json(`test/fixtures/client/transaction.json`));

			const result = await subject.transaction(
				"827037ee7a3ec5dd1a57e38287616226f40cf1d52feb156394ae66e98bc6f2c5",
			);

			assert.instance(result, ConfirmedTransactionData);
			assert
				.is(result.id())
				.toMatchInlineSnapshot(`"827037ee7a3ec5dd1a57e38287616226f40cf1d52feb156394ae66e98bc6f2c5"`);
			assert
				.is(result.blockId())
				.toMatchInlineSnapshot(`"52bb109394008afc59fae3bc288c0c52e4f50ad1e173afb164c7df40d44ff0ec"`);
			assert.is(result.timestamp(), "2021-07-04T14:38:10.000Z"`);
			assert.is(result.confirmations().toString(), "0"`);
			assert.is(result.sender(), "lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3"`);
			assert.is(result.recipient(), "lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3"`);
			assert.is(result.amount().toString(), "0"`);
			assert.is(result.fee().toString(), "144000"`);
			assert.is(result.memo(), "Account initialization"`);
			assert.is(result.isTransfer(), false`);
			assert.is(result.isSecondSignature(), false`);
			assert.is(result.isDelegateRegistration(), false`);
			assert.is(result.isVoteCombination(), false`);
			assert.is(result.isVote(), true`);
			assert.is(result.isUnvote(), false`);
			assert.is(result.isUnlockToken(), false`);
			assert.is(result.isMultiSignatureRegistration(), false`);
			assert.is(result.username(), undefined`);
			assert.is(result.votes(),
			Array [
			  "lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3",
			]
		`);
			assert.is(result.unvotes(), Array []`);
			assert.is(result.secondPublicKey(), undefined`);
			assert.is(result.publicKeys(), Array []`);
			assert.is(result.min(), undefined`);
		});
	});

	describe("#transactions", () => {
		test("should succeed", async () => {
			nock(/.+/)
				.get("/api/v2/transactions")
				.query(true)
				.reply(200, loader.json(`test/fixtures/client/transactions.json`));

			const result = await subject.transactions({
				identifiers: [{ type: "address", value: "lsktz6b4u9x7e85nqy4mv667mabz8eaejzggvqs4m" }],
				cursor: 1,
			});
			const transaction = result.items()[0];

			assert.is(result, "object");
			assert.is(transaction instanceof ConfirmedTransactionData);
			assert
				.is(transaction.id())
				.toMatchInlineSnapshot(`"eae780f7a5233cd06084f6cc7ae1939f83a31af4e4d9caa294f3a6e7b99130ed"`);
			assert
				.is(transaction.blockId())
				.toMatchInlineSnapshot(`"34750351b180d0698ffc777d89bcf6d79a3e2447b05ff1df353b47790f51aa68"`);
			assert.is(transaction.timestamp(), "2021-07-02T11:22:20.000Z"`);
			assert.is(transaction.confirmations().toString(), "0"`);
			assert.is(transaction.sender(), "lskzrja9we9f2hvtc6uoxtbwutb9b8cqmde8vnfro"`);
			assert.is(transaction.recipient(), "lskpadb4stdcswz9cof7423bwvkwxvcowvq8gexob"`);
			assert.is(transaction.amount().toString(), "2000000000000"`);
			assert.is(transaction.fee().toString(), "100000000"`);
			assert.is(transaction.memo(), "helping"`);
			assert.is(transaction.isTransfer(), true`);
			assert.is(transaction.isSecondSignature(), false`);
			assert.is(transaction.isDelegateRegistration(), false`);
			assert.is(transaction.isVoteCombination(), false`);
			assert.is(transaction.isVote(), false`);
			assert.is(transaction.isUnvote(), false`);
			assert.is(transaction.isUnlockToken(), false`);
			assert.is(transaction.isMultiSignatureRegistration(), false`);
			assert.is(transaction.username(), undefined`);
			assert.is(transaction.votes(), Array []`);
			assert.is(transaction.unvotes(), Array []`);
			assert.is(transaction.secondPublicKey(), undefined`);
			assert.is(transaction.publicKeys(), Array []`);
			assert.is(transaction.min(), undefined`);
		});
	});

	describe("#wallet", () => {
		test("should succeed", async () => {
			nock(/.+/)
				.get("/api/v2/accounts")
				.query(true)
				.reply(200, loader.json(`test/fixtures/client/wallet.json`));

			const result = await subject.wallet({
				type: "address",
				value: "lsktz6b4u9x7e85nqy4mv667mabz8eaejzggvqs4m",
			});

			assert.instance(result, WalletData);
			assert.is(result.primaryKey(), "lskk8upba9sj8zsktr8hb2vcgk3quvgmx8h27h4gr"`);
			assert.is(result.address(), "lskk8upba9sj8zsktr8hb2vcgk3quvgmx8h27h4gr"`);
			assert
				.is(result.publicKey())
				.toMatchInlineSnapshot(`"414934d5c70dec65c4c01ddef4cb131913cc53b18e0c1c375857a5e7db52484b"`);
			assert.is(result.balance().total.toString(), "150994716000"`);
			assert.is(result.balance().available.toString(), "148994716000"`);
			assert.is(result.balance().fees.toString(), "148994716000"`);
			assert.is(result.balance().locked?.toString(), "2000000000"`);
			assert.is(result.balance().lockedVotes?.toString(), "1000000000"`);
			assert.is(result.balance().lockedUnvotes?.toString(), "1000000000"`);
			assert.is(result.nonce().toString(), "2"`);
			assert.is(result.secondPublicKey(), undefined`);
			assert.is(result.username(), "username"`);
			assert.is(result.rank(), undefined`);
			assert.is(result.votes()?.toString(), "0"`);
			assert.is(result.isDelegate(), true`);
			assert.is(result.isResignedDelegate(), false`);
			assert.is(result.isMultiSignature(), false`);
			assert.is(result.isSecondSignature(), false`);
		});
	});

	describe("#wallets", () => {
		test("should succeed", async () => {
			nock(/.+/)
				.get("/api/v2/accounts")
				.query(true)
				.reply(200, loader.json(`test/fixtures/client/wallets.json`));

			const result = await subject.wallets({
				identifiers: [{ type: "address", value: "lsktz6b4u9x7e85nqy4mv667mabz8eaejzggvqs4m" }],
			});
			const wallet = result.items()[0];

			assert.is(result, "object");
			assert.is(wallet instanceof WalletData);
			assert.is(wallet.primaryKey(), "lskckzngagcs4d5gvsgxmgnabyfyj8pz266gv8s8t"`);
			assert.is(wallet.address(), "lskckzngagcs4d5gvsgxmgnabyfyj8pz266gv8s8t"`);
			assert.is(wallet.publicKey(), null`);
			assert.is(wallet.balance().toString(), "[object Object]"`);
			assert.is(wallet.nonce().toString(), "0"`);
			assert.is(wallet.secondPublicKey(), undefined`);
			assert.is(wallet.username(), ""`);
			assert.is(wallet.rank(), undefined`);
			assert.is(wallet.votes()?.toString(), "0"`);
			assert.is(wallet.isDelegate(), false`);
			assert.is(wallet.isResignedDelegate(), false`);
			assert.is(wallet.isMultiSignature(), false`);
			assert.is(wallet.isSecondSignature(), false`);
		});
	});

	describe("#delegate", () => {
		test("should succeed", async () => {
			nock(/.+/)
				.get("/api/v2/accounts")
				.query(true)
				.reply(200, loader.json(`test/fixtures/client/delegate.json`));

			const result = await subject.delegate("punkrock");

			assert.instance(result, WalletData);
			assert.is(result.primaryKey(), "lskbps7ge5n9y7f8nk4222c77zkqcntrj7jyhmkwp"`);
			assert.is(result.address(), "lskbps7ge5n9y7f8nk4222c77zkqcntrj7jyhmkwp"`);
			assert
				.is(result.publicKey())
				.toMatchInlineSnapshot(`"3193057832bb1c9782a8e4a32e543b535ed9d750b1b10383f8b6f50853569609"`);
			assert.is(result.balance().available.toString(), "20110467794"`);
			assert.is(result.balance().fees.toString(), "20110467794"`);
			assert.is(result.nonce().toString(), "2"`);
			assert.is(result.secondPublicKey(), undefined`);
			assert.is(result.username(), "punkrock"`);
			assert.is(result.rank(), 1`);
			assert.is(result.votes()?.toString(), "307554000000000"`);
			assert.is(result.isDelegate(), true`);
			assert.is(result.isResignedDelegate(), false`);
			assert.is(result.isMultiSignature(), true`);
			assert.is(result.isSecondSignature(), false`);
		});
	});

	describe("#delegates", () => {
		test("should succeed", async () => {
			nock(/.+/)
				.get("/api/v2/accounts")
				.query(true)
				.reply(200, loader.json(`test/fixtures/client/delegates.json`));

			const result = await subject.delegates();
			const wallet = result.items()[0];

			assert.is(result, "object");
			assert.is(wallet instanceof WalletData);
			assert.is(wallet.primaryKey(), "lskbps7ge5n9y7f8nk4222c77zkqcntrj7jyhmkwp"`);
			assert.is(wallet.address(), "lskbps7ge5n9y7f8nk4222c77zkqcntrj7jyhmkwp"`);
			assert
				.is(wallet.publicKey())
				.toMatchInlineSnapshot(`"3193057832bb1c9782a8e4a32e543b535ed9d750b1b10383f8b6f50853569609"`);
			assert.is(wallet.balance().toString(), "[object Object]"`);
			assert.is(wallet.nonce().toString(), "2"`);
			assert.is(wallet.secondPublicKey(), undefined`);
			assert.is(wallet.username(), "punkrock"`);
			assert.is(wallet.rank(), 1`);
			assert.is(wallet.votes()?.toString(), "307554000000000"`);
			assert.is(wallet.isDelegate(), true`);
			assert.is(wallet.isResignedDelegate(), false`);
			assert.is(wallet.isMultiSignature(), true`);
			assert.is(wallet.isSecondSignature(), false`);
		});
	});

	describe("#votes", () => {
		test("should succeed", async () => {
			nock(/.+/)
				.get("/api/v2/votes_sent")
				.query(true)
				.reply(200, loader.json(`test/fixtures/client/votes.json`));

			const result = await subject.votes("lskbps7ge5n9y7f8nk4222c77zkqcntrj7jyhmkwp");

			assert.is(result, "object");
			assert.is(result.used, 1);
			assert.is(result.available, 19);
			assert.is(result.votes,
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

			assert.is(current.toHuman(), 0);
			assert.is(pending.toHuman(), 0);
			assert.is(objects).toMatchInlineSnapshot("Array []");
		});

		test("should have a pending balance if the current height is not greater than the unlock height", async () => {
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

			assert.is(current.toHuman(), 0);
			assert.is(pending.toHuman(), 10);
			assert.is(objects,
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

		test("should have a current balance if the current height is greater than or equal to the unlock height", async () => {
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

			assert.is(current.toHuman(), 10);
			assert.is(pending.toHuman(), 0);
			assert.is(objects[0].amount.toHuman(), 10);
			assert.is(objects,
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

		test.before.each(async () => {
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

		test("should pass", async () => {
			nock(/.+/).post("/api/v2/transactions").reply(200, loader.json(`test/fixtures/client/broadcast.json`));

			const result = await subject.broadcast([transactionPayload]);

			assert.equal(result, {
				accepted: ["5961193224963457718"],
				rejected: [],
				errors: {},
			});
		});

		test("should fail", async () => {
			nock(/.+/)
				.post("/api/v2/transactions")
				.reply(200, loader.json(`test/fixtures/client/broadcast-failure.json`));

			const result = await subject.broadcast([transactionPayload]);

			assert.equal(result, {
				accepted: [],
				rejected: ["5961193224963457718"],
				errors: {
					"5961193224963457718": "Transaction payload was rejected by the network node",
				},
			});
		});

		test("should handle http exception", async () => {
			nock(/.+/).post("/api/v2/transactions").reply(500, { message: "unknown error" });

			const result = await subject.broadcast([transactionPayload]);

			assert.equal(result, {
				accepted: [],
				rejected: ["5961193224963457718"],
				errors: {
					"5961193224963457718": "unknown error",
				},
			});
		});
	});
});
