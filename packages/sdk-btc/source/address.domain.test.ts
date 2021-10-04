import "jest-extended";
import * as bitcoin from "bitcoinjs-lib";
import { BIP32 } from "@payvo/cryptography";
import {
	createLegacyMusigAddress,
	createNativeSegwitMusigAddress,
	createP2SHSegwitMusigAddress,
	defaultLegacyMusigAccountKey,
	defaultNativeSegwitMusigAccountKey,
	defaultP2SHSegwitMusigAccountKey,
	rootToAccountKeys,
} from "./address.domain";
import { musig } from "../test/fixtures/musig";

const network = bitcoin.networks.testnet;

// const mnemonic1 = "tell rubber raise grow immune cabbage proof bus distance ship kidney great";
// const mnemonic2 = "digital bright lava credit olive buzz awful crunch note salute deer gossip";
// const mnemonic3 = "copy pulse nation multiply body long theme breeze profit juice wife hole";

const rootAccountKeys = musig.accounts.map((account) => BIP32.fromMnemonic(account.mnemonic, network));

describe("multi signature", () => {
	it("should create a legacy multisig wallet like Electrum", async () => {
		const accountKeys = rootToAccountKeys(rootAccountKeys, defaultLegacyMusigAccountKey);

		musig.legacyWallet.spendAddresses.forEach((address, index) => {
			expect(
				createLegacyMusigAddress(
					2,
					accountKeys.map((pk) => pk.derive(0).derive(index).publicKey),
					network,
				).address,
			).toBe(address);
		});
		musig.legacyWallet.changeAddresses.forEach((address, index) => {
			expect(
				createLegacyMusigAddress(
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
				createP2SHSegwitMusigAddress(
					2,
					accountKeys.map((pk) => pk.derive(0).derive(index).publicKey),
					network,
				).address,
			).toBe(address);
		});
		musig.p2shSegwitWallet.changeAddresses.forEach((address, index) => {
			expect(
				createP2SHSegwitMusigAddress(
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
				createNativeSegwitMusigAddress(
					2,
					accountKeys.map((pk) => pk.derive(0).derive(index).publicKey),
					network,
				).address,
			).toBe(address);
		});
		musig.nativeSegwitWallet.changeAddresses.forEach((address, index) => {
			expect(
				createNativeSegwitMusigAddress(
					2,
					accountKeys.map((pk) => pk.derive(1).derive(index).publicKey),
					network,
				).address,
			).toBe(address);
		});
	});
});
