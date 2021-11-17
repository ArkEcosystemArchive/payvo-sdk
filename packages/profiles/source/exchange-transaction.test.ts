import "reflect-metadata";

import { bootContainer } from "../test/mocking.js";
import { ExchangeTransaction } from "./exchange-transaction.js";
import { ExchangeTransactionStatus } from "./exchange-transaction.enum";
import { Profile } from "./profile.js";

beforeAll(() => bootContainer());

const stubData = {
	orderId: "orderId",
	provider: "provider",
	input: {
		amount: 1,
		ticker: "btc",
		address: "inputAddress",
	},
	output: {
		amount: 100,
		ticker: "ark",
		address: "outputAddress",
	},
};

describe("ExchangeTransaction", () => {
	let subject: ExchangeTransaction;
	let dateNowSpy;

	beforeAll(() => {
		dateNowSpy = jest.spyOn(Date, "now").mockImplementation(() => 123456789);
	});

	afterAll(() => {
		dateNowSpy.mockRestore();
	});

	beforeEach(() => {
		const profile = new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" });

		subject = new ExchangeTransaction(
			{
				id: "uuid",
				orderId: "orderId",
				provider: "provider",
				input: {
					amount: 1,
					ticker: "btc",
					address: "inputAddress",
				},
				output: {
					amount: 100,
					ticker: "ark",
					address: "outputAddress",
				},
			},
			profile,
		);
	});

	it("should have an id", () => {
		expect(subject.id()).toBe("uuid");
	});

	it("should have an orderId", () => {
		expect(subject.orderId()).toBe("orderId");
	});

	it("should have an input object", () => {
		expect(subject.input().amount).toBe(1);
	});

	it("should have an output amount", () => {
		expect(subject.output().amount).toBe(100);
	});

	it("should be able to change output", () => {
		subject.setOutput({ ...subject.output(), amount: 1000 });
		expect(subject.output().amount).toBe(1000);
	});

	it("should have a timestamp", () => {
		expect(subject.createdAt()).toBe(123456789);
	});

	it("should have a status", () => {
		expect(subject.status()).toBe(ExchangeTransactionStatus.New);
	});

	it("should be able to change status", () => {
		subject.setStatus(ExchangeTransactionStatus.Finished);
		expect(subject.status()).toBe(ExchangeTransactionStatus.Finished);
	});

	it("should check if the transaction is expired", () => {
		expect(subject.isExpired()).toBe(false);

		subject.setStatus(ExchangeTransactionStatus.Expired);

		expect(subject.isExpired()).toBe(true);
	});

	it("should check if the transaction is failed", () => {
		expect(subject.isFailed()).toBe(false);

		subject.setStatus(ExchangeTransactionStatus.Failed);

		expect(subject.isFailed()).toBe(true);
	});

	it("should check if the transaction is finished", () => {
		expect(subject.isFinished()).toBe(false);

		subject.setStatus(ExchangeTransactionStatus.Finished);

		expect(subject.isFinished()).toBe(true);
	});

	it("should check if the transaction is pending", () => {
		expect(subject.isPending()).toBe(true);

		subject.setStatus(ExchangeTransactionStatus.Failed);

		expect(subject.isPending()).toBe(false);
	});

	it("should check if the transaction is refunded", () => {
		expect(subject.isRefunded()).toBe(false);

		subject.setStatus(ExchangeTransactionStatus.Refunded);

		expect(subject.isRefunded()).toBe(true);
	});

	it("should map to object", () => {
		expect(subject.toObject()).toStrictEqual({
			id: "uuid",
			createdAt: 123456789,
			status: ExchangeTransactionStatus.New,
			...stubData,
		});
	});
});
