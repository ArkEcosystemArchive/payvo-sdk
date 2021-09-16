import "jest-extended";

import { IoC, Services } from "@payvo/sdk";
import { openTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { jest } from "@jest/globals";
import * as bitcoin from "bitcoinjs-lib";

import { ledger } from "../test/fixtures/ledger";
import { createService } from "../test/mocking";
import { DataTransferObjects } from "./coin.dtos";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { LedgerService } from "./ledger.service";
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid-singleton";
// import { BIP32 } from "@payvo/cryptography";
import { BIP32 } from "@payvo/cryptography";

const createMockService = async (record: string) => {
	const transport = await createService(LedgerService, "btc.testnet", (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
	});

	await transport.connect(await openTransportReplayer(RecordStore.fromString(record)));

	return transport;
};

describe("destruct", () => {
	it("should pass with a resolved transport closure", async () => {
		const subject = await createMockService("");

		await expect(subject.__destruct()).resolves.toBeUndefined();
	});
});

describe("disconnect", () => {
	it("should pass with a resolved transport closure", async () => {
		const subject = await createMockService("");

		await expect(subject.disconnect()).resolves.toBeUndefined();
	});
});

describe("getVersion", () => {
	it("should pass with an app version", async () => {
		const subject = await createMockService(ledger.appVersion.record);

		await expect(subject.getVersion()).resolves.toBe(ledger.appVersion.result);
	});
});

describe("getPublicKey", () => {
	it("should pass with a compressed publicKey", async () => {
		const subject = await createMockService(ledger.publicKey.record);

		await expect(subject.getPublicKey(ledger.bip44.path)).resolves.toEqual(ledger.publicKey.result);
	});

	jest.setTimeout(130_000);
	it("get extended publicKey", async () => {
		const subject = await createMockService(ledger.publicKey.record);

		console.log("result", await subject.getExtendedPublicKey("49'/1'/0'/0/0"));
	});
});

describe("signTransaction", () => {
	it("should pass with a signature", async () => {
		const subject = await createMockService(ledger.transaction.record);

		await expect(
			subject.signTransaction(ledger.bip44.path, Buffer.from(ledger.transaction.payload)),
		).resolves.toEqual(ledger.transaction.result);
	});
});

describe("signMessage", () => {
	it("should pass with an ecdsa signature", async () => {
		const subject = await createMockService(ledger.message.record);

		await expect(
			subject.signMessage(ledger.bip44.path, Buffer.from(ledger.message.payload, "utf-8")),
		).resolves.toEqual(ledger.message.result);
	});
});

const compressPublicKey = (pubKey: string, network: bitcoin.networks.Network): string => {
	const { publicKey } = bitcoin.ECPair.fromPublicKey(Buffer.from(pubKey, "hex"), {
		network,
	});
	return publicKey.toString("hex");
};

describe("mariano", () => {
	it("parse valid nanos tpub ", async function () {
		const network = bitcoin.networks.testnet;
		const extPubKey =
			"tpubDCzoRb9kb5qSjv1RcX5g4bJ9h28uuaqeuEhFmHCgtGRuoxB121X1e4DSwq44AD1gv7Lu33ije8b4b7fX8oXp3h28CRycqJkFJRd7GSSV7YK";

		let bip32Interface = BIP32.fromBase58(extPubKey, network);
		console.log("toBase58", bip32Interface.toBase58());

		expect(bip32Interface.toBase58()).toBe(extPubKey);
	});

	it("should ", async function () {
		const subject = await createMockService("");

		// @ts-ignore
		await subject.connect(TransportNodeHid.default);

		try {
			const network = bitcoin.networks.testnet;

			const path = "44'/1'/0'";
			const expectedWalletPublicKey = {
				publicKey:
					"047cdc8c71b62628703c486378dd38254dda909038d52c68a5c6acf5af0b7239991fa292a7cfc747ca94f015484233b8563a22fec7aa9c6b5d796028314c351d30",
				bitcoinAddress: "mrAnhdVfLEFhzVbn8nL9WdTCzmqomJaEsn",
				chainCode: "252f8df8aa4cec969cf1befa706a2a93265ffe4d2c4d407493bfd4508de371d7",
				compressed: "027cdc8c71b62628703c486378dd38254dda909038d52c68a5c6acf5af0b723999",
				base58: "tpubDCzoRb9kb5qSjv1RcX5g4bJ9h28uuaqeuEhFmHCgtGRuoxB121X1e4DSwq44AD1gv7Lu33ije8b4b7fX8oXp3h28CRycqJkFJRd7GSSV7YK",
			};

			// const path = "44'/1'/0'/0/0";
			// const expectedWalletPublicKey = {
			// 	publicKey:
			// 		"04c51a1a843e4661e603d7d28279dcf58c065f8a217818fa00202b666aa56faa8bc34334dc4dccef37155453d9ba37def4fbb0a259d7aa8b9f455ab22afc7791c0",
			// 	bitcoinAddress: "mvVAfs3MCDYg7HokDhL6pPuef6KZLPdUUz",
			// 	chainCode: "01552c1f37514bffb197b2fdc464dcba33805437dbb91e2c053d2f2c53187f2a",
			// 	compressed: "02c51a1a843e4661e603d7d28279dcf58c065f8a217818fa00202b666aa56faa8b",
			// };

			const walletPublicKey = await subject.getPublicKey2(path);
			const compressed = compressPublicKey(walletPublicKey.publicKey, network);

			console.log("walletPublicKey", walletPublicKey);
			expect(walletPublicKey.publicKey).toBe(expectedWalletPublicKey.publicKey);
			expect(walletPublicKey.bitcoinAddress).toBe(expectedWalletPublicKey.bitcoinAddress);
			expect(walletPublicKey.chainCode).toBe(expectedWalletPublicKey.chainCode);
			expect(compressed).toBe(expectedWalletPublicKey.compressed);

			// const ecpair = bitcoin.ECPair.fromPublicKey(Buffer.from(walletPublicKey.publicKey, "hex"), {
			// 	network: network,
			// });
			// console.log("ecpair", ecpair);
			//
			// const publicKey2 = ecpair.publicKey;
			// console.log("publicKey2", publicKey2.toString("hex"));
			//
			// const bip32Interface = new bitcoin.bip32.BIP32(undefined, publicKey, chainCode, network, depth, index, parentFingerprint)(
			// 	Buffer.from(compressed, 'hex'),
			// 	Buffer.from(walletPublicKey.chainCode, 'hex'),
			// 	network,
			// );
			const expectedBip32Interface = BIP32.fromBase58(expectedWalletPublicKey.base58, network);

			const bip32Interface = bitcoin.bip32.fromPublicKey(
				Buffer.from(compressed, "hex"),
				Buffer.from(walletPublicKey.chainCode, "hex"),
				network,
			);
			console.log("bip32Interface", bip32Interface.derive(0).derive(0));
			console.log("bip32Interface", bip32Interface);
			console.log("toBase58", bip32Interface.toBase58());

			expect(bip32Interface).toBe(expectedBip32Interface);
			expect(bip32Interface.toBase58()).toBe(expectedWalletPublicKey.base58);
		} finally {
			subject.disconnect();
		}
	});
});
