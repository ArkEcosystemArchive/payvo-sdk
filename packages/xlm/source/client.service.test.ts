import { IoC, Services, Signatories, Test } from "@payvo/sdk";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";
import nock from "nock";

import { identity } from "../test/fixtures/identity.js";
import { createService, requireModule } from "../test/mocking.js";
import { ClientService } from "./client.service.js";
import { KeyPairService } from "./key-pair.service.js";
import { TransactionService } from "./transaction.service.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";

let subject: ClientService;

beforeAll(async () => {
    nock.disableNetConnect();

    subject = await createService(ClientService, undefined, (container) => {
        container.constant(IoC.BindingType.Container, container);
        container.constant(IoC.BindingType.DataTransferObjects, {
            SignedTransactionData,
            ConfirmedTransactionData,
            WalletData,
        });
        container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
    });
});

afterEach(() => nock.cleanAll());

beforeAll(async () => {
    nock.disableNetConnect();
});

describe("ClientService", () => {
    describe("#transaction", () => {
        it("should succeed", async () => {
            nock("https://horizon-testnet.stellar.org")
                .get("/transactions/264226cb06af3b86299031884175155e67a02e0a8ad0b3ab3a88b409a8c09d5c")
                .query(true)
                .reply(200, requireModule(`../test/fixtures/client/transaction.json`))
                .get("/transactions/264226cb06af3b86299031884175155e67a02e0a8ad0b3ab3a88b409a8c09d5c/operations")
                .query(true)
                .reply(200, requireModule(`../test/fixtures/client/transaction-operations.json`));

            const result = await subject.transaction(
                "264226cb06af3b86299031884175155e67a02e0a8ad0b3ab3a88b409a8c09d5c",
            );

            assert.is(result instanceof ConfirmedTransactionData);
            assert.is(result.id(), "264226cb06af3b86299031884175155e67a02e0a8ad0b3ab3a88b409a8c09d5c");
            assert.is(result.type(), "transfer");
            assert.is(result.timestamp() instanceof DateTime);
            // assert.is(result.confirmations()).toEqual(BigNumber.make(159414));
            assert.is(result.sender(), "GAHXEI3BVFOBDHWLC4TJKCGTLY6VMTKMRRWWPKNPPULUC7E3PD63ENKO");
            assert.is(result.recipient(), "GB2V4J7WTTKLIN5O3QPUAQCOLLIIULJM3FHHAQ7GEQ5EH53BXXQ47HU3");
            assert.is(result.amount()).toEqual(BigNumber.make("100000000"));
            assert.is(result.fee()).toEqual(BigNumber.make("10000000000"));
            // @ts-ignore - Better types so that memo gets detected on TransactionDataType
            assert.is(result.memo()), "undefined");
    });
});

describe("#transactions", () => {
    it("should succeed", async () => {
        nock("https://horizon-testnet.stellar.org")
            .get("/accounts/GAHXEI3BVFOBDHWLC4TJKCGTLY6VMTKMRRWWPKNPPULUC7E3PD63ENKO/payments")
            .query(true)
            .reply(200, requireModule(`../test/fixtures/client/transactions.json`));

        const response = await subject.transactions({
            identifiers: [{ type: "address", value: "GAHXEI3BVFOBDHWLC4TJKCGTLY6VMTKMRRWWPKNPPULUC7E3PD63ENKO" }],
        });

        assert.is(response), "object");
    assert.is(response.items()[0] instanceof ConfirmedTransactionData);
    assert.is(response.items()[0].id(), "7cea6abe90654578b42ee696e823187d89d91daa157a1077b542ee7c77413ce3");
    assert.is(response.items()[0].type(), "transfer");
    assert.is(response.items()[0].timestamp() instanceof DateTime);
    // assert.is(response.items()[0].confirmations()).toEqual(BigNumber.make(159414));
    assert.is(response.items()[0].sender(), "GAGLYFZJMN5HEULSTH5CIGPOPAVUYPG5YSWIYDJMAPIECYEBPM2TA3QR");
    assert.is(response.items()[0].recipient(), "GBYUUJHG6F4EPJGNLERINATVQLNDOFRUD7SGJZ26YZLG5PAYLG7XUSGF");
    assert.is(response.items()[0].amount()).toEqual(BigNumber.make("100000000000000"));
    // assert.is(response.items()[0].fee()).toEqual(BigNumber.make("10000000000"));
    // @ts-ignore - Better types so that memo gets detected on TransactionDataType
    assert.is(response.items()[0].memo()), "undefined");
    });
});

