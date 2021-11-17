import * as bitcoin from "bitcoinjs-lib";
import { BIP32 } from "@payvo/sdk-cryptography";
import {
	legacyMusig,
	nativeSegwitMusig,
	p2SHSegwitMusig,
	defaultLegacyMusigAccountKey,
	defaultNativeSegwitMusigAccountKey,
	defaultP2SHSegwitMusigAccountKey,
	rootToAccountKeys,
} from "./address.domain";
import { musig } from "../test/fixtures/musig.js";
import { convertBuffer } from "@payvo/sdk-helpers";

const network = bitcoin.networks.testnet;

const rootAccountKeys = musig.accounts.map((account) => BIP32.fromMnemonic(account.mnemonic, network));

describe("multi signature", () => {
	it("should derive account key for legacy multisig", async () => {
		const accountKeys = rootToAccountKeys(rootAccountKeys, defaultLegacyMusigAccountKey);

		expect(accountKeys.map((accountKey) => convertBuffer(accountKey.publicKey))).toEqual(
			musig.legacyWallet.accountKeys,
		);
	});

	it("should derive account key for p2sh-segwit multisig", async () => {
		const accountKeys = rootToAccountKeys(rootAccountKeys, defaultP2SHSegwitMusigAccountKey);

		expect(accountKeys.map((accountKey) => convertBuffer(accountKey.publicKey))).toEqual(
			musig.p2shSegwitWallet.accountKeys,
		);
	});

	it("should derive account key for native segwit multisig", async () => {
		const accountKeys = rootToAccountKeys(rootAccountKeys, defaultNativeSegwitMusigAccountKey);

		expect(accountKeys.map((accountKey) => convertBuffer(accountKey.publicKey))).toEqual(
			musig.nativeSegwitWallet.accountKeys,
		);
	});

	it("should create a legacy multisig wallet like Electrum", async () => {
		const accountKeys = rootToAccountKeys(rootAccountKeys, defaultLegacyMusigAccountKey);

		musig.legacyWallet.spendAddresses.forEach((address, index) => {
			expect(
				legacyMusig(
					2,
					accountKeys.map((pk) => pk.derive(0).derive(index).publicKey),
					network,
				).address,
			).toBe(address);
		});
		musig.legacyWallet.changeAddresses.forEach((address, index) => {
			expect(
				legacyMusig(
					2,
					accountKeys.map((pk) => pk.derive(1).derive(index).publicKey),
					network,
				).address,
			).toBe(address);
		});
	});

	it("should create a p2sh-segwit (p2wsh-p2sh) multisig wallet like Electrum", async () => {
		const accountKeys = rootToAccountKeys(rootAccountKeys, defaultP2SHSegwitMusigAccountKey);

		musig.p2shSegwitWallet.spendAddresses.forEach((address, index) => {
			expect(
				p2SHSegwitMusig(
					2,
					accountKeys.map((pk) => pk.derive(0).derive(index).publicKey),
					network,
				).address,
			).toBe(address);
		});
		musig.p2shSegwitWallet.changeAddresses.forEach((address, index) => {
			expect(
				p2SHSegwitMusig(
					2,
					accountKeys.map((pk) => pk.derive(1).derive(index).publicKey),
					network,
				).address,
			).toBe(address);
		});
	});

	it("should create a native segwit (p2wsh) multisig wallet like Electrum", async () => {
		const accountKeys = rootToAccountKeys(rootAccountKeys, defaultNativeSegwitMusigAccountKey);

		musig.nativeSegwitWallet.spendAddresses.forEach((address, index) => {
			expect(
				nativeSegwitMusig(
					2,
					accountKeys.map((pk) => pk.derive(0).derive(index).publicKey),
					network,
				).address,
			).toBe(address);
		});
		musig.nativeSegwitWallet.changeAddresses.forEach((address, index) => {
			expect(
				nativeSegwitMusig(
					2,
					accountKeys.map((pk) => pk.derive(1).derive(index).publicKey),
					network,
				).address,
			).toBe(address);
		});
	});
});
