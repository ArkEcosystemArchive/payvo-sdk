import { describe, loader } from "@payvo/sdk-test";
import { IoC, Services } from "@payvo/sdk";
import { DateTime } from "@payvo/sdk-intl";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";
import { ClientService } from "./client.service.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";

const createLocalServices = () => {
	return createService(ClientService, "lsk.testnet", (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
	});
};

describe("#transaction", async ({ beforeAll, it, assert, nock }) => {
	beforeAll(async (context) => {
		context.subject = await createLocalServices();
	});

	it("should succeed", async (context) => {
		nock.fake(/.+/)
			.get("/api/v2/transactions")
			.query(true)
			.reply(200, loader.json(`test/fixtures/client/transaction.json`));

		const result = await context.subject.transaction(
			"827037ee7a3ec5dd1a57e38287616226f40cf1d52feb156394ae66e98bc6f2c5",
		);

		assert.instance(result, ConfirmedTransactionData);
		assert.is(result.id(), "827037ee7a3ec5dd1a57e38287616226f40cf1d52feb156394ae66e98bc6f2c5");
		assert.is(result.blockId(), "52bb109394008afc59fae3bc288c0c52e4f50ad1e173afb164c7df40d44ff0ec");
		assert.is(result.timestamp().toISOString(), "2021-07-04T14:38:10.000Z");
		assert.is(result.confirmations().toString(), "0");
		assert.is(result.sender(), "lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3");
		assert.is(result.recipient(), "lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3");
		assert.is(result.amount().toString(), "0");
		assert.is(result.fee().toString(), "144000");
		assert.is(result.memo(), "Account initialization");
		assert.false(result.isTransfer());
		assert.false(result.isSecondSignature());
		assert.false(result.isDelegateRegistration());
		assert.false(result.isVoteCombination());
		assert.true(result.isVote());
		assert.false(result.isUnvote());
		assert.false(result.isUnlockToken());
		assert.false(result.isMultiSignatureRegistration());
		assert.undefined(result.username());
		assert.array(result.votes());
		assert.array(result.unvotes());
		assert.undefined(result.secondPublicKey());
		assert.array(result.publicKeys());
		assert.undefined(result.min());
	});
});

describe("#transactions", async ({ beforeAll, it, assert, nock }) => {
	beforeAll(async (context) => {
		context.subject = await createLocalServices();
	});

	it("should succeed", async (context) => {
		nock.fake(/.+/)
			.get("/api/v2/transactions")
			.query(true)
			.reply(200, loader.json(`test/fixtures/client/transactions.json`));

		const result = await context.subject.transactions({
			identifiers: [{ type: "address", value: "lsktz6b4u9x7e85nqy4mv667mabz8eaejzggvqs4m" }],
			cursor: 1,
		});
		const transaction = result.items()[0];

		assert.object(result);
		assert.instance(transaction, ConfirmedTransactionData);
		assert.is(transaction.id(), "eae780f7a5233cd06084f6cc7ae1939f83a31af4e4d9caa294f3a6e7b99130ed");
		assert.is(transaction.blockId(), "34750351b180d0698ffc777d89bcf6d79a3e2447b05ff1df353b47790f51aa68");
		assert.is(transaction.timestamp().toISOString(), "2021-07-02T11:22:20.000Z");
		assert.is(transaction.confirmations().toString(), "0");
		assert.is(transaction.sender(), "lskzrja9we9f2hvtc6uoxtbwutb9b8cqmde8vnfro");
		assert.is(transaction.recipient(), "lskpadb4stdcswz9cof7423bwvkwxvcowvq8gexob");
		assert.is(transaction.amount().toString(), "2000000000000");
		assert.is(transaction.fee().toString(), "100000000");
		assert.is(transaction.memo(), "helping");
		assert.true(transaction.isTransfer());
		assert.false(transaction.isSecondSignature());
		assert.false(transaction.isDelegateRegistration());
		assert.false(transaction.isVoteCombination());
		assert.false(transaction.isVote());
		assert.false(transaction.isUnvote());
		assert.false(transaction.isUnlockToken());
		assert.false(transaction.isMultiSignatureRegistration());
		assert.undefined(transaction.username());
		assert.array(transaction.votes());
		assert.array(transaction.unvotes());
		assert.undefined(transaction.secondPublicKey());
		assert.array(transaction.publicKeys());
		assert.undefined(transaction.min());
	});
});

