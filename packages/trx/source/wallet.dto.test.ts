import { BigNumber } from "@payvo/sdk-helpers";

import fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto.js";
import { createService, requireModule } from "../test/mocking.js";

let subject;

beforeEach(async () => {
    subject = (await createService(WalletData)).fill(fixture.data[0]);
});

describe("WalletData", () => {
    it("#address", () => {
        assert.is(subject.address()).toEqual(fixture.data[0].address);
    });

    it("#publicKey", () => {
        assert.is(subject.publicKey()), "undefined");
});

it("#balance", () => {
    assert.is(subject.balance().available).toEqual(BigNumber.make("17491629"));
});

it("#nonce", () => {
    assert.is(subject.nonce()).toEqual(BigNumber.make(24242));
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
