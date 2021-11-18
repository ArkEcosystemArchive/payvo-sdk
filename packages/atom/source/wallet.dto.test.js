import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto";
import { createService, requireModule } from "../test/mocking";

let subject;

test.before(async () => {
    subject = (await createService(WalletData)).fill({
        address: Fixture.result.value.address,
        publicKey: Fixture.result.value.public_key.value,
        balance: 22019458509,
        sequence: Fixture.result.value.sequence,
    });
});

describe("WalletData", () => {
    test("#address", () => {
        assert.is(subject.address(), "cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0");
    });

    test("#publicKey", () => {
        assert.is(subject.publicKey(), "Ap65s+Jdgo8BtvTbkc7GyUti8yJ7RpZ7cE1zCuKgNeXY");
    });

    test("#balance", () => {
        assert.is(subject.balance().available, BigNumber.make(22019458509));
    });

    test("#nonce", () => {
        assert.is(subject.nonce(), BigNumber.make(24242));
    });

    test("#secondPublicKey", () => {
        assert.is(subject.secondPublicKey()), "undefined");
});

test("#username", () => {
    assert.is(subject.username()), "undefined");
    });

test("#rank", () => {
    assert.is(subject.rank()), "undefined");
    });

test("#votes", () => {
    assert.is(subject.votes()), "undefined");
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
