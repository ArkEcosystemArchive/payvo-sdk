import { describe } from "@payvo/sdk-test";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/transaction.json";
import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";

describe("ConfirmedTransactionData", async ({ beforeEach, it, assert }) => {
	beforeEach(async (context) => {
		context.subject = await createService(ConfirmedTransactionData).configure(Fixture.data[0]);
	});

	it("should have id", (context) => {
		assert.is(context.subject.id(), "827037ee7a3ec5dd1a57e38287616226f40cf1d52feb156394ae66e98bc6f2c5");
	});

	it("should have blockId", (context) => {
		assert.is(context.subject.blockId(), "52bb109394008afc59fae3bc288c0c52e4f50ad1e173afb164c7df40d44ff0ec");
	});

	it("should have type - vote", (context) => {
		assert.is(context.subject.type(), "vote");
	});

	it("should have type - unvote", async () => {
		const data = {
			...Fixture.data[0],
			asset: {
				votes: [
					{
						delegateAddress: "lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3",
						amount: "-29163000000000",
					},
				],
			},
		};

		assert.is((await createService(ConfirmedTransactionData).configure(data)).type(), "unvote");
	});

	it("should have type - voteCombination", async () => {
		const data = {
			...Fixture.data[0],
			asset: {
				votes: [
					{
						delegateAddress: "lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3",
						amount: "29163000000000",
					},
					{
						delegateAddress: "lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3",
						amount: "-29163000000000",
					},
				],
			},
		};

		assert.is((await createService(ConfirmedTransactionData).configure(data)).type(), "voteCombination");
	});

	it("should have timestamp", (context) => {
		assert.instance(context.subject.timestamp(), DateTime);
		assert.is(context.subject.timestamp()?.toUNIX(), 1625409490);
		assert.is(context.subject.timestamp()?.toISOString(), "2021-07-04T14:38:10.000Z");
	});

	it("should have confirmations", (context) => {
		assert.equal(context.subject.confirmations(), BigNumber.make(35754));
	});

	it("should have sender", (context) => {
		assert.is(context.subject.sender(), "lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3");
	});

	it("should have recipient", (context) => {
		assert.is(context.subject.recipient(), "lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3");
	});

	it("should have recipients", (context) => {
		assert.array(context.subject.recipients());
	});

	it("should return transaction amount", (context) => {
		assert.equal(context.subject.amount(), BigNumber.make("1"));
	});

	it("should return sum of unlock objects amounts when type is unlockToken", async (context) => {
		context.subject = await createService(ConfirmedTransactionData).configure({
			...Fixture.data[0],
			moduleAssetName: "dpos:unlockToken",
			asset: {
				unlockObjects: [
					{
						delegateAddress: "lskc579agejjw3fo9nvgg85r8vo6sa5xojtw9qscj",
						amount: "2000000000",
						unvoteHeight: 14548930,
					},
					{
						delegateAddress: "8c955e70d0da3e0424abc4c0683280232f41c48b",
						amount: "3000000000",
						unvoteHeight: 14548929,
					},
				],
			},
		});

		assert.instance(context.subject.amount(), BigNumber);
		assert.is(context.subject.amount().toString(), "5000000000");
	});

	it("should have fee", (context) => {
		assert.equal(context.subject.fee(), BigNumber.make("10000000"));
	});

	it("should have memo", (context) => {
		assert.is(context.subject.memo(), "Account initialization");
	});

	it("should have a method to know if the transaction is confirmed", (context) => {
		assert.true(context.subject.isConfirmed());
	});

	it("should have a method to serialize the transaction into an object", (context) => {
		assert.object(context.subject.toObject());
	});

	it("should have a method to return the raw transaction data", (context) => {
		assert.equal(context.subject.raw(), Fixture.data[0]);
	});

	it("should have votes", (context) => {
		assert.equal(context.subject.votes(), ["lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3"]);
	});

	it("should have unvotes", async () => {
		assert.equal(
			(
				await createService(ConfirmedTransactionData).configure({
					...Fixture.data[0],
					asset: {
						votes: [
							{
								delegateAddress: "lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3",
								amount: "-29163000000000",
							},
						],
					},
				})
			).unvotes(),
			["lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3"],
		);
	});
});
