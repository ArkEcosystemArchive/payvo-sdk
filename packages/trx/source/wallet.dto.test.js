import { BigNumber } from "@payvo/sdk-helpers";

import fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto";
import { createService, requireModule } from "../test/mocking";

let subject;

test.before.each(async () => {
    subject = (await createService(WalletData)).fill(fixture.data[0]);
});

describe("WalletData", () => {
    test("#address", () => {
        assert.is(subject.address(), loader.data[0].address);
    });

    test("#publicKey", () => {
        assert.is(subject.publicKey()), "undefined");
});

test("#balance", () => {
    assert.is(subject.balance().available, BigNumber.make("17491629"));
});

test("#nonce", () => {
    assert.is(subject.nonce(), BigNumber.make(24242));
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
