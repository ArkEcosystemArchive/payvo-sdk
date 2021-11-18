import { IoC, Services, Signatories, Test } from "@payvo/sdk";
import nock from "nock";

import { createService, requireModule } from "../test/mocking.js";
import { MultiSignatureService } from "./multi-signature.service.js";
import { ClientService } from "./client.service.js";
import { BindingType } from "./coin.contract.js";
import { MultiSignatureSigner } from "./multi-signature.signer.js";
import { KeyPairService } from "./key-pair.service.js";
import { LedgerService } from "./ledger.service.js";
import { PublicKeyService } from "./public-key.service.js";
import { AddressService } from "./address.service.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";

let subject: MultiSignatureService;

beforeAll(async () => {
    nock.disableNetConnect();

    subject = await createService(MultiSignatureService, undefined, (container) => {
        container.constant(IoC.BindingType.Container, container);
        container.singleton(IoC.BindingType.AddressService, AddressService);
        container.singleton(IoC.BindingType.ClientService, ClientService);
        container.constant(IoC.BindingType.DataTransferObjects, {
            SignedTransactionData,
            ConfirmedTransactionData,
            WalletData,
        });
        container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
        container.singleton(BindingType.MultiSignatureSigner, MultiSignatureSigner);
        container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
        container.constant(IoC.BindingType.LedgerTransportFactory, async () => { });
        container.singleton(IoC.BindingType.LedgerService, LedgerService);
        container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
    });
});

test.after.each(() => nock.cleanAll());

describe("MultiSignatureService", () => {
    let fixtures;

    test.before.each(async () => {
        fixtures = requireModule(`../test/fixtures/client/multisig-transactions.json`);
    });

    test("#allWithPendingState", async () => {
        nock(/.+/).post("/").reply(200, fixtures);

        await assert.is(subject.allWithPendingState("DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8")).resolves.toBeArrayOfSize(3);
    });

    test("#allWithReadyState", async () => {
        nock(/.+/).post("/").reply(200, fixtures);

        await assert.is(subject.allWithReadyState("DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8")).resolves.toBeArrayOfSize(3);
    });

    test("#findById", async () => {
        nock(/.+/).post("/").reply(200, { result: fixtures.result[0] });

        await assert.is(subject.findById("DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8")).resolves, "object");
});

test("#broadcast", async () => {
    nock(/.+/)
        .post("/")
        .reply(200, { result: { id: "abc" } })
        .post("/")
        .reply(200, { result: { id: "abc" } });

    await assert.is(subject.broadcast({})).resolves.toEqual({ accepted: ["abc"], errors: {}, rejected: [] });
    await assert.is(subject.broadcast({ asset: { multiSignature: "123" } })).resolves.toEqual({
        accepted: ["abc"],
        errors: {},
        rejected: [],
    });
});

test("#addSignature", async () => {
    const mnemonic = "skin fortune security mom coin hurdle click emotion heart brisk exact reason";
    const signatory = new Signatories.Signatory(
        new Signatories.MnemonicSignatory({
            signingKey: mnemonic,
            address: "address",
            publicKey: "02940c966a0b30653fbd102d40be14666bde4d6da5a736422290684cdcac13d7db",
            privateKey: "privateKey",
            options: {
                bip44: {
                    account: 0,
                },
            },
        }),
    );

    const transactionData = {
        type: 4,
        typeGroup: 1,
        version: 2,
        signatures: [],
        nonce: "1",
        amount: "0",
        fee: "0",
        senderPublicKey: "02940c966a0b30653fbd102d40be14666bde4d6da5a736422290684cdcac13d7db",
        asset: {
            multiSignature: {
                publicKeys: [
                    "02940c966a0b30653fbd102d40be14666bde4d6da5a736422290684cdcac13d7db",
                    "034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192",
                ],
                min: 2,
            },
        },
        multiSignature: {
            publicKeys: [
                "02940c966a0b30653fbd102d40be14666bde4d6da5a736422290684cdcac13d7db",
                "034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192",
            ],
            min: 2,
        },
    };

    assert.is((await subject.addSignature(transactionData, signatory)).data().signatures, [
        "00be3162093f9fc76273ab208cd0cff1dc9560e1faba6f27f9ffce9a3c593671aa8913c071118f446e27de404ceac9c2188edd8ad9f1a2c8033258f65138bca9a4",
    ]);

    assert.is((await subject.addSignature(transactionData, signatory)).data().signatures, [
        "00be3162093f9fc76273ab208cd0cff1dc9560e1faba6f27f9ffce9a3c593671aa8913c071118f446e27de404ceac9c2188edd8ad9f1a2c8033258f65138bca9a4",
    ]);
});

test("#isMultiSignatureRegistrationReady", async () => {
    const transaction = (await createService(SignedTransactionData)).configure("123", { signatures: [] });

    assert.is(subject.isMultiSignatureReady(transaction), true);
});

test("#needsSignatures", async () => {
    const transaction = (await createService(SignedTransactionData)).configure("123", { signatures: [] });

    assert.is(subject.needsSignatures(transaction), false);
});

test("#needsAllSignatures", async () => {
    const transaction = (await createService(SignedTransactionData)).configure("123", {
        signatures: [],
        multiSignature: {
            publicKeys: [
                "0301fd417566397113ba8c55de2f093a572744ed1829b37b56a129058000ef7bce",
                "034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192",
            ],
            min: 2,
        },
    });

    assert.is(subject.needsAllSignatures(transaction), true);
});

test("#needsWalletSignature", async () => {
    const transaction = (await createService(SignedTransactionData)).configure("123", { signatures: [] });

    assert.is(subject.needsWalletSignature(transaction, "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8"), false);
});

test("#needsFinalSignature", async () => {
    const transaction = (await createService(SignedTransactionData)).configure("123", { signatures: [] });

    assert.is(subject.needsFinalSignature(transaction), true);
});

test("#remainingSignatureCount", async () => {
    const transaction = (await createService(SignedTransactionData)).configure("123", {
        signatures: [],
        multiSignature: {
            publicKeys: [
                "0301fd417566397113ba8c55de2f093a572744ed1829b37b56a129058000ef7bce",
                "034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192",
            ],
            min: 2,
        },
    });

    assert.is(subject.remainingSignatureCount(transaction), 2);
});
});
