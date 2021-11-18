import { BigNumber } from "@payvo/sdk-helpers";

import { WalletData } from "./wallet.dto";
import { createService, requireModule } from "../test/mocking";

let subject: WalletData;

test.before.each(
    async () =>
    (subject = (await createService(WalletData)).fill({
        address: "0x4581a610f96878266008993475f1476ca9997081",
        balance: 10,
        nonce: 0,
    })),
);

describe("WalletData", () => {
    test("#address", () => {
        assert.is(subject.address(), "0x4581a610f96878266008993475f1476ca9997081");
    });

    test("#publicKey", () => {
        assert.is(subject.publicKey()), "undefined");
});

test("#balance", () => {
    assert.is(subject.balance().available, BigNumber.make("10"));
});

test("#nonce", () => {
    assert.is(subject.nonce(), BigNumber.ZERO);
});

test("#secondPublicKey", () => {
    assert.is(() => subject.secondPublicKey()).toThrow(/not implemented/);
});

test("#username", () => {
    assert.is(() => subject.username()).toThrow(/not implemented/);
});

test("#rank", () => {
    assert.is(() => subject.rank()).toThrow(/not implemented/);
});

test("#votes", () => {
    assert.is(() => subject.votes()).toThrow(/not implemented/);
});

test("#multiSignature", () => {
    assert.is(() => subject.multiSignature()).toThrow(/not implemented/);
});

test("#isMultiSignature", () => {
    assert.is(subject.isMultiSignature(), false);
});

test("#isDelegate", () => {
    assert.is(subject.isDelegate(), false);
});

test("#isSecondSignature", () => {
    assert.is(subject.isSecondSignature(), false);
});

test("#isResignedDelegate", () => {
    assert.is(subject.isResignedDelegate(), false);
});
});