describe("#wallet", async ({ beforeAll, it, assert, nock }) => {
	beforeAll(async (context) => {
		context.subject = await createLocalServices();
	});

	it("should succeed", async (context) => {
		nock.fake(/.+/).get("/api/v2/accounts").query(true).reply(200, loader.json(`test/fixtures/client/wallet.json`));

		const result = await context.subject.wallet({
			type: "address",
			value: "lsktz6b4u9x7e85nqy4mv667mabz8eaejzggvqs4m",
		});

		assert.instance(result, WalletData);
		assert.is(result.primaryKey(), "lskk8upba9sj8zsktr8hb2vcgk3quvgmx8h27h4gr");
		assert.is(result.address(), "lskk8upba9sj8zsktr8hb2vcgk3quvgmx8h27h4gr");
		assert.is(result.publicKey(), "414934d5c70dec65c4c01ddef4cb131913cc53b18e0c1c375857a5e7db52484b");
		assert.is(result.balance().total.toString(), "150994716000");
		assert.is(result.balance().available.toString(), "148994716000");
		assert.is(result.balance().fees.toString(), "148994716000");
		assert.is(result.balance().locked?.toString(), "2000000000");
		assert.is(result.balance().lockedVotes?.toString(), "1000000000");
		assert.is(result.balance().lockedUnvotes?.toString(), "1000000000");
		assert.is(result.nonce().toString(), "2");
		assert.undefined(result.secondPublicKey());
		assert.is(result.username(), "username");
		assert.undefined(result.rank());
		assert.is(result.votes()?.toString(), "0");
		assert.true(result.isDelegate());
		assert.false(result.isResignedDelegate());
		assert.false(result.isMultiSignature());
		assert.false(result.isSecondSignature());
	});
});

describe("#wallets", async ({ beforeAll, it, assert, nock }) => {
	beforeAll(async (context) => {
		context.subject = await createLocalServices();
	});

	it("should succeed", async (context) => {
		nock.fake(/.+/)
			.get("/api/v2/accounts")
			.query(true)
			.reply(200, loader.json(`test/fixtures/client/wallets.json`));

		const result = await context.subject.wallets({
			identifiers: [{ type: "address", value: "lsktz6b4u9x7e85nqy4mv667mabz8eaejzggvqs4m" }],
		});
		const wallet = result.items()[0];

		assert.object(result);
		assert.instance(wallet, WalletData);
		assert.is(wallet.primaryKey(), "lskckzngagcs4d5gvsgxmgnabyfyj8pz266gv8s8t");
		assert.is(wallet.address(), "lskckzngagcs4d5gvsgxmgnabyfyj8pz266gv8s8t");
		assert.null(wallet.publicKey());
		assert.is(wallet.balance().toString(), "[object Object]");
		assert.is(wallet.nonce().toString(), "0");
		assert.undefined(wallet.secondPublicKey());
		assert.is(wallet.username(), "");
		assert.undefined(wallet.rank());
		assert.is(wallet.votes()?.toString(), "0");
		assert.false(wallet.isDelegate());
		assert.false(wallet.isResignedDelegate());
		assert.false(wallet.isMultiSignature());
		assert.false(wallet.isSecondSignature());
	});
});

describe("#delegate", async ({ beforeAll, it, assert, nock }) => {
	beforeAll(async (context) => {
		context.subject = await createLocalServices();
	});

	it("should succeed", async (context) => {
		nock.fake(/.+/)
			.get("/api/v2/accounts")
			.query(true)
			.reply(200, loader.json(`test/fixtures/client/delegate.json`));

		const result = await context.subject.delegate("punkrock");

		assert.instance(result, WalletData);
		assert.is(result.primaryKey(), "lskbps7ge5n9y7f8nk4222c77zkqcntrj7jyhmkwp");
		assert.is(result.address(), "lskbps7ge5n9y7f8nk4222c77zkqcntrj7jyhmkwp");
		assert.is(result.publicKey(), "3193057832bb1c9782a8e4a32e543b535ed9d750b1b10383f8b6f50853569609");
		assert.is(result.balance().available.toString(), "20110467794");
		assert.is(result.balance().fees.toString(), "20110467794");
		assert.is(result.nonce().toString(), "2");
		assert.undefined(result.secondPublicKey());
		assert.is(result.username(), "punkrock");
		assert.is(result.rank(), 1);
		assert.is(result.votes()?.toString(), "307554000000000");
		assert.true(result.isDelegate());
		assert.false(result.isResignedDelegate());
		assert.true(result.isMultiSignature());
		assert.false(result.isSecondSignature());
	});
});

