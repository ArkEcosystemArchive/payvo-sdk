import "reflect-metadata";

import { bootContainer } from "../test/mocking";
import { ExchangeTransaction } from "./exchange-transaction";
import { ExchangeTransactionStatus } from "./exchange-transaction.enum";
import { Profile } from "./profile";

test.before(() => bootContainer());

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

	test.before(() => {
		dateNowSpy = jest.spyOn(Date, "now").mockImplementation(() => 123456789);
	});

	test.after(() => {
		dateNowSpy.mockRestore();
	});

	test.before.each(() => {
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

	test("should have an id", () => {
		assert.is(subject.id(), "uuid");
	});

	test("should have an orderId", () => {
		assert.is(subject.orderId(), "orderId");
	});

	test("should have an input object", () => {
		assert.is(subject.input().amount, 1);
	});

	test("should have an output amount", () => {
		assert.is(subject.output().amount, 100);
	});

	test("should be able to change output", () => {
		subject.setOutput({ ...subject.output(), amount: 1000 });
		assert.is(subject.output().amount, 1000);
	});

	test("should have a timestamp", () => {
		assert.is(subject.createdAt(), 123456789);
	});

	test("should have a status", () => {
		assert.is(subject.status(), ExchangeTransactionStatus.New);
	});

	test("should be able to change status", () => {
		subject.setStatus(ExchangeTransactionStatus.Finished);
		assert.is(subject.status(), ExchangeTransactionStatus.Finished);
	});

	test("should check if the transaction is expired", () => {
		assert.is(subject.isExpired(), false);

		subject.setStatus(ExchangeTransactionStatus.Expired);

		assert.is(subject.isExpired(), true);
	});

	test("should check if the transaction is failed", () => {
		assert.is(subject.isFailed(), false);

		subject.setStatus(ExchangeTransactionStatus.Failed);

		assert.is(subject.isFailed(), true);
	});

	test("should check if the transaction is finished", () => {
		assert.is(subject.isFinished(), false);

		subject.setStatus(ExchangeTransactionStatus.Finished);

		assert.is(subject.isFinished(), true);
	});

	test("should check if the transaction is pending", () => {
		assert.is(subject.isPending(), true);

		subject.setStatus(ExchangeTransactionStatus.Failed);

		assert.is(subject.isPending(), false);
	});

	test("should check if the transaction is refunded", () => {
		assert.is(subject.isRefunded(), false);

		subject.setStatus(ExchangeTransactionStatus.Refunded);

		assert.is(subject.isRefunded(), true);
	});

	test("should map to object", () => {
		assert.is(subject.toObject()).toStrictEqual({
			id: "uuid",
			createdAt: 123456789,
			status: ExchangeTransactionStatus.New,
			...stubData,
		});
	});
});
