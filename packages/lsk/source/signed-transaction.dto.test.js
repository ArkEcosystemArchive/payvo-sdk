import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";

let subject;

describe("SignedTransactionData", () => {
    const transaction = {
        moduleID: 2,
        assetID: 0,
        senderPublicKey: "5e93fd5cfe306ea2c34d7082a6c79692cf2f5c6e07aa6f9b4a11b4917d33f16b",
        nonce: "3",
        fee: "207000",
        signatures: [
            "64e1c880e844f970e46ebdcc7c9c89a80bf8618de82706f3873ee91fa666657de610a8899f1370664721cdcb08eb5ac1e12aa6e1611b85a12050711aca478604",
            "284cbea6e9a5c639981c50c97e09ea882a1cd63e2da30a99fdb961d6b4f7a3cecebf97161a8b8e22d02506fa78b119358faea83b19580e0a23d283d6e7868702",
        ],
        asset: { recipientAddress: "lsk72fxrb264kvw6zuojntmzzsqds35sqvfzz76d7", amount: "100000000", data: "" },
        id: "3279be353158ae19d47191605c82b6e112980c888e98e75d6185c858359428e4",
    };

    test.before.each(async () => {
        subject = await createService(SignedTransactionData);
        subject.configure(transaction.id, transaction, transaction);
    });

    test("#id", () => {
        assert.is(subject.id(), transaction.id);
    });

    test("#sender", () => {
        assert.is(subject.sender(), transaction.asset.recipientAddress);
    });

    describe("#recipient", () => {
        test("returns the recipient address", () => {
            assert.is(subject.recipient(), transaction.asset.recipientAddress);
        });

        test("returns the recipient address when it's buffer", async () => {
            subject = await createService(SignedTransactionData).configure(
                transaction.id,
                {
                    ...transaction,
                    asset: {
                        recipientAddress: Buffer.from([
                            118, 60, 25, 27, 10, 77, 5, 117, 2, 12, 225, 230, 80, 3, 117, 214, 208, 189, 212, 94,
                        ]),
                    },
                },
                transaction,
            );

            assert.is(subject.recipient(), "lsk72fxrb264kvw6zuojntmzzsqds35sqvfzz76d7");
        });
    });

    describe("#amount", () => {
        test("returns transaction amount", () => {
            assert.is(subject.amount() instanceof BigNumber);
            assert.is(subject.amount().toString(), "100000000"`);
        });

        test("returns sum of unlock objects amounts if type is unlockToken", async () => {
            subject = await createService(SignedTransactionData).configure(
                transaction.id,
                {
                    ...transaction,
                    moduleID: 5,
                    assetID: 2,
                    asset: {
                        unlockObjects: [
                            {
                                delegateAddress: "lskc579agejjw3fo9nvgg85r8vo6sa5xojtw9qscj",
                                amount: "2000000000",
                                unvoteHeight: 14548930,
                            },
                            {
                                delegateAddress: "8c955e70d0da3e0424abc4c0683280232f41c48b",
                                amount: "3000000000",
                                unvoteHeight: 14548929,
                            },
                        ],
                    },
                },
                transaction,
            );

            assert.is(subject.amount() instanceof BigNumber);
            assert.is(subject.amount().toString(), "5000000000"`);
        });
    });

    test("#fee", () => {
        assert.is(subject.fee() instanceof BigNumber);
        assert.is(subject.fee().toString(), "207000"`);
    });

    test("#timestamp", () => {
        assert.is(subject.timestamp() instanceof DateTime);
        assert.is(subject.timestamp().toString(), "Invalid Date"`);
    });

    test("#isTransfer", async () => {
        assert.is(subject.isTransfer(), true);

        subject = await createService(SignedTransactionData).configure(
            transaction.id,
            {
                ...transaction,
                moduleID: 0,
                assetID: 0,
            },
            transaction,
        );

        assert.is(subject.isTransfer(), false);
    });

    test("#isSecondSignature", () => {
        assert.is(subject.isSecondSignature(), false);
    });

    test("#isDelegateRegistration", async () => {
        assert.is(subject.isDelegateRegistration(), false);

        subject = await createService(SignedTransactionData).configure(
            transaction.id,
            {
                ...transaction,
                moduleID: 5,
                assetID: 0,
                asset: {
                    username: "a",
                },
            },
            transaction,
        );

        assert.is(subject.isDelegateRegistration(), true);
    });

    test("#isVoteCombination", async () => {
        assert.is(subject.isVoteCombination(), false);

        subject = await createService(SignedTransactionData).configure(
            transaction.id,
            {
                ...transaction,
                moduleID: 5,
                assetID: 1,
                asset: {
                    votes: [{ amount: 1 }, { amount: -1 }],
                },
            },
            transaction,
        );

        assert.is(subject.isVoteCombination(), true);
    });

    test("#isVote", async () => {
        assert.is(subject.isVote(), false);

        subject = await createService(SignedTransactionData).configure(
            transaction.id,
            {
                ...transaction,
                moduleID: 5,
                assetID: 1,
                asset: {
                    votes: [{ amount: 1 }],
                },
            },
            transaction,
        );

        assert.is(subject.isVote(), true);
    });

    test("#isUnvote", async () => {
        assert.is(subject.isUnvote(), false);

        subject = await createService(SignedTransactionData).configure(
            transaction.id,
            {
                ...transaction,
                moduleID: 5,
                assetID: 1,
                asset: {
                    votes: [{ amount: -1 }],
                },
            },
            transaction,
        );

        assert.is(subject.isUnvote(), true);
    });

    test("#isUnlockToken", async () => {
        assert.is(subject.isUnlockToken(), false);

        subject = await createService(SignedTransactionData).configure(
            transaction.id,
            {
                ...transaction,
                moduleID: 5,
                assetID: 2,
            },
            transaction,
        );

        assert.is(subject.isUnlockToken(), true);
    });

    test("#isMultiSignatureRegistration", async () => {
        assert.is(subject.isMultiSignatureRegistration(), false);

        subject = await createService(SignedTransactionData).configure(
            transaction.id,
            {
                ...transaction,
                moduleID: 4,
                assetID: 0,
            },
            transaction,
        );

        assert.is(subject.isMultiSignatureRegistration(), true);
    });

    test("#usesMultiSignature", async () => {
        assert.is(subject.usesMultiSignature(), true);

        subject = await createService(SignedTransactionData).configure(
            transaction.id,
            {
                ...transaction,
                signatures: undefined,
            },
            transaction,
        );

        assert.is(subject.usesMultiSignature(), false);
    });

    test("#username", async () => {
        assert.is(subject.username()), "undefined");

    subject = await createService(SignedTransactionData).configure(
        transaction.id,
        {
            ...transaction,
            moduleID: 5,
            assetID: 0,
            asset: {
                username: "a",
            },
        },
        transaction,
    );

    assert.is(subject.username(), "a");
});
});
