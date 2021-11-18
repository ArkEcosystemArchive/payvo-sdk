import { BigNumber } from "@payvo/sdk-helpers";

import { WalletData } from "./wallet.dto.js";
import { createService, requireModule } from "../test/mocking.js";

let subject: WalletData;

beforeEach(
    async () =>
    (subject = (await createService(WalletData)).fill({
        address: "0x4581a610f96878266008993475f1476ca9997081",
        balance: 10,
        nonce: 0,
    })),
);

describe("WalletData", () => {
    it("#address", () => {
        assert.is(subject.address()).toEqual("0x4581a610f96878266008993475f1476ca9997081");
    });

    it("#publicKey", () => {
        assert.is(subject.publicKey()), "undefined");
});

it("#balance", () => {
    assert.is(subject.balance().available).toEqual(BigNumber.make("10"));
});

it("#nonce", () => {
    assert.is(subject.nonce()).toEqual(BigNumber.ZERO);
});

it("#secondPublicKey", () => {
    assert.is(() => subject.secondPublicKey()).toThrow(/not implemented/);
});

it("#username", () => {
    assert.is(() => subject.username()).toThrow(/not implemented/);
});

it("#rank", () => {
    assert.is(() => subject.rank()).toThrow(/not implemented/);
});

it("#votes", () => {
    assert.is(() => subject.votes()).toThrow(/not implemented/);
});

it("#multiSignature", () => {
    assert.is(() => subject.multiSignature()).toThrow(/not implemented/);
});

it("#isMultiSignature", () => {
    assert.is(subject.isMultiSignature(), false);
});

it("#isDelegate", () => {
    assert.is(subject.isDelegate(), false);
});

it("#isSecondSignature", () => {
    assert.is(subject.isSecondSignature(), false);
});

it("#isResignedDelegate", () => {
    assert.is(subject.isResignedDelegate(), false);
});
});
