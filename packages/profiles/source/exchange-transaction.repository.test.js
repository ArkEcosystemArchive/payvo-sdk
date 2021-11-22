// import { assert, describe, mockery, loader, test } from "@payvo/sdk-test";
// import "reflect-metadata";

// import { bootContainer } from "../test/mocking";
// import { ExchangeTransactionRepository } from "./exchange-transaction.repository";
// import { ExchangeTransactionStatus } from "./contracts";
// import { Profile } from "./profile";

// test.before(() => bootContainer());

// const stubData = {
// 	orderId: "orderId",
// 	provider: "provider",
// 	input: {
// 		address: "inputAddress",
// 		amount: 1,
// 		ticker: "btc",
// 	},
// 	output: {
// 		address: "outputAddress",
// 		amount: 100,
// 		ticker: "ark",
// 	},
// };

// let subject;
// let dateNowSpy;

// test.before(() => {
// 	dateNowSpy = mockery(Date, "now").mockImplementation(() => 123456789);
// });

// test.after(() => {
// 	dateNowSpy.mockRestore();
// });

// test.before.each(() => {
// 	const profile = new Profile({ id: "profile-id", name: "name", avatar: "avatar", data: "" });

// 	subject = new ExchangeTransactionRepository(profile);

// 	subject.flush();
// });

// test("#all", () => {
// 	assert.object(subject.all());
// });

// test("#create", () => {
// 	assert.length(subject.keys(), 0);

// 	const exchangeTransaction = subject.create(stubData);

// 	assert.length(subject.keys(), 1);

// 	assert.equal(exchangeTransaction.toObject(), {
// 		id: exchangeTransaction.id(),
// 		status: ExchangeTransactionStatus.New,
// 		createdAt: 123456789,
// 		...stubData,
// 	});

// 	assert.throws(
// 		() => subject.create(stubData),
// 		`The exchange transaction [${stubData.provider} / ${stubData.orderId}] already exists.`,
// 	);

// 	assert.is(subject.count(), 1);
// });

// test("#find", () => {
// 	assert.throws(() => subject.findById("invalid"), "Failed to find");

// 	const exchangeTransaction = subject.create(stubData);

// 	assert.object(subject.findById(exchangeTransaction.id()));
// });

// test("#update", () => {
// 	assert.throws(() => subject.update("invalid", { status: ExchangeTransactionStatus.Finished }), "Failed to find");

// 	const exchangeTransaction = subject.create(stubData);

// 	subject.update(exchangeTransaction.id(), { status: ExchangeTransactionStatus.Finished });

// 	assert.is(subject.findById(exchangeTransaction.id()).status(), ExchangeTransactionStatus.Finished);

// 	subject.update(exchangeTransaction.id(), { output: { ...stubData.output, amount: 1000 } });

// 	assert.is(subject.findById(exchangeTransaction.id()).output().amount, 1000);

// 	subject.update(exchangeTransaction.id(), { input: { ...stubData.input, hash: "hash" } });

// 	assert.is(subject.findById(exchangeTransaction.id()).input().hash, "hash");
// });

// test("#forget", () => {
// 	assert.throws(() => subject.forget("invalid"), "Failed to find");

// 	const exchangeTransaction = subject.create(stubData);

// 	assert.length(subject.keys(), 1);

// 	subject.forget(exchangeTransaction.id());

// 	assert.length(subject.keys(), 0);

// 	assert.throws(() => subject.findById(exchangeTransaction.id()), "Failed to find");
// });

// test("#findByStatus", () => {
// 	subject.create(stubData);
// 	const exchangeTransaction = subject.create({ ...stubData, provider: "another provider" });

// 	exchangeTransaction.setStatus(ExchangeTransactionStatus.Finished);

// 	assert.length(subject.findByStatus(ExchangeTransactionStatus.New), 1);
// 	assert.length(subject.findByStatus(ExchangeTransactionStatus.Finished), 1);
// });

// test("#pending", () => {
// 	const exchangeTransaction = subject.create(stubData);

// 	assert.length(subject.pending(), 1);

// 	exchangeTransaction.setStatus(ExchangeTransactionStatus.Finished);

// 	assert.length(subject.pending(), 0);
// });

// test("#flush", () => {
// 	subject.create(stubData);

// 	assert.length(subject.keys(), 1);

// 	subject.flush();

// 	assert.length(subject.keys(), 0);
// });

// test("#toObject", () => {
// 	const exchangeTransaction = subject.create(stubData);

// 	assert.equal(subject.toObject(), {
// 		[exchangeTransaction.id()]: {
// 			id: exchangeTransaction.id(),
// 			status: ExchangeTransactionStatus.New,
// 			createdAt: 123456789,
// 			...stubData,
// 		},
// 	});
// });

// test("#fill", () => {
// 	const exchangeTransactions = {
// 		id: {
// 			id: "id",
// 			status: ExchangeTransactionStatus.New,
// 			createdAt: 123456789,
// 			...stubData,
// 		},
// 	};

// 	assert.is(subject.count(), 0);

// 	subject.fill(exchangeTransactions);

// 	assert.is(subject.count(), 1);

// 	assert.equal(subject.values()[0].toObject(), Object.values(exchangeTransactions)[0]);
// });

// test.run();

// @TODO: mockRestore is leaking
