import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto";
import { createService, requireModule } from "../test/mocking";

let subject;

test.before(async () => {
    subject = (await createService(WalletData)).fill(Fixture.data);
});

describe("WalletData", () => {
    test("#address", () => {
        assert.is(subject.address(), "my48EN4kDnGEpRZMBfiDS65wdfwfgCGZRz");
    });

    test("#publicKey", () => {
        assert.is(subject.publicKey(), "76a914c05f53de525d80151e209a729cf1c7909c88f88e88ac");
    });

    test("#balance", () => {
        assert.is(subject.balance().available, BigNumber.make(3000001));
    });

    test("#nonce", () => {
        assert.is(subject.nonce(), BigNumber.make(0));
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
    assert.is(() => subject.multiSignature()).toThrow(/does not have/);
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
