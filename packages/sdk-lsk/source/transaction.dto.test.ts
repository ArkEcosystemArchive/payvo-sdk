import "jest-extended";

import { DateTime } from "@payvo/intl";
import { BigNumber } from "@payvo/helpers";

import Fixture from "../test/fixtures/client/transaction.json";
import FixtureLegacy from "../test/fixtures/client/transaction-legacy.json";
import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";

let subject: ConfirmedTransactionData;

describe("ConfirmedTransactionData", () => {
	describe("2.0", () => {
		beforeEach(async () => {
			subject = await createService(ConfirmedTransactionData).configure(FixtureLegacy.data[0]);
		});

		test("#id", () => {
			expect(subject.id()).toBe("3176941083950565875");
		});

		test("#blockId", () => {
			expect(subject.blockId()).toBe("4497389056834647425");
		});

		test("#type", () => {
			expect(subject.type()).toBe("transfer");
		});

		test("#timestamp", () => {
			expect(subject.timestamp()).toBeInstanceOf(DateTime);
			expect(subject.timestamp()?.toUNIX()).toBe(1464188368);
			expect(subject.timestamp()?.toISOString()).toBe("2016-05-25T14:59:28.000Z");
		});

		test("#confirmations", () => {
			expect(subject.confirmations()).toEqual(BigNumber.make(35754));
		});

		describe("#sender", () => {
			it("should return sender address", () => {
				expect(subject.sender()).toBe("11949377625793351079L");
			});

			it("should derive sender address from publicKey when not available", async () => {
				const { senderId, ...data } = FixtureLegacy.data[0];

				expect((await createService(ConfirmedTransactionData).configure(data)).sender()).toBe(
					"lskkgbet2mceg665cfrreqxgc3aw9hzapdshd2q7d",
				);
			});
		});

		test("#recipient", () => {
			expect(subject.recipient()).toBe("11949377625793351079L");
		});

		test("#recipients", () => {
			expect(subject.recipients()).toBeArray();
		});

		test("#amount", () => {
			expect(subject.amount()).toEqual(BigNumber.make("1"));
		});

		test("#fee", () => {
			expect(subject.fee()).toEqual(BigNumber.make("10000000"));
		});

		test("#memo", () => {
			expect(subject.memo()).toBe("Account initialization");
		});

		test("#toObject", () => {
			expect(subject.toObject()).toBeObject();
		});

		test("#username", async () => {
			expect(
				(
					await createService(ConfirmedTransactionData).configure({
						...FixtureLegacy.data[0],
						asset: { delegate: { username: "username" } },
					})
				).username(),
			).toBe("username");
		});

		test("#publicKeys", async () => {
			expect(
				(
					await createService(ConfirmedTransactionData).configure({
						...FixtureLegacy.data[0],
						asset: {
							mandatoryKeys: [],
							optionalKeys: [],
						},
					})
				).publicKeys(),
			).toEqual([]);
		});

		test("#min", async () => {
			expect(
				(
					await createService(ConfirmedTransactionData).configure({
						...FixtureLegacy.data[0],
						asset: { numberOfSignatures: 2 },
					})
				).min(),
			).toBe(2);
		});

		test("#raw", () => {
			expect(subject.raw()).toEqual(FixtureLegacy.data[0]);
		});

		test("#votes", async () => {
			expect(
				(
					await createService(ConfirmedTransactionData).configure({
						...FixtureLegacy.data[0],
						asset: {
							votes: ["+d9187cbbafe261088163221874fc8de2d6e4ade9bfe1eba7f3787d56e599495c"],
						},
					})
				).votes(),
			).toEqual(["d9187cbbafe261088163221874fc8de2d6e4ade9bfe1eba7f3787d56e599495c"]);
		});

		test("#unvotes", async () => {
			expect(
				(
					await createService(ConfirmedTransactionData).configure({
						...FixtureLegacy.data[0],
						asset: {
							votes: ["-d9187cbbafe261088163221874fc8de2d6e4ade9bfe1eba7f3787d56e599495c"],
						},
					})
				).unvotes(),
			).toEqual(["d9187cbbafe261088163221874fc8de2d6e4ade9bfe1eba7f3787d56e599495c"]);
		});
	});

	describe("3.0", () => {
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
});
