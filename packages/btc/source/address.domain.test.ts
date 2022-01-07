import { describeWithContext } from "@payvo/sdk-test";
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
} from "./address.domain.js";
import { musig } from "../test/fixtures/musig";
import { convertBuffer } from "@payvo/sdk-helpers";

describeWithContext(
	"Address domain",
	{
		network: bitcoin.networks.testnet,
		rootAccountKeys: musig.accounts.map((account) =>
			BIP32.fromMnemonic(account.mnemonic, bitcoin.networks.testnet),
		),
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

			musig.legacyWallet.spendAddresses.forEach((address, index) => {
				assert.is(
					legacyMusig(
						2,
						accountKeys.map((pk) => pk.derive(0).derive(index).publicKey),
						context.network,
					).address,
					address,
				);
			});
			musig.legacyWallet.changeAddresses.forEach((address, index) => {
				assert.is(
					legacyMusig(
						2,
						accountKeys.map((pk) => pk.derive(1).derive(index).publicKey),
						context.network,
					).address,
					address,
				);
			});
		});

		it("should create a p2sh-segwit (p2wsh-p2sh) multisig wallet like Electrum", async (context) => {
			const accountKeys = rootToAccountKeys(context.rootAccountKeys, defaultP2SHSegwitMusigAccountKey);

			musig.p2shSegwitWallet.spendAddresses.forEach((address, index) => {
				assert.is(
					p2SHSegwitMusig(
						2,
						accountKeys.map((pk) => pk.derive(0).derive(index).publicKey),
						context.network,
					).address,
					address,
				);
			});
			musig.p2shSegwitWallet.changeAddresses.forEach((address, index) => {
				assert.is(
					p2SHSegwitMusig(
						2,
						accountKeys.map((pk) => pk.derive(1).derive(index).publicKey),
						context.network,
					).address,
					address,
				);
			});
		});

		it("should create a native segwit (p2wsh) multisig wallet like Electrum", async (context) => {
			const accountKeys = rootToAccountKeys(context.rootAccountKeys, defaultNativeSegwitMusigAccountKey);

			musig.nativeSegwitWallet.spendAddresses.forEach((address, index) => {
				assert.is(
					nativeSegwitMusig(
						2,
						accountKeys.map((pk) => pk.derive(0).derive(index).publicKey),
						context.network,
					).address,
					address,
				);
			});

			musig.nativeSegwitWallet.changeAddresses.forEach((address, index) => {
				assert.is(
					nativeSegwitMusig(
						2,
						accountKeys.map((pk) => pk.derive(1).derive(index).publicKey),
						context.network,
					).address,
					address,
				);
			});
		});
	},
);
