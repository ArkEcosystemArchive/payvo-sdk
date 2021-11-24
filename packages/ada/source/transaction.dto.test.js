import { describe } from "@payvo/sdk-test";
import { DTO } from "@payvo/sdk";

import Fixture from "../test/fixtures/client/transaction.json";
import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";

let subject;

describe("ConfirmedTransactionData", async ({ assert, beforeEach, it }) => {
	beforeEach(async () => {
		subject = await createService(ConfirmedTransactionData);
		subject.configure(Fixture.data.transactions[0]);
	});

	it("should have an id", () => {
		assert.is(subject.id(), "35b40547f04963d3b41478fc27038948d74718802c486d9125f1884d8c83a31d");
	});

	it("should have a blockId", () => {
		assert.undefined(subject.blockId());
	});

	it("should have a timestamp", () => {
		assert.is(subject.timestamp().toISOString(), "2021-02-05T15:04:16.000Z");
	});

	it("should have confirmations", () => {
		assert.is(subject.confirmations().toString(), "0");
	});

	it("should have a sender", () => {
		assert.is(
			subject.sender(),
			"addr_test1qrhvwtn8sa3duzkm93v5kjjxlv5lvg67j530wyeumngu23lk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33s4s8xvh",
		);
	});

	it("should have a recipient", () => {
		assert.is(
			subject.recipient(),
			"addr_test1qzct2hsralem3fqn8fupu90v3jkelpg4rfp4zqx06zgevpachk6az8jcydma5a6vgsuw5c37v0c8j6rlclpqajn2vxsq3rz4th",
		);
	});

	it("should have recipients", () => {
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

	it("should have inputs", () => {
		const inputs = subject.inputs();
		assert.length(inputs, 1);
		assert.instance(inputs[0], DTO.UnspentTransactionData);
		assert.is(inputs[0].id(), "6bf76f4380da8a389ae0a7ecccf1922b74ae11d773ba8b1b761d84a1b4474a4f");
		assert.is(inputs[0].amount().toString(), "30000000");
		assert.is(
			inputs[0].address(),
			"addr_test1qrhvwtn8sa3duzkm93v5kjjxlv5lvg67j530wyeumngu23lk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33s4s8xvh",
		);
	});

	it("should have outputs", () => {
		const outputs = subject.outputs();
		assert.length(outputs, 2);
		assert.instance(outputs[0], DTO.UnspentTransactionData);
		assert.is(outputs[0].amount().toString(), "25000000");
		assert.is(
			outputs[0].address(),
			"addr_test1qzct2hsralem3fqn8fupu90v3jkelpg4rfp4zqx06zgevpachk6az8jcydma5a6vgsuw5c37v0c8j6rlclpqajn2vxsq3rz4th",
		);
		assert.instance(outputs[1], DTO.UnspentTransactionData);
		assert.is(outputs[1].amount().toString(), "4831199");
		assert.is(
			outputs[1].address(),
			"addr_test1qzfjfm724nv9qz6nfyagmj0j2uppr35gzv5qee8s7489wxlk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33scc4thv",
		);
	});

	it("should have an amount", () => {
		assert.is(subject.amount().toString(), "25000000");
	});

	it("should have a fee", () => {
		assert.is(subject.fee().toString(), "168801");
	});

	it("should have the asset", () => {
		assert.equal(subject.asset(), {});
	});

	it("should have a method to know if transaction is confirmed", () => {
		assert.false(subject.isConfirmed());
	});

	it("should have a method to know if transaction is sent", () => {
		assert.false(subject.isSent());
	});

	it("should have a method to know if transaction is received", () => {
		assert.false(subject.isReceived());
	});

	it("should have a method to know if transaction is transfer", () => {
		assert.true(subject.isTransfer());
	});

	it("should have a method to know if transaction is second signature", () => {
		assert.false(subject.isSecondSignature());
	});

	it("should have a method to know if transaction is delegate registration", () => {
		assert.false(subject.isDelegateRegistration());
	});

	it("should have a method to know if transaction is vote combination", () => {
		assert.false(subject.isVoteCombination());
	});

	it("should have a method to know if transaction is vote", () => {
		assert.false(subject.isVote());
	});

	it("should have a method to know if transaction is unvote", () => {
		assert.false(subject.isUnvote());
	});

	it("should have a method to know if transaction is multisignature registration", () => {
		assert.false(subject.isMultiSignatureRegistration());
	});

	it("should have a method to know if transaction is ipfs", () => {
		assert.false(subject.isIpfs());
	});

	it("should have a method to know if transaction is multipayment", () => {
		assert.false(subject.isMultiPayment());
	});

	it("should have a method to know if transaction is delegate resignation", () => {
		assert.false(subject.isDelegateResignation());
	});

	it("should have a method to know if transaction is htlc lock", () => {
		assert.false(subject.isHtlcLock());
	});

	it("should have a method to know if transaction is htlc claim", () => {
		assert.false(subject.isHtlcClaim());
	});

	it("should have a method to know if transaction is htlc refund", () => {
		assert.false(subject.isHtlcRefund());
	});

	it("should have a method to know if transaction is magistrate", () => {
		assert.false(subject.isMagistrate());
	});
});
