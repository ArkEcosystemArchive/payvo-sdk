/* eslint-disable */

import "reflect-metadata";

import { describe } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import { AbstractWalletData } from "./wallet.dto";

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

describe("AbstractWalletData", ({ assert, it }) => {
	it("#address", () => {
		assert.is(new Wallet({ key: "value" }).address(), "address");
	});

	it("#publicKey", () => {
		assert.is(new Wallet({ key: "value" }).publicKey(), "publicKey");
	});

	it("#balance", () => {
		assert.object(new Wallet({ key: "value" }).balance());
	});

	it("#nonce", () => {
		assert.equal(new Wallet({ key: "value" }).nonce(), BigNumber.ZERO);
	});

	it("#secondPublicKey", () => {
		assert.is(new Wallet({ key: "value" }).secondPublicKey(), "secondPublicKey");
	});

	it("#username", () => {
		assert.is(new Wallet({ key: "value" }).username(), "username");
	});

	it("#rank", () => {
		assert.is(new Wallet({ key: "value" }).rank(), 5);
	});

	it("#votes", () => {
		assert.equal(new Wallet({ key: "value" }).votes(), BigNumber.ZERO);
	});

	it("#isDelegate", () => {
		assert.false(new Wallet({ key: "value" }).isDelegate());
	});

	it("#isMultiSignature", () => {
		assert.false(new Wallet({ key: "value" }).isMultiSignature());
	});

	it("#isSecondSignature", () => {
		assert.false(new Wallet({ key: "value" }).isSecondSignature());
	});

	it("#toObject", () => {
		assert.object(new Wallet({ key: "value" }).toObject());
	});

	it("#raw", () => {
		assert.equal(new Wallet({ key: "value" }).raw(), {
			key: "value",
		});
	});

	it("#hasPassed", () => {
		assert.is(new Wallet({ key: "value" }).hasPassed(), true);
		assert.is(new Wallet({}).hasPassed(), false);
	});

	it("#hasFailed", () => {
		assert.is(new Wallet({}).hasFailed(), true);
		assert.is(new Wallet({ key: "value" }).hasFailed(), false);
	});
});
