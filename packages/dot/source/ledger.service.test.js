import { assert, describe, test } from "@payvo/sdk-test";
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

const createMockService = async (record) => {
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
		const subject = await createMockService("");

		assert.undefined(await subject.disconnect());
	});
});

describe("getVersion", () => {
	test("should generate an app version", async () => {
		const polkadot = await createMockService(ledger.appVersion.record);

		assert.is(await polkadot.getVersion(), ledger.appVersion.result);
	});
});

describe("getPublicKey", () => {
	test("should generate a publicKey", async () => {
		const polkadot = await createMockService(ledger.publicKey.record);

		assert.is(await polkadot.getPublicKey(ledger.bip44.path), ledger.publicKey.result);
	});
});

describe("signTransaction", () => {
	test("should generate output from a transaction", async () => {
		const polkadot = await createMockService(ledger.transaction.record);

		assert.is(
			await polkadot.signTransaction(ledger.bip44.path, Buffer.from(ledger.transaction.payload, "hex")),
			ledger.transaction.result,
		);
	});
});

describe("signMessage", () => {
	test("should fail to generate an output from a message", async () => {
		const polkadot = await createMockService("");

		await assert.is(polkadot.signMessage("", Buffer.alloc(0))).rejects.toThrow();
	});
});
