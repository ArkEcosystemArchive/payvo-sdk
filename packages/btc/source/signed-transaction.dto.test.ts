import "jest-extended";

import { createService } from "../test/mocking.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { oneSignatureMusigP2shSegwitTransferTx } from "../test/fixtures/musig-p2sh-segwit-txs.js";
import { unsignedNativeSegwitMusigRegistrationTx } from "../test/fixtures/musig-native-segwit-txs.js";

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
	it("#sender", () => {
		expect(subject.sender()).toBe("mv9pNZs3d65sjL68JueZDphWe3vHNmmSn6");
	});

	it("#recipient", () => {
		expect(subject.recipient()).toBe("tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn");
	});

	it("#amount", () => {
		expect(subject.amount().toNumber()).toBe(100_000);
	});

	it("#fee", () => {
		expect(subject.fee().toNumber()).toBe(12_430);
	});

	it("#timestamp", () => {
		expect(subject.timestamp().toISOString()).toBe("1970-01-01T00:00:00.000Z");
	});

	describe("multiSignature", function () {
		it("#isMultiSignatureRegistration for regular, non-musig transfer", () => {
			expect(subject.isMultiSignatureRegistration()).toBeFalse();
		});

		it("#isMultiSignatureRegistration for musig registration", () => {
			subject.configure(unsignedNativeSegwitMusigRegistrationTx.id, unsignedNativeSegwitMusigRegistrationTx, "");

			expect(subject.isMultiSignatureRegistration()).toBeTrue();
		});

		it("#isMultiSignatureRegistration for transfer", () => {
			subject.configure(oneSignatureMusigP2shSegwitTransferTx.id, oneSignatureMusigP2shSegwitTransferTx, "");

			expect(subject.isMultiSignatureRegistration()).toBeFalse();
		});
	});
});
