import { describe } from "@payvo/sdk-test";
import { DTO } from "@payvo/sdk";

import Fixture from "../test/fixtures/client/transaction.json";
import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";

describe("ConfirmedTransactionData", async ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(ConfirmedTransactionData);
		context.subject.configure(Fixture.data.transactions[0]);
	});

	it("should have an id", (context) => {
		assert.is(context.subject.id(), "35b40547f04963d3b41478fc27038948d74718802c486d9125f1884d8c83a31d");
	});

	it("should have a blockId", (context) => {
		assert.undefined(context.subject.blockId());
	});

	it("should have a timestamp", (context) => {
		assert.is(context.subject.timestamp().toISOString(), "2021-02-05T15:04:16.000Z");
	});

	it("should have confirmations", (context) => {
		assert.is(context.subject.confirmations().toString(), "0");
	});

	it("should have a sender", (context) => {
		assert.is(
			context.subject.sender(),
			"addr_test1qrhvwtn8sa3duzkm93v5kjjxlv5lvg67j530wyeumngu23lk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33s4s8xvh",
		);
	});

	it("should have a recipient", (context) => {
		assert.is(
			context.subject.recipient(),
			"addr_test1qzct2hsralem3fqn8fupu90v3jkelpg4rfp4zqx06zgevpachk6az8jcydma5a6vgsuw5c37v0c8j6rlclpqajn2vxsq3rz4th",
		);
	});

	it("should have recipients", (context) => {
		const actual = context.subject.recipients();
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

	it("should have inputs", (context) => {
		const inputs = context.subject.inputs();
		assert.length(inputs, 1);
		assert.instance(inputs[0], DTO.UnspentTransactionData);
		assert.is(inputs[0].id(), "6bf76f4380da8a389ae0a7ecccf1922b74ae11d773ba8b1b761d84a1b4474a4f");
		assert.is(inputs[0].amount().toString(), "30000000");
		assert.is(
			inputs[0].address(),
			"addr_test1qrhvwtn8sa3duzkm93v5kjjxlv5lvg67j530wyeumngu23lk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33s4s8xvh",
		);
	});

	it("should have outputs", (context) => {
		const outputs = context.subject.outputs();
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

	it("should have an amount", (context) => {
		assert.is(context.subject.amount().toString(), "25000000");
	});

	it("should have a fee", (context) => {
		assert.is(context.subject.fee().toString(), "168801");
	});

	it("should have the asset", (context) => {
		assert.equal(context.subject.asset(), {});
	});

	it("should have a method to know if transaction is confirmed", (context) => {
		assert.false(context.subject.isConfirmed());
	});

	it("should have a method to know if transaction is sent", (context) => {
		assert.false(context.subject.isSent());
	});

	it("should have a method to know if transaction is received", (context) => {
		assert.false(context.subject.isReceived());
	});

	it("should have a method to know if transaction is transfer", (context) => {
		assert.true(context.subject.isTransfer());
	});

	it("should have a method to know if transaction is second signature", (context) => {
		assert.false(context.subject.isSecondSignature());
	});

	it("should have a method to know if transaction is delegate registration", (context) => {
		assert.false(context.subject.isDelegateRegistration());
	});

	it("should have a method to know if transaction is vote combination", (context) => {
		assert.false(context.subject.isVoteCombination());
	});

	it("should have a method to know if transaction is vote", (context) => {
		assert.false(context.subject.isVote());
	});

	it("should have a method to know if transaction is unvote", (context) => {
		assert.false(context.subject.isUnvote());
	});

	it("should have a method to know if transaction is multisignature registration", (context) => {
		assert.false(context.subject.isMultiSignatureRegistration());
	});

	it("should have a method to know if transaction is ipfs", (context) => {
		assert.false(context.subject.isIpfs());
	});

	it("should have a method to know if transaction is multipayment", (context) => {
		assert.false(context.subject.isMultiPayment());
	});

	it("should have a method to know if transaction is delegate resignation", (context) => {
		assert.false(context.subject.isDelegateResignation());
	});

	it("should have a method to know if transaction is htlc lock", (context) => {
		assert.false(context.subject.isHtlcLock());
	});

	it("should have a method to know if transaction is htlc claim", (context) => {
		assert.false(context.subject.isHtlcClaim());
	});

	it("should have a method to know if transaction is htlc refund", (context) => {
		assert.false(context.subject.isHtlcRefund());
	});

	it("should have a method to know if transaction is magistrate", (context) => {
		assert.false(context.subject.isMagistrate());
	});
});
