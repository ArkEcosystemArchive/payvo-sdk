import "reflect-metadata";

import { bootContainer } from "../test/mocking.js";
import { ExchangeTransactionRepository } from "./exchange-transaction.repository";
import { ExchangeTransactionStatus } from "./contracts.js";
import { Profile } from "./profile.js";

beforeAll(() => bootContainer());

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

	beforeAll(() => {
		dateNowSpy = jest.spyOn(Date, "now").mockImplementation(() => 123456789);
	});

	afterAll(() => {
		dateNowSpy.mockRestore();
	});

	beforeEach(() => {
		const profile = new Profile({ id: "profile-id", name: "name", avatar: "avatar", data: "" });

		subject = new ExchangeTransactionRepository(profile);

		subject.flush();
	});

	test("#all", () => {
		expect(subject.all()).toBeObject();
	});

	test("#create", () => {
		expect(subject.keys()).toHaveLength(0);

		const exchangeTransaction = subject.create(stubData);

		expect(subject.keys()).toHaveLength(1);

		expect(exchangeTransaction.toObject()).toStrictEqual({
			id: exchangeTransaction.id(),
			status: ExchangeTransactionStatus.New,
			createdAt: 123456789,
			...stubData,
		});

		expect(() => subject.create(stubData)).toThrowError(
			`The exchange transaction [${stubData.provider} / ${stubData.orderId}] already exists.`,
		);
		expect(subject.count()).toEqual(1);
	});

	test("#find", () => {
		expect(() => subject.findById("invalid")).toThrowError("Failed to find");

		const exchangeTransaction = subject.create(stubData);

		expect(subject.findById(exchangeTransaction.id())).toBeObject();
	});

	test("#update", () => {
		expect(() => subject.update("invalid", { status: ExchangeTransactionStatus.Finished })).toThrowError(
			"Failed to find",
		);

		const exchangeTransaction = subject.create(stubData);

		subject.update(exchangeTransaction.id(), { status: ExchangeTransactionStatus.Finished });

		expect(subject.findById(exchangeTransaction.id()).status()).toEqual(ExchangeTransactionStatus.Finished);

		subject.update(exchangeTransaction.id(), { output: { ...stubData.output, amount: 1000 } });

		expect(subject.findById(exchangeTransaction.id()).output().amount).toEqual(1000);

		subject.update(exchangeTransaction.id(), { input: { ...stubData.input, hash: "hash" } });

		expect(subject.findById(exchangeTransaction.id()).input().hash).toEqual("hash");
	});

	test("#forget", () => {
		expect(() => subject.forget("invalid")).toThrowError("Failed to find");

		const exchangeTransaction = subject.create(stubData);

		expect(subject.keys()).toHaveLength(1);

		subject.forget(exchangeTransaction.id());

		expect(subject.keys()).toHaveLength(0);

		expect(() => subject.findById(exchangeTransaction.id())).toThrowError("Failed to find");
	});

	test("#findByStatus", () => {
		subject.create(stubData);
		const exchangeTransaction = subject.create({ ...stubData, provider: "another provider" });

		exchangeTransaction.setStatus(ExchangeTransactionStatus.Finished);

		expect(subject.findByStatus(ExchangeTransactionStatus.New)).toHaveLength(1);
		expect(subject.findByStatus(ExchangeTransactionStatus.Finished)).toHaveLength(1);
	});

	test("#pending", () => {
		const exchangeTransaction = subject.create(stubData);

		expect(subject.pending()).toHaveLength(1);

		exchangeTransaction.setStatus(ExchangeTransactionStatus.Finished);

		expect(subject.pending()).toHaveLength(0);
	});

	test("#flush", () => {
		subject.create(stubData);

		expect(subject.keys()).toHaveLength(1);

		subject.flush();

		expect(subject.keys()).toHaveLength(0);
	});

	test("#toObject", () => {
		const exchangeTransaction = subject.create(stubData);

		expect(subject.toObject()).toStrictEqual({
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

		expect(subject.count()).toBe(0);

		subject.fill(exchangeTransactions);

		expect(subject.count()).toBe(1);

		expect(subject.values()[0].toObject()).toStrictEqual(Object.values(exchangeTransactions)[0]);
	});
});
