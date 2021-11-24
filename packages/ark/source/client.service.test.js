import { describe } from "@payvo/sdk-test";
import { IoC, Services } from "@payvo/sdk";
import { nock } from "@payvo/sdk-test";

import { createService } from "../test/mocking";
import { ClientService } from "./client.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

let subject;

describe("AddressService", async ({ assert, afterEach, beforeAll, it, loader }) => {
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

	afterEach(() => nock.cleanAll());

	it("should retrieve a transaction", async () => {
		nock.fake(/.+/)
			.get("/api/transactions/3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572")
			.reply(200, loader.json(`test/fixtures/client/transaction.json`));

		const result = await subject.transaction("3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572");

		assert.instance(result, ConfirmedTransactionData);
	});

	it("should retrieve a list of transactions for a single address via Core 2.0", async () => {
		nock.fake(/.+/)
			.get("/api/transactions")
			.query({ address: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8", page: "0" })
			.reply(200, loader.json(`test/fixtures/client/transactions.json`));

		const result = await subject.transactions({
			identifiers: [{ type: "address", value: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" }],
			cursor: "0",
		});

		assert.object(result);
		assert.instance(result.items()[0], ConfirmedTransactionData);
	});

	it("should retrieve a list of transactions for multiple addresses via Core 2.0", async () => {
		nock.fake(/.+/)
			.get("/api/transactions")
			.query({
				page: "0",
				address: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8,DRwgqrfuuaPCy3AE8Sz1AjdrncKfHjePn5",
			})
			.reply(200, loader.json(`test/fixtures/client/transactions.json`));

		const result = await subject.transactions({
			identifiers: [
				{ type: "address", value: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" },
				{ type: "address", value: "DRwgqrfuuaPCy3AE8Sz1AjdrncKfHjePn5" },
			],
			cursor: "0",
		});

		assert.object(result);
		assert.instance(result.items()[0], ConfirmedTransactionData);
	});

	it("should retrieve a list of transactions for a single address via Core 3.0", async () => {
		nock.fake(/.+/)
			.get("/api/transactions")
			.query({ address: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" })
			.reply(200, loader.json(`test/fixtures/client/transactions.json`));

		const result = await subject.transactions({
			identifiers: [{ type: "address", value: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" }],
		});

		assert.object(result);
		assert.instance(result.items()[0], ConfirmedTransactionData);
	});

	it("should retrieve a list of transactions for multiple addresses via Core 3.0", async () => {
		nock.fake(/.+/)
			.get("/api/transactions")
			.query({ address: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8,DRwgqrfuuaPCy3AE8Sz1AjdrncKfHjePn5" })
			.reply(200, loader.json(`test/fixtures/client/transactions.json`));

		const result = await subject.transactions({
			identifiers: [
				{ type: "address", value: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" },
				{ type: "address", value: "DRwgqrfuuaPCy3AE8Sz1AjdrncKfHjePn5" },
			],
		});

		assert.object(result);
		assert.instance(result.items()[0], ConfirmedTransactionData);
	});

	it("should retrieve a list of transactions for an advanced search via Core 3.0", async () => {
		nock.fake(/.+/)
			.get("/api/transactions")
			.query({
				address: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8",
				"asset.type": "4",
				"asset.action": "0",
				type: 0,
				typeGroup: 1,
			})
			.reply(200, loader.json(`test/fixtures/client/transactions.json`));

		const result = await subject.transactions({
			identifiers: [{ type: "address", value: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" }],
			asset: { type: 4, action: 0 },
			type: "transfer",
		});

		assert.object(result);
		assert.instance(result.items()[0], ConfirmedTransactionData);
	});

	it("should retrieve a wallet", async () => {
		nock.fake(/.+/)
			.get("/api/wallets/DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9")
			.reply(200, loader.json(`test/fixtures/client/wallet.json`));

		const result = await subject.wallet({
			type: "address",
			value: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
		});

		assert.instance(result, WalletData);
	});

	it("should retrieve a list of wallets via Core 2.0", async () => {
		subject = await createService(ClientService, "ark.mainnet", (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.constant(IoC.BindingType.DataTransferObjects, {
				SignedTransactionData,
				ConfirmedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		});

		nock.fake(/.+/)
			.get("/api/wallets")
			.query({ address: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" })
			.reply(200, loader.json(`test/fixtures/client/wallets.json`));

		const result = await subject.wallets({
			identifiers: [{ type: "address", value: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" }],
		});

		assert.object(result);
		assert.instance(result.items()[0], WalletData);
	});

	it("should retrieve a list of wallets via Core 3.0", async () => {
		subject = await createService(ClientService, "ark.devnet", (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.constant(IoC.BindingType.DataTransferObjects, {
				SignedTransactionData,
				ConfirmedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		});

		nock.fake(/.+/)
			.get("/api/wallets")
			.query({ address: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" })
			.reply(200, loader.json(`test/fixtures/client/wallets.json`));

		const result = await subject.wallets({
			identifiers: [{ type: "address", value: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" }],
		});

		assert.object(result);
		assert.instance(result.items()[0], WalletData);
	});

	it("should retrieve a delegate", async () => {
		nock.fake(/.+/).get("/api/delegates/arkx").reply(200, loader.json(`test/fixtures/client/delegate.json`));

		const result = await subject.delegate("arkx");

		assert.instance(result, WalletData);
	});

	it("should retrieve a list of delegates", async () => {
		nock.fake(/.+/).get("/api/delegates").reply(200, loader.json(`test/fixtures/client/delegates.json`));

		const result = await subject.delegates();

		assert.object(result);
		assert.instance(result.items()[0], WalletData);
	});

	it("should retrieve votes of a wallet", async () => {
		const fixture = loader.json(`test/fixtures/client/wallet.json`);

		nock.fake(/.+/).get("/api/wallets/arkx").reply(200, fixture);

		const result = await subject.votes("arkx");

		assert.object(result);
		assert.is(result.used, 1);
		assert.is(result.available, 0);
		assert.array(result.votes);
	});

	it("should retrieve votes of a wallet without a vote", async () => {
		const fixture = loader.json(`test/fixtures/client/wallet.json`);

		const fixtureWithoutVote = {
			data: {
				...fixture.data,
				attributes: {
					...fixture.data.attributes,
					vote: undefined,
				},
				vote: undefined,
			},
		};

		nock.fake(/.+/).get("/api/wallets/arkx").reply(200, fixtureWithoutVote);

		const result = await subject.votes("arkx");

		assert.object(result);
		assert.is(result.used, 0);
		assert.is(result.available, 1);
		assert.array(result.votes);
	});

	it("should retrieve votes of a wallet without attributes when not voting", async () => {
		const fixture = loader.json(`test/fixtures/client/wallet.json`);

		const fixtureWithoutVote = {
			data: {
				...fixture.data,
				attributes: undefined,
				vote: undefined,
			},
		};

		nock.fake(/.+/).get("/api/wallets/arkx").reply(200, fixtureWithoutVote);

		const result = await subject.votes("arkx");

		assert.object(result);
		assert.is(result.used, 0);
		assert.is(result.available, 1);
		assert.array(result.votes);
	});

	it("should retrieve votes of a wallet without attributes", async () => {
		const fixture = loader.json(`test/fixtures/client/wallet.json`);

		const fixtureWithoutVote = {
			data: {
				...fixture.data,
				attributes: undefined,
			},
		};

		nock.fake(/.+/).get("/api/wallets/arkx").reply(200, fixtureWithoutVote);

		const result = await subject.votes("arkx");

		assert.object(result);
		assert.is(result.used, 1);
		assert.is(result.available, 0);
		assert.array(result.votes);
	});

	it("should retrieve a list of voters", async () => {
		nock.fake(/.+/).get("/api/delegates/arkx/voters").reply(200, loader.json(`test/fixtures/client/voters.json`));

		const result = await subject.voters("arkx");

		assert.object(result);
		assert.instance(result.items()[0], WalletData);
	});

	it("should broadcast and accept 1 transaction and reject 1 transaction", async () => {
		const fixture = loader.json(`test/fixtures/client/broadcast.json`);
		nock.fake(/.+/).post("/api/transactions").reply(422, fixture);

		const mock = { toBroadcast: () => "" };
		const result = await subject.broadcast([mock]);

		assert.equal(result, {
			accepted: ["e4311204acf8a86ba833e494f5292475c6e9e0913fc455a12601b4b6b55818d8"],
			rejected: ["d4cb4edfbd50a5d71d3d190a687145530b73f041c59e2c4137fe8b3d1f970216"],
			errors: {
				d4cb4edfbd50a5d71d3d190a687145530b73f041c59e2c4137fe8b3d1f970216: "Already forged.",
			},
		});
	});

	it("should broadcast and read errors in non-array format", async () => {
		const fixture = loader.json(`test/fixtures/client/broadcast.json`);
		const errorId = Object.keys(fixture.errors)[0];
		const nonArrayFixture = {
			data: fixture.data,
			errors: { [errorId]: fixture.errors[errorId][0] },
		};

		nock.fake(/.+/).post("/api/transactions").reply(422, nonArrayFixture);

		const mock = { toBroadcast: () => "" };
		const result = await subject.broadcast([mock]);

		assert.equal(result, {
			accepted: ["e4311204acf8a86ba833e494f5292475c6e9e0913fc455a12601b4b6b55818d8"],
			rejected: ["d4cb4edfbd50a5d71d3d190a687145530b73f041c59e2c4137fe8b3d1f970216"],
			errors: {
				d4cb4edfbd50a5d71d3d190a687145530b73f041c59e2c4137fe8b3d1f970216: "Already forged.",
			},
		});
	});
});
