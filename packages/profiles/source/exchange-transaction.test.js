// import { assert, describe, Mockery, loader, test } from "@payvo/sdk-test";
// import "reflect-metadata";

// import { bootContainer } from "../test/mocking";
// import { ExchangeTransaction } from "./exchange-transaction";
// import { ExchangeTransactionStatus } from "./exchange-transaction.enum";
// import { Profile } from "./profile";

// test.before(() => bootContainer());

// const stubData = {
// 	orderId: "orderId",
// 	provider: "provider",
// 	input: {
// 		amount: 1,
// 		ticker: "btc",
// 		address: "inputAddress",
// 	},
// 	output: {
// 		amount: 100,
// 		ticker: "ark",
// 		address: "outputAddress",
// 	},
// };

// let subject;
// let dateNowSpy;

// test.before(() => {
// 	dateNowSpy = Mockery.stub(Date, "now").mockImplementation(() => 123456789);
// });

// test.after(() => {
// 	dateNowSpy.mockRestore();
// });

// test.before.each(() => {
// 	const profile = new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" });

// 	subject = new ExchangeTransaction(
// 		{
// 			id: "uuid",
// 			orderId: "orderId",
// 			provider: "provider",
// 			input: {
// 				amount: 1,
// 				ticker: "btc",
// 				address: "inputAddress",
// 			},
// 			output: {
// 				amount: 100,
// 				ticker: "ark",
// 				address: "outputAddress",
// 			},
// 		},
// 		profile,
// 	);
// });

// test("should have an id", () => {
// 	assert.is(subject.id(), "uuid");
// });

// test("should have an orderId", () => {
// 	assert.is(subject.orderId(), "orderId");
// });

// test("should have an input object", () => {
// 	assert.is(subject.input().amount, 1);
// });

// test("should have an output amount", () => {
// 	assert.is(subject.output().amount, 100);
// });

// test("should be able to change output", () => {
// 	subject.setOutput({ ...subject.output(), amount: 1000 });
// 	assert.is(subject.output().amount, 1000);
// });

// test("should have a timestamp", () => {
// 	assert.is(subject.createdAt(), 123456789);
// });

// test("should have a status", () => {
// 	assert.is(subject.status(), ExchangeTransactionStatus.New);
// });

// test("should be able to change status", () => {
// 	subject.setStatus(ExchangeTransactionStatus.Finished);
// 	assert.is(subject.status(), ExchangeTransactionStatus.Finished);
// });

// test("should check if the transaction is expired", () => {
// 	assert.false(subject.isExpired());

// 	subject.setStatus(ExchangeTransactionStatus.Expired);

// 	assert.true(subject.isExpired());
// });

// test("should check if the transaction is failed", () => {
// 	assert.false(subject.isFailed());

// 	subject.setStatus(ExchangeTransactionStatus.Failed);

// 	assert.true(subject.isFailed());
// });

// test("should check if the transaction is finished", () => {
// 	assert.false(subject.isFinished());

// 	subject.setStatus(ExchangeTransactionStatus.Finished);

// 	assert.true(subject.isFinished());
// });

// test("should check if the transaction is pending", () => {
// 	assert.true(subject.isPending());

// 	subject.setStatus(ExchangeTransactionStatus.Failed);

// 	assert.false(subject.isPending());
// });

// test("should check if the transaction is refunded", () => {
// 	assert.false(subject.isRefunded());

// 	subject.setStatus(ExchangeTransactionStatus.Refunded);

// 	assert.true(subject.isRefunded());
// });

// test("should map to object", () => {
// 	assert.equal(subject.toObject(), {
// 		id: "uuid",
// 		createdAt: 123456789,
// 		status: ExchangeTransactionStatus.New,
// 		...stubData,
// 	});
// });

// test.run();

// @TODO: mockRestore is leaking
