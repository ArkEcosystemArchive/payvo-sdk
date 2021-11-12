import "jest-extended";

import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/transaction.json";
import { createService, requireModule } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";

let subject: ConfirmedTransactionData;

describe("ConfirmedTransactionData", () => {
	beforeEach(async () => {
		subject = await createService(ConfirmedTransactionData).configure(Fixture.data[0]);
	});

	test("#id", () => {
		expect(subject.id()).toBe("827037ee7a3ec5dd1a57e38287616226f40cf1d52feb156394ae66e98bc6f2c5");
	});

	test("#blockId", () => {
		expect(subject.blockId()).toBe("52bb109394008afc59fae3bc288c0c52e4f50ad1e173afb164c7df40d44ff0ec");
	});

	describe("#type", () => {
		test("vote", () => {
			expect(subject.type()).toBe("vote");
		});

		test("unvote", async () => {
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

			expect((await createService(ConfirmedTransactionData).configure(data)).type()).toBe("unvote");
		});

		test("voteCombination", async () => {
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

			expect((await createService(ConfirmedTransactionData).configure(data)).type()).toBe("voteCombination");
		});
	});

	test("#timestamp", () => {
		expect(subject.timestamp()).toBeInstanceOf(DateTime);
		expect(subject.timestamp()?.toUNIX()).toBe(1625409490);
		expect(subject.timestamp()?.toISOString()).toBe("2021-07-04T14:38:10.000Z");
	});

	test("#confirmations", () => {
		expect(subject.confirmations()).toEqual(BigNumber.make(35754));
	});

	test("#sender", () => {
		expect(subject.sender()).toBe("lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3");
	});

	test("#recipient", () => {
		expect(subject.recipient()).toBe("lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3");
	});

	test("#recipients", () => {
		expect(subject.recipients()).toBeArray();
	});

	describe("#amount", () => {
		it("returns transaction amount", () => {
			expect(subject.amount()).toEqual(BigNumber.make("1"));
		});

		it("returns sum of unlock objects amounts if type is unlockToken", async () => {
			subject = await createService(ConfirmedTransactionData).configure({
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

			expect(subject.amount()).toBeInstanceOf(BigNumber);
			expect(subject.amount().toString()).toMatchInlineSnapshot(`"5000000000"`);
		});
	});

	test("#fee", () => {
		expect(subject.fee()).toEqual(BigNumber.make("10000000"));
	});

	test("#memo", () => {
		expect(subject.memo()).toBe("Account initialization");
	});

	test("#isConfirmed", () => {
		expect(subject.isConfirmed()).toBe(true);
	});

	test("#toObject", () => {
		expect(subject.toObject()).toBeObject();
	});

	test("#raw", () => {
		expect(subject.raw()).toEqual(Fixture.data[0]);
	});

	test("#votes", () => {
		expect(subject.votes()).toEqual(["lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3"]);
	});

	test("#unvotes", async () => {
		expect(
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
		).toEqual(["lskoh8tctdfpdaf8utmtevbd2f9b8vj2tmazeq8e3"]);
	});
});
