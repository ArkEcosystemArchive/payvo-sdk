import "jest-extended";

import { Exceptions } from "@payvo/sdk";

import { createService, requireModule } from "../test/mocking.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";

let subject: SignedTransactionData;

beforeEach(async () => {
	subject = await createService(SignedTransactionData);

	subject.configure(
		"912ff5cac9d386fad9ad59a7661ed713990a8db12a801b34a3e8de0f27057371",
		{
			sender: "mv9pNZs3d65sjL68JueZDphWe3vHNmmSn6",
			recipient: "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn",
			amount: 100_000,
			fee: 12_430,
			timestamp: "1970-01-01T00:00:00.000Z",
		},
		"",
	);
});

describe("SignedTransactionData", () => {
	test("#sender", () => {
		expect(subject.sender()).toBe("mv9pNZs3d65sjL68JueZDphWe3vHNmmSn6");
	});

	test("#recipient", () => {
		expect(subject.recipient()).toBe("tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn");
	});

	test("#amount", () => {
		expect(subject.amount().toNumber()).toBe(100_000);
	});

	test("#fee", () => {
		expect(subject.fee().toNumber()).toBe(12_430);
	});

	test("#timestamp", () => {
		expect(subject.timestamp().toISOString()).toBe("1970-01-01T00:00:00.000Z");
	});
});
