import { assert, describe, test } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/transaction.json";
import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";

let subject;

test.before.each(async () => {
	subject = await createService(ConfirmedTransactionData);
	subject.configure(Fixture);
});

test("#id", () => {
	assert.is(subject.id(), "0xf6ad7f16653a2070f36c5f9c243acb30109da76658b54712745136d8e8236eae");
});

test("#type", () => {
	assert.is(subject.type(), "transfer");
});

test("#timestamp", () => {
	assert.undefined(subject.timestamp());
});

test("#confirmations", () => {
	assert.is(subject.confirmations(), BigNumber.ZERO);
});

test("#sender", () => {
	assert.is(subject.sender(), "0xac1a0f50604c430c25a9fa52078f7f7ec9523519");
});

test("#recipient", () => {
	assert.is(subject.recipient(), "0xb5663d3a23706eb4537ffea78f56948a53ac2ebe");
});

test("#amount", () => {
	assert.is(subject.amount().toString(), "10000000000000000000");
});

test("#fee", () => {
	assert.is(subject.fee().toString(), "28000");
});

test("#memo", () => {
	assert.undefined(subject.memo());
});

test("#toObject", () => {
	assert.object(subject.toObject());
});

test("#raw", () => {
	assert.is(subject.raw(), Fixture);
});

test.run();
