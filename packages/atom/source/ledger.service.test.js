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

describe("disconnect", ({ afterEach, beforeEach, test }) => {
	test("should pass with a resolved transport closure", async () => {
		const subject = await createMockService("");

		assert.undefined(await subject.disconnect());
	});
});

describe("getVersion", ({ afterEach, beforeEach, test }) => {
	test("should pass with an app version", async () => {
		const subject = await createMockService(ledger.appVersion.record);

		assert.is(await subject.getVersion(), ledger.appVersion.result);
	});
});

test.skip("getPublicKey", () => {
	test("should pass with a compressed publicKey", async () => {
		const subject = await createMockService(ledger.publicKey.record);

		assert.is(await subject.getPublicKey(ledger.bip44.path), ledger.publicKey.result);
	});
});

describe("signTransaction", ({ afterEach, beforeEach, test }) => {
	test("should pass with a signature", async () => {
		const subject = await createMockService(ledger.transaction.record);

		assert.is(
			await subject.signTransaction(ledger.bip44.path, Buffer.from(ledger.transaction.payload)),
			ledger.transaction.result,
		);
	});
});

describe("signMessage", ({ afterEach, beforeEach, test }) => {
	test("should fail with a 'NotImplemented' error", async () => {
		const subject = await createMockService("");

		await assert.rejects(() => subject.signMessage("", Buffer.alloc(0)));
	});
});

test.run();
