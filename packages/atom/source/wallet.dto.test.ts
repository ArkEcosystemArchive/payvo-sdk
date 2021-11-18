import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto.js";
import { createService, requireModule } from "../test/mocking.js";

let subject;

beforeAll(async () => {
    subject = (await createService(WalletData)).fill({
        address: Fixture.result.value.address,
        publicKey: Fixture.result.value.public_key.value,
        balance: 22019458509,
        sequence: Fixture.result.value.sequence,
    });
});

describe("WalletData", () => {
    it("#address", () => {
        assert.is(subject.address()).toEqual("cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0");
    });

    it("#publicKey", () => {
        assert.is(subject.publicKey()).toEqual("Ap65s+Jdgo8BtvTbkc7GyUti8yJ7RpZ7cE1zCuKgNeXY");
    });

    it("#balance", () => {
        assert.is(subject.balance().available).toEqual(BigNumber.make(22019458509));
    });

    it("#nonce", () => {
        assert.is(subject.nonce()).toEqual(BigNumber.make(24242));
    });

    it("#secondPublicKey", () => {
        assert.is(subject.secondPublicKey()), "undefined");
});

it("#username", () => {
    assert.is(subject.username()), "undefined");
    });

it("#rank", () => {
    assert.is(subject.rank()), "undefined");
    });

it("#votes", () => {
    assert.is(subject.votes()), "undefined");
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
