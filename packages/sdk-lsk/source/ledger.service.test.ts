import "jest-extended";

import { IoC, Services } from "@payvo/sdk";
import { openTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import nock from "nock";

import { ledger } from "../test/fixtures/ledger";
import { createService, require } from "../test/mocking";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { LedgerService } from "./ledger.service";
import { BindingType } from "./coin.contract";
import { AssetSerializer } from "./asset.serializer";
import { TransactionSerializer } from "./transaction.serializer";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

const createMockService = async (record: string) => {
	const transport = await createService(LedgerService, "lsk.mainnet", (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(BindingType.AssetSerializer, AssetSerializer);
		container.singleton(BindingType.TransactionSerializer, TransactionSerializer);
	});

	await transport.connect(await openTransportReplayer(RecordStore.fromString(record)));

	return transport;
};

describe("connect", () => {
	it("should throw error with unexpected input", async () => {
		const transport = await createService(LedgerService, "lsk.mainnet", (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.singleton(IoC.BindingType.AddressService, AddressService);
			container.singleton(IoC.BindingType.ClientService, ClientService);
			container.constant(IoC.BindingType.DataTransferObjects, {
				SignedTransactionData,
				ConfirmedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
			container.singleton(BindingType.AssetSerializer, AssetSerializer);
			container.singleton(BindingType.TransactionSerializer, TransactionSerializer);
		});

		await expect(() =>
			transport.connect({
				open: () => {
					throw new Error("cannot open");
				},
			}),
		).rejects.toThrow();
	});
});

describe("disconnect", () => {
	it("should pass with a resolved transport closure", async () => {
		const lsk = await createMockService("");

		await expect(lsk.disconnect()).resolves.toBeUndefined();
	});
});

describe("getVersion", () => {
	it("should pass with an app version", async () => {
		const lsk = await createMockService(ledger.appVersion.record);

		await expect(lsk.getVersion()).resolves.toEqual(ledger.appVersion.result);
	});
});

describe("getPublicKey", () => {
	it("should pass with a compressed publicKey", async () => {
		const lsk = await createMockService(ledger.publicKey.record);

		await expect(lsk.getPublicKey(ledger.bip44.path)).resolves.toEqual(ledger.publicKey.result);
	});
});

describe("signTransaction", () => {
	it("should pass with a signature", async () => {
		const lsk = await createMockService(ledger.transaction.record);

		await expect(
			lsk.signTransaction(ledger.bip44.path, Buffer.from(ledger.transaction.payload, "hex")),
		).resolves.toEqual(ledger.transaction.result);
	});
});

describe("signMessage", () => {
	it("should pass with a signature", async () => {
		const lsk = await createMockService(ledger.message.record);

		await expect(lsk.signMessage(ledger.bip44.path, Buffer.from(ledger.message.payload, "hex"))).resolves.toEqual(
			ledger.message.result,
		);
	});
});

describe("scan", () => {
	afterEach(() => nock.cleanAll());

	beforeAll(() => nock.disableNetConnect());

	it("should return scanned wallet", async () => {
		nock(/.+/)
			.get("/api/v2/accounts")
			.query({ address: "lsk8s6v2pdnxvab9oc42wbhvtb569jqg2ubjxgvvj" })
			.reply(200, await require("../test/fixtures/client/wallet-0.json"))
			.get("/api/v2/accounts")
			.query({ address: "lskbh47p4ts33c6c5pjvwa32424qr8px8pwfx8e4s" })
			.reply(200, await require("../test/fixtures/client/wallet-1.json"))
			.get("/api/v2/accounts")
			.query({ address: "lskksmfa2q2evtwmfneaon79u9hv7a3saokuy9tv9" })
			.reply(200, await require("../test/fixtures/client/wallet-2.json"));

		const lsk = await createMockService(ledger.wallets.record);

		const walletData = await lsk.scan();

		expect(Object.keys(walletData)).toHaveLength(4); // 3 + 1 cold wallet
		expect(walletData).toMatchSnapshot();
	});

	it("should allow to pass a startPath", async () => {
		const lsk = await createMockService(ledger.wallets.record2);

		const walletData = await lsk.scan({ startPath: "44'/134'/10'/0/0" });

		expect(Object.keys(walletData)).toHaveLength(1);
		expect(walletData).toMatchSnapshot();
	});

	it("should support legacy", async () => {
		const lsk = await createMockService(ledger.wallets.record);

		const walletData = await lsk.scan({ useLegacy: true });

		expect(Object.keys(walletData)).toHaveLength(1);
		expect((Object.values(walletData) as any[])[0].data.address).not.toStartWith("lsk");
		expect(walletData).toMatchSnapshot();
	});
});
