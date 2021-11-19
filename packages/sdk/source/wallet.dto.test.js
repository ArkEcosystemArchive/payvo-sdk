/* eslint-disable */

import "reflect-metadata";

import { assert, test } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import { AbstractWalletData } from "./wallet.dto";

test("#address", () => {
	assert.is(new Wallet({ key: "value" }).address(), "address");
});

test("#publicKey", () => {
	assert.is(new Wallet({ key: "value" }).publicKey(), "publicKey");
});

test("#balance", () => {
	assert.object(new Wallet({ key: "value" }).balance());
});

test("#nonce", () => {
	assert.equal(new Wallet({ key: "value" }).nonce(), BigNumber.ZERO);
});

test("#secondPublicKey", () => {
	assert.is(new Wallet({ key: "value" }).secondPublicKey(), "secondPublicKey");
});

test("#username", () => {
	assert.is(new Wallet({ key: "value" }).username(), "username");
});

test("#rank", () => {
	assert.is(new Wallet({ key: "value" }).rank(), 5);
});

test("#votes", () => {
	assert.equal(new Wallet({ key: "value" }).votes(), BigNumber.ZERO);
});

test("#isDelegate", () => {
	assert.false(new Wallet({ key: "value" }).isDelegate());
});

test("#isMultiSignature", () => {
	assert.false(new Wallet({ key: "value" }).isMultiSignature());
});

test("#isSecondSignature", () => {
	assert.false(new Wallet({ key: "value" }).isSecondSignature());
});

test("#toObject", () => {
	assert.object(new Wallet({ key: "value" }).toObject());
});

test("#raw", () => {
	assert.equal(new Wallet({ key: "value" }).raw(), {
		key: "value",
	});
});

test("#hasPassed", () => {
	assert.is(new Wallet({ key: "value" }).hasPassed(), true);
	assert.is(new Wallet({}).hasPassed(), false);
});

test("#hasFailed", () => {
	assert.is(new Wallet({}).hasFailed(), true);
	assert.is(new Wallet({ key: "value" }).hasFailed(), false);
});

class Wallet extends AbstractWalletData {
	primaryKey() {
		return "address";
	}

	address() {
		return "address";
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

test.run();
