import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto.js";
import { createService, requireModule } from "../test/mocking.js";

let subject;

beforeAll(async () => {
    subject = (await createService(WalletData)).fill(Fixture.data);
});

describe("WalletData", () => {
    it("#address", () => {
        assert.is(subject.address()).toEqual("my48EN4kDnGEpRZMBfiDS65wdfwfgCGZRz");
    });

    it("#publicKey", () => {
        assert.is(subject.publicKey()).toEqual("76a914c05f53de525d80151e209a729cf1c7909c88f88e88ac");
    });

    it("#balance", () => {
        assert.is(subject.balance().available).toEqual(BigNumber.make(3000001));
    });

    it("#nonce", () => {
        assert.is(subject.nonce()).toEqual(BigNumber.make(0));
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
    assert.is(() => subject.multiSignature()).toThrow(/does not have/);
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
