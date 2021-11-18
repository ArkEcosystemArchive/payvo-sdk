import "reflect-metadata";

import { bootContainer } from "../test/mocking";
import { ExchangeTransactionRepository } from "./exchange-transaction.repository";
import { ExchangeTransactionStatus } from "./contracts";
import { Profile } from "./profile";

test.before(() => bootContainer());

const stubData = {
	orderId: "orderId",
	provider: "provider",
	input: {
		address: "inputAddress",
		amount: 1,
		ticker: "btc",
	},
	output: {
		address: "outputAddress",
		amount: 100,
		ticker: "ark",
	},
};

describe("ExchangeTransactionRepository", () => {
	let subject: ExchangeTransactionRepository;
	let dateNowSpy;

	test.before(() => {
		dateNowSpy = jest.spyOn(Date, "now").mockImplementation(() => 123456789);
	});

	test.after(() => {
		dateNowSpy.mockRestore();
	});

	test.before.each(() => {
		const profile = new Profile({ id: "profile-id", name: "name", avatar: "avatar", data: "" });

		subject = new ExchangeTransactionRepository(profile);

		subject.flush();
	});

	test("#all", () => {
		assert.is(subject.all(), "object");
	});

	test("#create", () => {
		assert.is(subject.keys()).toHaveLength(0);

		const exchangeTransaction = subject.create(stubData);

		assert.is(subject.keys()).toHaveLength(1);

		assert.is(exchangeTransaction.toObject()).toStrictEqual({
			id: exchangeTransaction.id(),
			status: ExchangeTransactionStatus.New,
			createdAt: 123456789,
			...stubData,
		});

		assert
			.is(() => subject.create(stubData))
			.toThrowError(`The exchange transaction [${stubData.provider} / ${stubData.orderId}] already exists.`);
		assert.is(subject.count(), 1);
	});

	test("#find", () => {
		assert.is(() => subject.findById("invalid")).toThrowError("Failed to find");

		const exchangeTransaction = subject.create(stubData);

		assert.is(subject.findById(exchangeTransaction.id()), "object");
	});

	test("#update", () => {
		assert
			.is(() => subject.update("invalid", { status: ExchangeTransactionStatus.Finished }))
			.toThrowError("Failed to find");

		const exchangeTransaction = subject.create(stubData);

		subject.update(exchangeTransaction.id(), { status: ExchangeTransactionStatus.Finished });

		assert.is(subject.findById(exchangeTransaction.id()).status(), ExchangeTransactionStatus.Finished);

		subject.update(exchangeTransaction.id(), { output: { ...stubData.output, amount: 1000 } });

		assert.is(subject.findById(exchangeTransaction.id()).output().amount, 1000);

		subject.update(exchangeTransaction.id(), { input: { ...stubData.input, hash: "hash" } });

		assert.is(subject.findById(exchangeTransaction.id()).input().hash, "hash");
	});

	test("#forget", () => {
		assert.is(() => subject.forget("invalid")).toThrowError("Failed to find");

		const exchangeTransaction = subject.create(stubData);

		assert.is(subject.keys()).toHaveLength(1);

		subject.forget(exchangeTransaction.id());

		assert.is(subject.keys()).toHaveLength(0);

		assert.is(() => subject.findById(exchangeTransaction.id())).toThrowError("Failed to find");
	});

	test("#findByStatus", () => {
		subject.create(stubData);
		const exchangeTransaction = subject.create({ ...stubData, provider: "another provider" });

		exchangeTransaction.setStatus(ExchangeTransactionStatus.Finished);

		assert.is(subject.findByStatus(ExchangeTransactionStatus.New)).toHaveLength(1);
		assert.is(subject.findByStatus(ExchangeTransactionStatus.Finished)).toHaveLength(1);
	});

	test("#pending", () => {
		const exchangeTransaction = subject.create(stubData);

		assert.is(subject.pending()).toHaveLength(1);

		exchangeTransaction.setStatus(ExchangeTransactionStatus.Finished);

		assert.is(subject.pending()).toHaveLength(0);
	});

	test("#flush", () => {
		subject.create(stubData);

		assert.is(subject.keys()).toHaveLength(1);

		subject.flush();

		assert.is(subject.keys()).toHaveLength(0);
	});

	test("#toObject", () => {
		const exchangeTransaction = subject.create(stubData);

		assert.is(subject.toObject()).toStrictEqual({
			[exchangeTransaction.id()]: {
				id: exchangeTransaction.id(),
				status: ExchangeTransactionStatus.New,
				createdAt: 123456789,
				...stubData,
			},
		});
	});

	test("#fill", () => {
		const exchangeTransactions = {
			id: {
				id: "id",
				status: ExchangeTransactionStatus.New,
				createdAt: 123456789,
				...stubData,
			},
		};

		assert.is(subject.count(), 0);

		subject.fill(exchangeTransactions);

		assert.is(subject.count(), 1);

		assert.is(subject.values()[0].toObject()).toStrictEqual(Object.values(exchangeTransactions)[0]);
	});
});
