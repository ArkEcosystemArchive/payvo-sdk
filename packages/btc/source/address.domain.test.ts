import { BIP32 } from "@payvo/sdk-cryptography";
import { convertBuffer } from "@payvo/sdk-helpers";
import { describeWithContext } from "@payvo/sdk-test";
import { networks } from "bitcoinjs-lib";

import { musig } from "../test/fixtures/musig";
import {
	defaultLegacyMusigAccountKey,
	defaultNativeSegwitMusigAccountKey,
	defaultP2SHSegwitMusigAccountKey,
	legacyMusig,
	nativeSegwitMusig,
	p2SHSegwitMusig,
	rootToAccountKeys,
} from "./address.domain";

describeWithContext(
	"Address domain",
	{
		network: networks.testnet,
		rootAccountKeys: musig.accounts.map((account) => BIP32.fromMnemonic(account.mnemonic, networks.testnet)),
	},
	async ({ it, assert }) => {
		it("should derive account key for legacy multisig", async (context) => {
			const accountKeys = rootToAccountKeys(context.rootAccountKeys, defaultLegacyMusigAccountKey);

			assert.equal(
				accountKeys.map((accountKey) => convertBuffer(accountKey.publicKey)),
				musig.legacyWallet.accountKeys,
			);
		});

		it("should derive account key for p2sh-segwit multisig", async (context) => {
			const accountKeys = rootToAccountKeys(context.rootAccountKeys, defaultP2SHSegwitMusigAccountKey);

			assert.equal(
				accountKeys.map((accountKey) => convertBuffer(accountKey.publicKey)),
				musig.p2shSegwitWallet.accountKeys,
			);
		});

		it("should derive account key for native segwit multisig", async (context) => {
			const accountKeys = rootToAccountKeys(context.rootAccountKeys, defaultNativeSegwitMusigAccountKey);

			assert.equal(
				accountKeys.map((accountKey) => convertBuffer(accountKey.publicKey)),
				musig.nativeSegwitWallet.accountKeys,
			);
		});

		it("should create a legacy multisig wallet like Electrum", async (context) => {
			const accountKeys = rootToAccountKeys(context.rootAccountKeys, defaultLegacyMusigAccountKey);

			for (const [index, address] of musig.legacyWallet.spendAddresses.entries()) {
				assert.is(
					legacyMusig(
						2,
						accountKeys.map((pk) => pk.derive(0).derive(index).publicKey),
						context.network,
					).address,
					address,
				);
			}
			for (const [index, address] of musig.legacyWallet.changeAddresses.entries()) {
				assert.is(
					legacyMusig(
						2,
						accountKeys.map((pk) => pk.derive(1).derive(index).publicKey),
						context.network,
					).address,
					address,
				);
			}
		});

		it.only("should create a p2sh-segwit (p2wsh-p2sh) multisig wallet like Electrum", async (context) => {
			const accountKeys = rootToAccountKeys(context.rootAccountKeys, defaultP2SHSegwitMusigAccountKey);

			for (const [index, address] of musig.p2shSegwitWallet.spendAddresses.entries()) {
				assert.is(
					p2SHSegwitMusig(
						2,
						accountKeys.map((pk) => pk.derive(0).derive(index).publicKey),
						context.network,
					).address,
					address,
				);
			}
			for (const [index, address] of musig.p2shSegwitWallet.changeAddresses.entries()) {
				assert.is(
					p2SHSegwitMusig(
						2,
						accountKeys.map((pk) => pk.derive(1).derive(index).publicKey),
						context.network,
					).address,
					address,
				);
			}
		});

		it("should create a native segwit (p2wsh) multisig wallet like Electrum", async (context) => {
			const accountKeys = rootToAccountKeys(context.rootAccountKeys, defaultNativeSegwitMusigAccountKey);

			for (const [index, address] of musig.nativeSegwitWallet.spendAddresses.entries()) {
				assert.is(
					nativeSegwitMusig(
						2,
						accountKeys.map((pk) => pk.derive(0).derive(index).publicKey),
						context.network,
					).address,
					address,
				);
			}

			for (const [index, address] of musig.nativeSegwitWallet.changeAddresses.entries()) {
				assert.is(
					nativeSegwitMusig(
						2,
						accountKeys.map((pk) => pk.derive(1).derive(index).publicKey),
						context.network,
					).address,
					address,
				);
			}
		});
	},
);
