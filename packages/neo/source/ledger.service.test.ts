import { describe } from "@payvo/sdk-test";
import { IoC, Services } from "@payvo/sdk";
import { openTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";

import { ledger } from "../test/fixtures/ledger";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service.js";
import { ClientService } from "./client.service.js";
import { LedgerService } from "./ledger.service.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";

const createMockService = async (record, opts) => {
	const transport = await createService(LedgerService, undefined, (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(
			IoC.BindingType.LedgerTransportFactory,
			async () => await openTransportReplayer(RecordStore.fromString(record, opts)),
		);
	});

	await transport.connect();

	return transport;
};

describe("disconnect", ({ it, assert }) => {
	it("should pass with a resolved transport closure", async () => {
		const subject = await createMockService("");

		assert.undefined(await subject.disconnect());
	});
});

describe("disconnect", ({ it, assert }) => {
	it("should pass with a resolved transport closure", async () => {
		const subject = await createMockService("");

		assert.undefined(await subject.disconnect());
	});
});

describe("getVersion", ({ it, assert }) => {
	it("should pass with an app version", async () => {
		const subject = await createMockService(ledger.appVersion.record);

		assert.is(await subject.getVersion(), ledger.appVersion.result);
	});
});

describe("getPublicKey", ({ it, assert }) => {
	it("should pass with a compressed publicKey", async () => {
		const subject = await createMockService(ledger.publicKey.record);

		assert.is(await subject.getPublicKey(ledger.bip44.path), ledger.publicKey.result);
	});
});

describe("signTransaction", ({ it, assert }) => {
	it("should pass with a signature", async () => {
		const subject = await createMockService(ledger.publicKey.record + ledger.transaction.record, {
			autoSkipUnknownApdu: true,
			warning: () => {
				/* noop: suppress log for unknown skipped APDu */
			},
		});

		assert.is(
			await subject.signTransaction(ledger.bip44.path, Buffer.from(ledger.transaction.payload)),
			ledger.transaction.result,
		);
	});
});

describe("signMessage", ({ it, assert }) => {
	it("should pass with an ecdsa signature", async () => {
		const subject = await createMockService("");

		await assert.rejects(() => subject.signMessage("", ""));
	});
});