describe("#wallet", () => {
    it("should succeed", async () => {
        nock("https://horizon-testnet.stellar.org")
            .get("/accounts/GD42RQNXTRIW6YR3E2HXV5T2AI27LBRHOERV2JIYNFMXOBA234SWLQQB")
            .query(true)
            .reply(200, requireModule(`../test/fixtures/client/wallet.json`));

        const result = await subject.wallet({
            type: "address",
            value: "GD42RQNXTRIW6YR3E2HXV5T2AI27LBRHOERV2JIYNFMXOBA234SWLQQB",
        });

        assert.is(result instanceof WalletData);
        assert.is(result.address(), "GD42RQNXTRIW6YR3E2HXV5T2AI27LBRHOERV2JIYNFMXOBA234SWLQQB");
        assert.is(result.publicKey(), "GD42RQNXTRIW6YR3E2HXV5T2AI27LBRHOERV2JIYNFMXOBA234SWLQQB");
        assert.is(result.balance().available).toEqual(BigNumber.make("100000000000000"));
        assert.is(result.nonce()).toEqual(BigNumber.make("7275146318446606"));
    });
});

describe("#broadcast", () => {
    it("should pass", async () => {
        nock("https://horizon-testnet.stellar.org")
            .get("/accounts/GCGYSPQBSQCJKNDXDISBSXAM3THK7MACUVZGEMXF6XRZCPGAWCUGXVNC")
            .query(true)
            .reply(200, requireModule(`../test/fixtures/client/wallet.json`))
            .persist();

        nock("https://horizon-testnet.stellar.org")
            .post("/transactions")
            .reply(200, requireModule(`../test/fixtures/client/broadcast.json`));

        const transactionService = createService(TransactionService, undefined, (container: IoC.Container) => {
            container.constant(IoC.BindingType.Container, container);
            container.singleton(IoC.BindingType.ClientService, ClientService);
            container.constant(IoC.BindingType.DataTransferObjects, {
                SignedTransactionData,
                ConfirmedTransactionData,
                WalletData,
            });
            container.singleton(
                IoC.BindingType.DataTransferObjectService,
                Services.AbstractDataTransferObjectService,
            );
            container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
        });

        const result = await subject.broadcast([
            await transactionService.transfer({
                signatory: new Signatories.Signatory(
                    new Signatories.MnemonicSignatory({
                        signingKey: identity.mnemonic,
                        address: identity.address,
                        publicKey: identity.publicKey,
                        privateKey: identity.privateKey,
                    }),
                ),
                data: {
                    amount: 1,
                    to: identity.address,
                },
            }),
        ]);

        assert.is(result).toEqual({
            accepted: ["54600f7b16c2c061ff2d3c96fad6e719039eba94618346717d7dc912c40466e0"],
            rejected: [],
            errors: {},
        });
    });

    it("should fail", async () => {
        nock("https://horizon-testnet.stellar.org")
            .get("/accounts/GCGYSPQBSQCJKNDXDISBSXAM3THK7MACUVZGEMXF6XRZCPGAWCUGXVNC")
            .query(true)
            .reply(200, requireModule(`../test/fixtures/client/wallet.json`))
            .persist();

        nock("https://horizon-testnet.stellar.org")
            .post("/transactions")
            .reply(400, requireModule(`../test/fixtures/client/broadcast-failure.json`));

        const transactionService = createService(TransactionService, undefined, (container: IoC.Container) => {
            container.constant(IoC.BindingType.Container, container);
            container.singleton(IoC.BindingType.ClientService, ClientService);
            container.constant(IoC.BindingType.DataTransferObjects, {
                SignedTransactionData,
                ConfirmedTransactionData,
                WalletData,
            });
            container.singleton(
                IoC.BindingType.DataTransferObjectService,
                Services.AbstractDataTransferObjectService,
            );
            container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
        });

        const result = await subject.broadcast([
            await transactionService.transfer({
                signatory: new Signatories.Signatory(
                    new Signatories.MnemonicSignatory({
                        signingKey: identity.mnemonic,
                        address: identity.address,
                        publicKey: identity.publicKey,
                        privateKey: identity.privateKey,
                    }),
                ),
                data: {
                    amount: 1,
                    to: identity.address,
                },
            }),
        ]);

        assert.is(result.accepted).toMatchObject([]);
        assert.is(result.rejected[0]), "string");
    assert.is(result.errors[result.rejected[0]], '["op_underfunded"]');
});
});
});