describe("#delegates", async ({ beforeAll, it, assert, nock }) => {
	beforeAll(async (context) => {
		context.subject = await createLocalServices();
	});

	it("should succeed", async (context) => {
		nock.fake(/.+/)
			.get("/api/v2/accounts")
			.query(true)
			.reply(200, loader.json(`test/fixtures/client/delegates.json`));

		const result = await context.subject.delegates();
		const wallet = result.items()[0];

		assert.object(result);
		assert.instance(wallet, WalletData);
		assert.is(wallet.primaryKey(), "lskbps7ge5n9y7f8nk4222c77zkqcntrj7jyhmkwp");
		assert.is(wallet.address(), "lskbps7ge5n9y7f8nk4222c77zkqcntrj7jyhmkwp");
		assert.is(wallet.publicKey(), "3193057832bb1c9782a8e4a32e543b535ed9d750b1b10383f8b6f50853569609");
		assert.is(wallet.balance().toString(), "[object Object]");
		assert.is(wallet.nonce().toString(), "2");
		assert.undefined(wallet.secondPublicKey());
		assert.is(wallet.username(), "punkrock");
		assert.is(wallet.rank(), 1);
		assert.is(wallet.votes()?.toString(), "307554000000000");
		assert.true(wallet.isDelegate());
		assert.false(wallet.isResignedDelegate());
		assert.true(wallet.isMultiSignature());
		assert.false(wallet.isSecondSignature());
	});
});

describe("#votes", async ({ beforeAll, it, assert, nock }) => {
	beforeAll(async (context) => {
		context.subject = await createLocalServices();
	});

	it("should succeed", async (context) => {
		nock.fake(/.+/)
			.get("/api/v2/votes_sent")
			.query(true)
			.reply(200, loader.json(`test/fixtures/client/votes.json`));

		const result = await context.subject.votes("lskbps7ge5n9y7f8nk4222c77zkqcntrj7jyhmkwp");

		assert.object(result);
		assert.is(result.used, 1);
		assert.is(result.available, 19);
		assert.array(result.votes);
	});
});

describe("#unlockableBalances", ({ afterEach, beforeAll, beforeEach, it, assert, nock, stub }) => {
	beforeAll(async (context) => {
		const gotoTime = DateTime.make("2021-07-28 12:00");

		context.dateTime = stub(DateTime, "make");
		context.dateTime.returnValueOnce(gotoTime);
	});

	beforeEach(async () => createLocalServices());

	it('should return empty when the property "unlocking" is missing in the response', async () => {
		const subject = await createLocalServices();

		nock.fake(/.+/)
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
		assert.array(objects);
	});

	it("should have a pending balance if the current height is not greater than the unlock height", async () => {
		const subject = await createLocalServices();

		nock.fake(/.+/)
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

		assert.array(objects);
		assert.is(current.toHuman(), 0);
		assert.is(pending.toHuman(), 10);
	});

	it("should have a current balance if the current height is greater than or equal to the unlock height", async () => {
		const subject = await createLocalServices();

		nock.fake(/.+/)
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
		assert.array(objects);
		assert.is(objects[0].amount.toHuman(), 10);
	});
});

describe("#broadcast", ({ beforeEach, it, assert, nock }) => {
	beforeEach(async (context) => {
		context.subject = await createLocalServices();

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

		context.transactionPayload = createService(SignedTransactionData).configure(
			"5961193224963457718",
			transactionSigned,
			transactionSigned,
		);
	});

	it("should pass", async (context) => {
		nock.fake(/.+/).post("/api/v2/transactions").reply(200, loader.json(`test/fixtures/client/broadcast.json`));

		const result = await context.subject.broadcast([context.transactionPayload]);

		assert.equal(result, {
			accepted: ["5961193224963457718"],
			rejected: [],
			errors: {},
		});
	});

	it("should fail", async (context) => {
		nock.fake(/.+/)
			.post("/api/v2/transactions")
			.reply(200, loader.json(`test/fixtures/client/broadcast-failure.json`));

		const result = await context.subject.broadcast([context.transactionPayload]);

		assert.equal(result, {
			accepted: [],
			rejected: ["5961193224963457718"],
			errors: {
				"5961193224963457718": "Transaction payload was rejected by the network node",
			},
		});
	});

	it("should handle http exception", async (context) => {
		nock.fake(/.+/).post("/api/v2/transactions").reply(500, { message: "unknown error" });

		const result = await context.subject.broadcast([context.transactionPayload]);

		assert.equal(result, {
			accepted: [],
			rejected: ["5961193224963457718"],
			errors: {
				"5961193224963457718": "unknown error",
			},
		});
	});
});
