import { IoC, Services, Test } from "@payvo/sdk";
import nock from "nock";

import { createService, requireModule } from "../test/mocking";
import { ClientService } from "./client.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

let subject: ClientService;

test.before(async () => {
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

test.after.each(() => nock.cleanAll());

describe("ClientService", () => {
    describe("#transaction", () => {
        test("should succeed", async () => {
            nock(/.+/)
                .get("/api/transactions/3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572")
                .reply(200, requireModule(`../test/fixtures/client/transaction.json`));

            const result = await subject.transaction(
                "3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
            );

            assert.is(result instanceof ConfirmedTransactionData);
        });
    });

    describe("#transactions", () => {
        describe("should work with Core 2.0", () => {
            test.before.each(async () => {
                subject = await createService(ClientService, "ark.mainnet", (container) => {
                    container.constant(IoC.BindingType.Container, container);
                    container.constant(IoC.BindingType.DataTransferObjects, {
                        SignedTransactionData,
                        ConfirmedTransactionData,
                        WalletData,
                    });
                    container.singleton(
                        IoC.BindingType.DataTransferObjectService,
                        Services.AbstractDataTransferObjectService,
                    );
                });
            });
            test("single address", async () => {
                nock(/.+/)
                    .get("/api/transactions")
                    .query({ address: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8", page: "0" })
                    .reply(200, requireModule(`../test/fixtures/client/transactions.json`));

                const result = await subject.transactions({
                    identifiers: [{ type: "address", value: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" }],
                    cursor: "0",
                });

                assert.is(result, "object");
            assert.is(result.items()[0] instanceof ConfirmedTransactionData);
        });

        test("multiple addresses", async () => {
            nock(/.+/)
                .get("/api/transactions")
                .query({
                    page: "0",
                    address: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8,DRwgqrfuuaPCy3AE8Sz1AjdrncKfHjePn5",
                })
                .reply(200, requireModule(`../test/fixtures/client/transactions.json`));

            const result = await subject.transactions({
                identifiers: [
                    { type: "address", value: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" },
                    { type: "address", value: "DRwgqrfuuaPCy3AE8Sz1AjdrncKfHjePn5" },
                ],
                cursor: "0",
            });

            assert.is(result, "object");
        assert.is(result.items()[0] instanceof ConfirmedTransactionData);
    });
});

describe("should work with Core 3.0", () => {
    test.before.each(async () => {
        subject = await createService(ClientService, "ark.devnet", (container) => {
            container.constant(IoC.BindingType.Container, container);
            container.constant(IoC.BindingType.DataTransferObjects, {
                SignedTransactionData,
                ConfirmedTransactionData,
                WalletData,
            });
            container.singleton(
                IoC.BindingType.DataTransferObjectService,
                Services.AbstractDataTransferObjectService,
            );
        });
    });

    test("single address", async () => {
        nock(/.+/)
            .get("/api/transactions")
            .query({ address: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" })
            .reply(200, requireModule(`../test/fixtures/client/transactions.json`));

        const result = await subject.transactions({
            identifiers: [{ type: "address", value: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" }],
        });

        assert.is(result, "object");
    assert.is(result.items()[0] instanceof ConfirmedTransactionData);
});

test("multiple addresses", async () => {
    nock(/.+/)
        .get("/api/transactions")
        .query({ address: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8,DRwgqrfuuaPCy3AE8Sz1AjdrncKfHjePn5" })
        .reply(200, requireModule(`../test/fixtures/client/transactions.json`));

    const result = await subject.transactions({
        identifiers: [
            { type: "address", value: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" },
            { type: "address", value: "DRwgqrfuuaPCy3AE8Sz1AjdrncKfHjePn5" },
        ],
    });

    assert.is(result, "object");
assert.is(result.items()[0] instanceof ConfirmedTransactionData);
            });

test("for advanced search", async () => {
    nock(/.+/)
        .get("/api/transactions")
        .query({
            address: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8",
            "asset.type": "4",
            "asset.action": "0",
            type: 0,
            typeGroup: 1,
        })
        .reply(200, requireModule(`../test/fixtures/client/transactions.json`));

    const result = await subject.transactions({
        identifiers: [{ type: "address", value: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" }],
        asset: { type: 4, action: 0 },
        type: "transfer",
    });

    assert.is(result, "object");
assert.is(result.items()[0] instanceof ConfirmedTransactionData);
            });
        });
    });

describe("#wallet", () => {
    test("should succeed", async () => {
        nock(/.+/)
            .get("/api/wallets/DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9")
            .reply(200, requireModule(`../test/fixtures/client/wallet.json`));

        const result = await subject.wallet({
            type: "address",
            value: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
        });

        assert.is(result instanceof WalletData);
    });
});

describe("#wallets", () => {
    test("should work with Core 2.0", async () => {
        subject = await createService(ClientService, "ark.mainnet", (container) => {
            container.constant(IoC.BindingType.Container, container);
            container.constant(IoC.BindingType.DataTransferObjects, {
                SignedTransactionData,
                ConfirmedTransactionData,
                WalletData,
            });
            container.singleton(
                IoC.BindingType.DataTransferObjectService,
                Services.AbstractDataTransferObjectService,
            );
        });

        nock(/.+/)
            .get("/api/wallets")
            .query({ address: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" })
            .reply(200, requireModule(`../test/fixtures/client/wallets.json`));

        const result = await subject.wallets({
            identifiers: [{ type: "address", value: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" }],
        });

        assert.is(result, "object");
    assert.is(result.items()[0] instanceof WalletData);
});

test("should work with Core 3.0", async () => {
    subject = await createService(ClientService, "ark.devnet", (container) => {
        container.constant(IoC.BindingType.Container, container);
        container.constant(IoC.BindingType.DataTransferObjects, {
            SignedTransactionData,
            ConfirmedTransactionData,
            WalletData,
        });
        container.singleton(
            IoC.BindingType.DataTransferObjectService,
            Services.AbstractDataTransferObjectService,
        );
    });

    nock(/.+/)
        .get("/api/wallets")
        .query({ address: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" })
        .reply(200, requireModule(`../test/fixtures/client/wallets.json`));

    const result = await subject.wallets({
        identifiers: [{ type: "address", value: "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8" }],
    });

    assert.is(result, "object");
assert.is(result.items()[0] instanceof WalletData);
        });
    });

describe("#delegate", () => {
    test("should succeed", async () => {
        nock(/.+/).get("/api/delegates/arkx").reply(200, requireModule(`../test/fixtures/client/delegate.json`));

        const result = await subject.delegate("arkx");

        assert.is(result instanceof WalletData);
    });
});

describe("#delegates", () => {
    test("should succeed", async () => {
        nock(/.+/).get("/api/delegates").reply(200, requireModule(`../test/fixtures/client/delegates.json`));

        const result = await subject.delegates();

        assert.is(result, "object");
    assert.is(result.items()[0] instanceof WalletData);
});
    });

describe("#votes", () => {
    let fixture;

    test.before.each(async () => {
        fixture = requireModule(`../test/fixtures/client/wallet.json`);
    });

    test("should succeed", async () => {
        nock(/.+/).get("/api/wallets/arkx").reply(200, fixture);

        const result = await subject.votes("arkx");

        assert.is(result, "object");
    assert.is(result.used, 1);
    assert.is(result.available, 0);
    assert.is(result.votes).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "amount": 0,
			    "id": "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
			  },
			]
		`);
});

test("should succeed without vote", async () => {
    const fixtureWithoutVote = {
        data: {
            ...fixture.data,
            attributes: {
                ...fixture.data.attributes,
                vote: undefined,
            },
            vote: undefined,
        },
    };

    nock(/.+/).get("/api/wallets/arkx").reply(200, fixtureWithoutVote);

    const result = await subject.votes("arkx");

    assert.is(result, "object");
assert.is(result.used, 0);
assert.is(result.available, 1);
assert.is(result.votes).toMatchInlineSnapshot(`Array []`);
        });

test("should succeed without attributes when no vote", async () => {
    const fixtureWithoutVote = {
        data: {
            ...fixture.data,
            attributes: undefined,
            vote: undefined,
        },
    };

    nock(/.+/).get("/api/wallets/arkx").reply(200, fixtureWithoutVote);

    const result = await subject.votes("arkx");

    assert.is(result, "object");
assert.is(result.used, 0);
assert.is(result.available, 1);
assert.is(result.votes).toMatchInlineSnapshot(`Array []`);
        });

test("should succeed without attributes", async () => {
    const fixtureWithoutVote = {
        data: {
            ...fixture.data,
            attributes: undefined,
        },
    };

    nock(/.+/).get("/api/wallets/arkx").reply(200, fixtureWithoutVote);

    const result = await subject.votes("arkx");

    assert.is(result, "object");
assert.is(result.used, 1);
assert.is(result.available, 0);
assert.is(result.votes).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "amount": 0,
			    "id": "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
			  },
			]
		`);
        });
    });

describe("#voters", () => {
    test("should succeed", async () => {
        nock(/.+/)
            .get("/api/delegates/arkx/voters")
            .reply(200, requireModule(`../test/fixtures/client/voters.json`));

        const result = await subject.voters("arkx");

        assert.is(result, "object");
    assert.is(result.items()[0] instanceof WalletData);
});
    });

describe("#broadcast", () => {
    let fixture;

    test.before.each(async () => {
        fixture = requireModule(`../test/fixtures/client/broadcast.json`);
    });

    test("should accept 1 transaction and reject 1 transaction", async () => {
        nock(/.+/).post("/api/transactions").reply(422, fixture);

        const mock = { toBroadcast: () => "" } as SignedTransactionData;
        const result = await subject.broadcast([mock]);

        assert.is(result, {
            accepted: ["e4311204acf8a86ba833e494f5292475c6e9e0913fc455a12601b4b6b55818d8"],
            rejected: ["d4cb4edfbd50a5d71d3d190a687145530b73f041c59e2c4137fe8b3d1f970216"],
            errors: {
                d4cb4edfbd50a5d71d3d190a687145530b73f041c59e2c4137fe8b3d1f970216: "Already forged.",
            },
        });
    });

    test("should read errors in non-array format", async () => {
        const errorId = Object.keys(fixture.errors)[0];
        const nonArrayFixture = {
            data: fixture.data,
            errors: { [errorId]: fixture.errors[errorId][0] },
        };

        nock(/.+/).post("/api/transactions").reply(422, nonArrayFixture);

        const mock = { toBroadcast: () => "" } as SignedTransactionData;
        const result = await subject.broadcast([mock]);

        assert.is(result, {
            accepted: ["e4311204acf8a86ba833e494f5292475c6e9e0913fc455a12601b4b6b55818d8"],
            rejected: ["d4cb4edfbd50a5d71d3d190a687145530b73f041c59e2c4137fe8b3d1f970216"],
            errors: {
                d4cb4edfbd50a5d71d3d190a687145530b73f041c59e2c4137fe8b3d1f970216: "Already forged.",
            },
        });
    });
});
});
