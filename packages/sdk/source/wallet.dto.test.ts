/* eslint-disable */

import { describe } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import { AbstractWalletData } from "./wallet.dto.js";

class Wallet extends AbstractWalletData {
	primaryKey() {
		return "address.js";
	}

	address() {
		return "address.js";
	}

	publicKey() {
		return "publicKey";
	}

	balance() {
		return {
			total: BigNumber.ZERO,
			available: BigNumber.ZERO,
			fees: BigNumber.ZERO,
		};
	}

	nonce() {
		return BigNumber.ZERO;
	}

	secondPublicKey() {
		return "secondPublicKey";
	}

	username() {
		return "username";
	}

	rank() {
		return 5;
	}

	votes() {
		return BigNumber.ZERO;
	}

	isDelegate() {
		return false;
	}

	isResignedDelegate() {
		return false;
	}

	isMultiSignature() {
		return false;
	}

	isSecondSignature() {
		return false;
	}
}

describe("AbstractWalletData", ({ assert, beforeEach, it }) => {
	beforeEach((context) => {
		// @ts-ignore - we don't need any bindings in this test
		context.subject = new Wallet({ get() {} });
	});

	it("#address", (context) => {
		assert.is(context.subject.fill({ key: "value" }).address(), "address");
	});

	it("#publicKey", (context) => {
		assert.is(context.subject.fill({ key: "value" }).publicKey(), "publicKey");
	});

	it("#balance", (context) => {
		assert.object(context.subject.fill({ key: "value" }).balance());
	});

	it("#nonce", (context) => {
		assert.equal(context.subject.fill({ key: "value" }).nonce(), BigNumber.ZERO);
	});

	it("#secondPublicKey", (context) => {
		assert.is(context.subject.fill({ key: "value" }).secondPublicKey(), "secondPublicKey");
	});

	it("#username", (context) => {
		assert.is(context.subject.fill({ key: "value" }).username(), "username");
	});

	it("#rank", (context) => {
		assert.is(context.subject.fill({ key: "value" }).rank(), 5);
	});

	it("#votes", (context) => {
		assert.equal(context.subject.fill({ key: "value" }).votes(), BigNumber.ZERO);
	});

	it("#isDelegate", (context) => {
		assert.false(context.subject.fill({ key: "value" }).isDelegate());
	});

	it("#isMultiSignature", (context) => {
		assert.false(context.subject.fill({ key: "value" }).isMultiSignature());
	});

	it("#isSecondSignature", (context) => {
		assert.false(context.subject.fill({ key: "value" }).isSecondSignature());
	});

	it("#toObject", (context) => {
		assert.object(context.subject.fill({ key: "value" }).toObject());
	});

	it("#raw", (context) => {
		assert.equal(context.subject.fill({ key: "value" }).raw(), {
			key: "value",
		});
	});

	it("#hasPassed", (context) => {
		assert.is(context.subject.fill({ key: "value" }).hasPassed(), true);
		assert.is(context.subject.fill({}).hasPassed(), false);
	});

	it("#hasFailed", (context) => {
		assert.is(context.subject.fill({}).hasFailed(), true);
		assert.is(context.subject.fill({ key: "value" }).hasFailed(), false);
	});
});
