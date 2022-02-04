import { describe, loader } from "@payvo/sdk-test";
import { IoC, Services } from "@payvo/sdk";
import { openTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";

import { ledger } from "../test/fixtures/ledger";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service.js";
import { ClientService } from "./client.service.js";
import { LedgerService } from "./ledger.service.js";
import { AssetSerializer } from "./asset.serializer.js";
import { TransactionSerializer } from "./transaction.serializer.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";

const createMockService = async (record) => {
	const transport = await createService(LedgerService, "lsk.mainnet", (container) => {
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
			async () => await openTransportReplayer(RecordStore.fromString(record)),
		);
	});

	await transport.connect();

	return transport;
};

describe("connect", ({ it, assert }) => {
	it("should throw error with unexpected input", async () => {
		const transport = await createService(LedgerService, "lsk.mainnet", (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.constant(IoC.BindingType.DataTransferObjects, {
				SignedTransactionData,
				ConfirmedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
			container.singleton(IoC.BindingType.AddressService, AddressService);
			container.singleton(IoC.BindingType.ClientService, ClientService);
			container.constant(IoC.BindingType.LedgerTransportFactory, () => {
				throw new Error("cannot open");
			});
		});

		await assert.rejects(() => transport.connect());
	});
});

describe("disconnect", ({ it, assert }) => {
	it("should pass with a resolved transport closure", async () => {
		const lsk = await createMockService("");

		assert.undefined(await lsk.disconnect());
	});
});

describe("getVersion", ({ it, assert }) => {
	it("should pass with an app version", async () => {
		const lsk = await createMockService(ledger.appVersion.record);

		assert.is(await lsk.getVersion(), ledger.appVersion.result);
	});
});

describe("getPublicKey", ({ it, assert }) => {
	it("should pass with a compressed publicKey", async () => {
		const lsk = await createMockService(ledger.publicKey.record);

		assert.is(await lsk.getPublicKey(ledger.bip44.path), ledger.publicKey.result);
	});
});

describe("signTransaction", ({ it, assert }) => {
	it("should pass with a signature", async () => {
		const lsk = await createMockService(ledger.transaction.record);

		assert.is(
			await lsk.signTransaction(ledger.bip44.path, Buffer.from(ledger.transaction.payload, "hex")),
			ledger.transaction.result,
		);
	});
});

describe("signMessage", ({ it, assert }) => {
	it("should pass with a signature", async () => {
		const lsk = await createMockService(ledger.message.record);

		assert.is(
			await lsk.signMessage(ledger.bip44.path, Buffer.from(ledger.message.payload, "hex").toString()),
			ledger.message.result,
		);
	});
});

describe("scan", ({ it, assert, beforeAll, nock }) => {
	beforeAll(() => nock.disableNetConnect());

	it("should return scanned wallet", async () => {
		nock.fake(/.+/)
			.get("/api/v2/accounts")
			.query({ address: "lsk8s6v2pdnxvab9oc42wbhvtb569jqg2ubjxgvvj" })
			.reply(200, loader.json("test/fixtures/client/wallet-0.json"))
			.get("/api/v2/accounts")
			.query({ address: "lskbh47p4ts33c6c5pjvwa32424qr8px8pwfx8e4s" })
			.reply(200, loader.json("test/fixtures/client/wallet-1.json"))
			.get("/api/v2/accounts")
			.query({ address: "lskksmfa2q2evtwmfneaon79u9hv7a3saokuy9tv9" })
			.reply(200, loader.json("test/fixtures/client/wallet-2.json"));

		const lsk = await createMockService(ledger.wallets.record);

		const walletData = await lsk.scan();

		assert.length(Object.keys(walletData), 4); // 3 + 1 cold wallet
	});

	it("should allow to pass a startPath", async () => {
		const lsk = await createMockService(ledger.wallets.record2);

		const walletData = await lsk.scan({ startPath: "44'/134'/10'/0/0" });

		assert.length(Object.keys(walletData), 1);
	});

	it("should support legacy", async () => {
		const lsk = await createMockService(ledger.wallets.record);

		const walletData = await lsk.scan({ useLegacy: true });

		assert.length(Object.keys(walletData), 1);
		assert.false(Object.values(walletData)[0].data.address.startsWith("lsk"));
	});
});
