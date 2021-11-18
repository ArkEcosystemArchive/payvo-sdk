/* eslint-disable */

import "reflect-metadata";

import { BigNumber } from "@payvo/sdk-helpers";

import { WalletBalance } from "../contracts";
import { AbstractWalletData } from "./wallet";

test("#address", () => {
    assert.is(new Wallet({ key: "value" }).address(), "address");
});

test("#publicKey", () => {
    assert.is(new Wallet({ key: "value" }).publicKey(), "publicKey");
});

test("#balance", () => {
    assert.is(new Wallet({ key: "value" }).balance(), "object");
});

test("#nonce", () => {
    assert.is(new Wallet({ key: "value" }).nonce(), BigNumber.ZERO);
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
    assert.is(new Wallet({ key: "value" }).votes(), BigNumber.ZERO);
});

test("#isDelegate", () => {
    assert.is(new Wallet({ key: "value" }).isDelegate(), false);
});

test("#isMultiSignature", () => {
    assert.is(new Wallet({ key: "value" }).isMultiSignature(), false);
});

test("#isSecondSignature", () => {
    assert.is(new Wallet({ key: "value" }).isSecondSignature(), false);
});

test("#toObject", () => {
    assert.is(new Wallet({ key: "value" }).toObject()).toMatchInlineSnapshot(`
		Object {
		  "address": "address",
		  "balance": Object {
		    "available": BigNumber {},
		    "fees": BigNumber {},
		    "total": BigNumber {},
		  },
		  "isDelegate": false,
		  "isMultiSignature": false,
		  "isResignedDelegate": false,
		  "isSecondSignature": false,
		  "nonce": BigNumber {},
		  "publicKey": "publicKey",
		  "rank": 5,
		  "username": "username",
		  "votes": BigNumber {},
		}
	`);
});

test("#raw", () => {
    assert.is(new Wallet({ key: "value" }).raw()).toMatchInlineSnapshot(`
		Object {
		  "key": "value",
		}
	`);
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
    // @ts-ignore
    public primaryKey(): string {
        return "address";
    }

    // @ts-ignore
    public address(): string {
        return "address";
    }

    // @ts-ignore
    public publicKey(): string | undefined {
        return "publicKey";
    }

    // @ts-ignore
    public balance(): WalletBalance {
        return {
            total: BigNumber.ZERO,
            available: BigNumber.ZERO,
            fees: BigNumber.ZERO,
        };
    }

    // @ts-ignore
    public nonce(): BigNumber {
        return BigNumber.ZERO;
    }

    // @ts-ignore
    public secondPublicKey(): string | undefined {
        return "secondPublicKey";
    }

    // @ts-ignore
    public username(): string | undefined {
        return "username";
    }

    // @ts-ignore
    public rank(): number | undefined {
        return 5;
    }

    // @ts-ignore
    public votes(): BigNumber | undefined {
        return BigNumber.ZERO;
    }

    // @ts-ignore
    public isDelegate(): boolean {
        return false;
    }

    // @ts-ignore
    public isResignedDelegate(): boolean {
        return false;
    }

    // @ts-ignore
    public isMultiSignature(): boolean {
        return false;
    }

    // @ts-ignore
    public isSecondSignature(): boolean {
        return false;
    }
}
