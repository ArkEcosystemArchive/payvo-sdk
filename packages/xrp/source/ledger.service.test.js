import { IoC, Services } from "@payvo/sdk";
import { openTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";

import { ledger } from "../test/fixtures/ledger";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { LedgerService } from "./ledger.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

const createMockService = async (record: string) => {
    const transport = await createService(LedgerService, undefined, (container) => {
        container.constant(IoC.BindingType.Container, container);
        container.singleton(IoC.BindingType.AddressService, AddressService);
        container.singleton(IoC.BindingType.ClientService, ClientService);
        container.constant(IoC.BindingType.DataTransferObjects, {
            SignedTransactionData,
            ConfirmedTransactionData,
            WalletData,
        });
        container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
        container.constant(
            IoC.BindingType.LedgerTransportFactory,
            async () => await openTransportReplayer(RecordStore.fromString(record)),
        );
    });

    await transport.connect();

    return transport;
};

describe("disconnect", () => {
    test("should pass with a resolved transport closure", async () => {
        const xrp = await createMockService("");

        await assert.is(xrp.disconnect()).resolves, "undefined");
});
});

describe("getVersion", () => {
    test("should pass with an app version", async () => {
        const xrp = await createMockService(ledger.appVersion.record);

        await assert.is(xrp.getVersion()).resolves.toEqual(ledger.appVersion.result);
    });
});

describe("getPublicKey", () => {
    test("should pass with a compressed publicKey", async () => {
        const xrp = await createMockService(ledger.publicKey.record);

        await assert.is(xrp.getPublicKey(ledger.bip44.path)).resolves.toEqual(ledger.publicKey.result);
    });
});

describe("signTransaction", () => {
    test("should pass with a signature", async () => {
        const xrp = await createMockService(ledger.transaction.record);

        await assert.is(
            xrp.signTransaction(ledger.bip44.path, Buffer.from(ledger.transaction.payload, "hex")),
        ).resolves.toEqual(ledger.transaction.result);
    });
});

describe("signMessage", () => {
    test("should fail with a 'NotImplemented' error", async () => {
        const xrp = await createMockService("");

        await assert.is(xrp.signMessage("", Buffer.alloc(0))).rejects.toThrow();
    });
});
