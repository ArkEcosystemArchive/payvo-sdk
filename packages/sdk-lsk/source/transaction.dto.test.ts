import "jest-extended";

import { DateTime } from "@payvo/intl";
import { BigNumber } from "@payvo/helpers";

import Fixture from "../test/fixtures/client/transaction.json";
import { createService, require } from "../test/mocking";
import { ConfirmedTransactionData } from "./transaction.dto";

let subject: ConfirmedTransactionData;

beforeEach(async () => {
	subject = await createService(ConfirmedTransactionData).configure(Fixture.data[0]);
});

describe("ConfirmedTransactionData", () => {
	test("#id", () => {
		expect(subject.id()).toBe("827037ee7a3ec5dd1a57e38287616226f40cf1d52feb156394ae66e98bc6f2c5");
	});

	test("#type", () => {
		expect(subject.type()).toBe("vote");
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

	test("#raw", () => {
		expect(subject.raw()).toEqual(Fixture.data[0]);
	});
});
