import { assert, describe, loader, test } from "@payvo/sdk-test";
import { DTO } from "@payvo/sdk";

import Fixture from "../test/fixtures/client/transaction.json";
import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";

let subject;

test.before.each(async () => {
	subject = await createService(ConfirmedTransactionData);
	subject.configure(Fixture.data.transactions[0]);
});

test("#id", () => {
	assert.is(subject.id(), "35b40547f04963d3b41478fc27038948d74718802c486d9125f1884d8c83a31d");
});

test("#blockId", () => {
	assert.undefined(subject.blockId());
});

test("#timestamp", () => {
	assert.is(subject.timestamp().toISOString(), "2021-02-05T15:04:16.000Z");
});

test("#confirmations", () => {
	assert.is(subject.confirmations().toString(), "0");
});

test("#sender", () => {
	assert.is(
		subject.sender(),
		"addr_test1qrhvwtn8sa3duzkm93v5kjjxlv5lvg67j530wyeumngu23lk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33s4s8xvh",
	);
});

test("#recipient", () => {
	assert.is(
		subject.recipient(),
		"addr_test1qzct2hsralem3fqn8fupu90v3jkelpg4rfp4zqx06zgevpachk6az8jcydma5a6vgsuw5c37v0c8j6rlclpqajn2vxsq3rz4th",
	);
});

test("#recipients", () => {
	const actual = subject.recipients();
	assert.is(
		actual[0].address,
		"addr_test1qzct2hsralem3fqn8fupu90v3jkelpg4rfp4zqx06zgevpachk6az8jcydma5a6vgsuw5c37v0c8j6rlclpqajn2vxsq3rz4th",
	);
	assert.is(actual[0].amount.toString(), "25000000");
	assert.is(
		actual[1].address,
		"addr_test1qzfjfm724nv9qz6nfyagmj0j2uppr35gzv5qee8s7489wxlk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33scc4thv",
	);
	assert.is(actual[1].amount.toString(), "4831199");
});

test("#inputs", () => {
	const inputs = subject.inputs();
	assert.length(inputs, 1);
	assert.undefined(inputs[0], DTO.UnspentTransactionData);
	assert.is(inputs[0].id(), "6bf76f4380da8a389ae0a7ecccf1922b74ae11d773ba8b1b761d84a1b4474a4f");
	assert.is(inputs[0].amount().toString(), "30000000");
	assert.is(
		inputs[0].address(),
		"addr_test1qrhvwtn8sa3duzkm93v5kjjxlv5lvg67j530wyeumngu23lk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33s4s8xvh",
	);
});

test("#outputs", () => {
	const outputs = subject.outputs();
	assert.length(outputs, 2);
	assert.undefined(outputs[0], DTO.UnspentTransactionData);
	assert.is(outputs[0].amount().toString(), "25000000");
	assert.is(
		outputs[0].address(),
		"addr_test1qzct2hsralem3fqn8fupu90v3jkelpg4rfp4zqx06zgevpachk6az8jcydma5a6vgsuw5c37v0c8j6rlclpqajn2vxsq3rz4th",
	);
	assert.undefined(outputs[1], DTO.UnspentTransactionData);
	assert.is(outputs[1].amount().toString(), "4831199");
	assert.is(
		outputs[1].address(),
		"addr_test1qzfjfm724nv9qz6nfyagmj0j2uppr35gzv5qee8s7489wxlk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33scc4thv",
	);
});

test("#amount", () => {
	assert.is(subject.amount().toString(), "25000000");
});

test("#fee", () => {
	assert.is(subject.fee().toString(), "168801");
});

test("#asset", () => {
	assert.is(subject.asset(), {});
});

test("#isConfirmed", () => {
	assert.false(subject.isConfirmed());
});

test("#isSent", () => {
	assert.false(subject.isSent());
});

test("#isReceived", () => {
	assert.false(subject.isReceived());
});

test("#isTransfer", () => {
	assert.true(subject.isTransfer());
});

test("#isSecondSignature", () => {
	assert.false(subject.isSecondSignature());
});

test("#isDelegateRegistration", () => {
	assert.false(subject.isDelegateRegistration());
});

test("#isVoteCombination", () => {
	assert.false(subject.isVoteCombination());
});

test("#isVote", () => {
	assert.false(subject.isVote());
});

test("#isUnvote", () => {
	assert.false(subject.isUnvote());
});

test("#isMultiSignatureRegistration", () => {
	assert.false(subject.isMultiSignatureRegistration());
});

test("#isIpfs", () => {
	assert.false(subject.isIpfs());
});

test("#isMultiPayment", () => {
	assert.false(subject.isMultiPayment());
});

test("#isDelegateResignation", () => {
	assert.false(subject.isDelegateResignation());
});

test("#isHtlcLock", () => {
	assert.false(subject.isHtlcLock());
});

test("#isHtlcClaim", () => {
	assert.false(subject.isHtlcClaim());
});

test("#isHtlcRefund", () => {
	assert.false(subject.isHtlcRefund());
});

test("#isMagistrate", () => {
	assert.false(subject.isMagistrate());
});

test.run();
