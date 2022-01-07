import { IoC, Services } from "@payvo/sdk";
import { describe } from "@payvo/sdk-test";
import * as bitcoin from "bitcoinjs-lib";

import { openTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { createService } from "../test/mocking.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { MultiSignatureService } from "./multi-signature.service.js";
import { ClientService } from "./client.service.js";
import { MultiSignatureSigner } from "./multi-signature.signer";
import { KeyPairService } from "./key-pair.service.js";
import { LedgerService } from "./ledger.service.js";
import { PublicKeyService } from "./public-key.service.js";
import { AddressService } from "./address.service.js";
import { BindingType } from "./constants.js";
import {
	oneSignatureNativeSegwitMusigRegistrationTx,
	oneSignatureNativeSegwitMusigTransferTx,
	threeSignatureNativeSegwitMusigRegistrationTx,
	threeSignatureNativeSegwitMusigTransferTx,
	twoSignatureNativeSegwitMusigRegistrationTx,
	twoSignatureNativeSegwitMusigTransferTx,
	unsignedNativeSegwitMusigRegistrationTx,
	unsignedNativeSegwitMusigTransferTx,
} from "../test/fixtures/musig-native-segwit-txs";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";
import { PendingMultiSignatureTransaction } from "./multi-signature.transaction.js";
import { AddressFactory } from "./address.factory.js";

describe("MultiSignatureTransaction", async ({ assert, beforeAll, each }) => {
	beforeAll(async (context) => {
		context.subject = await createService(MultiSignatureService, "btc.testnet", (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.constant(IoC.BindingType.DataTransferObjects, {
				SignedTransactionData,
				ConfirmedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
			container.singleton(BindingType.AddressFactory, AddressFactory);
			container.singleton(BindingType.MultiSignatureSigner, MultiSignatureSigner);
			container.singleton(IoC.BindingType.AddressService, AddressService);
			container.singleton(IoC.BindingType.ClientService, ClientService);
			container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
			container.constant(
				IoC.BindingType.LedgerTransportFactory,
				async () => await openTransportReplayer(RecordStore.fromString("")),
			);
			container.singleton(IoC.BindingType.LedgerService, LedgerService);
			container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
		});
	});

	each(
		"isMultiSignatureRegistration",
		({ dataset }) => {
			const subject = new PendingMultiSignatureTransaction(dataset.tx, bitcoin.networks.testnet);
			assert.is(subject.isMultiSignatureRegistration(), dataset.expected);
		},
		[
			{ tx: unsignedNativeSegwitMusigRegistrationTx, expected: true },
			{ tx: oneSignatureNativeSegwitMusigRegistrationTx, expected: true },
			{ tx: twoSignatureNativeSegwitMusigRegistrationTx, expected: true },
			{ tx: threeSignatureNativeSegwitMusigRegistrationTx, expected: true },
		],
	);

	each(
		"isMultiSignatureRegistration for transfer",
		({ dataset }) => {
			const subject = new PendingMultiSignatureTransaction(dataset.tx, bitcoin.networks.testnet);
			assert.is(subject.isMultiSignatureRegistration(), dataset.expected);
		},
		[
			{ tx: unsignedNativeSegwitMusigTransferTx, expected: false },
			{ tx: oneSignatureNativeSegwitMusigTransferTx, expected: false },
			{ tx: twoSignatureNativeSegwitMusigTransferTx, expected: false },
			{ tx: threeSignatureNativeSegwitMusigTransferTx, expected: false },
		],
	);

	each(
		"needsSignatures for musig registration",
		({ dataset }) => {
			const subject = new PendingMultiSignatureTransaction(dataset.tx, bitcoin.networks.testnet);
			assert.is(subject.needsSignatures(), dataset.expected);
		},
		[
			{ tx: unsignedNativeSegwitMusigRegistrationTx, expected: true },
			{ tx: oneSignatureNativeSegwitMusigRegistrationTx, expected: true },
			{ tx: twoSignatureNativeSegwitMusigRegistrationTx, expected: true },
			{ tx: threeSignatureNativeSegwitMusigRegistrationTx, expected: false },
		],
	);

	each(
		"needsSignatures for transfer",
		({ dataset }) => {
			const subject = new PendingMultiSignatureTransaction(dataset.tx, bitcoin.networks.testnet);
			assert.is(subject.needsSignatures(), dataset.expected);
		},
		[
			{ tx: unsignedNativeSegwitMusigTransferTx, expected: true },
			{ tx: oneSignatureNativeSegwitMusigTransferTx, expected: true },
			{ tx: twoSignatureNativeSegwitMusigTransferTx, expected: false },
			{ tx: threeSignatureNativeSegwitMusigTransferTx, expected: false },
		],
	);

	each(
		"needsAllSignatures for musig registration",
		({ dataset }) => {
			const subject = new PendingMultiSignatureTransaction(dataset.tx, bitcoin.networks.testnet);
			assert.is(subject.needsAllSignatures(), dataset.expected);
		},
		[
			{ tx: unsignedNativeSegwitMusigRegistrationTx, expected: true },
			{ tx: oneSignatureNativeSegwitMusigRegistrationTx, expected: true },
			{ tx: twoSignatureNativeSegwitMusigRegistrationTx, expected: true },
			{ tx: threeSignatureNativeSegwitMusigRegistrationTx, expected: true },
		],
	);

	each(
		"needsAllSignatures for transfer",
		({ dataset }) => {
			const subject = new PendingMultiSignatureTransaction(dataset.tx, bitcoin.networks.testnet);
			assert.is(subject.needsAllSignatures(), dataset.expected);
		},
		[
			{ tx: unsignedNativeSegwitMusigTransferTx, expected: false },
			{ tx: oneSignatureNativeSegwitMusigTransferTx, expected: false },
			{ tx: twoSignatureNativeSegwitMusigTransferTx, expected: false },
			{ tx: threeSignatureNativeSegwitMusigTransferTx, expected: false },
		],
	);

	each(
		"isMultiSignatureReady for musig registration",
		({ dataset }) => {
			const subject = new PendingMultiSignatureTransaction(dataset.tx, bitcoin.networks.testnet);
			assert.is(subject.isMultiSignatureReady(), dataset.expected);
		},
		[
			{ tx: unsignedNativeSegwitMusigRegistrationTx, expected: false },
			{ tx: oneSignatureNativeSegwitMusigRegistrationTx, expected: false },
			{ tx: twoSignatureNativeSegwitMusigRegistrationTx, expected: false },
			{ tx: threeSignatureNativeSegwitMusigRegistrationTx, expected: true },
		],
	);

	each(
		"isMultiSignatureReady for transfer",
		({ dataset }) => {
			const subject = new PendingMultiSignatureTransaction(dataset.tx, bitcoin.networks.testnet);
			assert.is(subject.isMultiSignatureReady(), dataset.expected);
		},
		[
			{ tx: unsignedNativeSegwitMusigTransferTx, expected: false },
			{ tx: oneSignatureNativeSegwitMusigTransferTx, expected: false },
			{ tx: twoSignatureNativeSegwitMusigTransferTx, expected: true },
			{ tx: threeSignatureNativeSegwitMusigTransferTx, expected: true },
		],
	);

	each(
		"needsWalletSignature for musig registration",
		({ dataset }) => {
			const subject = new PendingMultiSignatureTransaction(dataset.tx, bitcoin.networks.testnet);
			assert.is(
				subject.needsWalletSignature(
					"Vpub5mtyU6Hx9xrx63Y3W4aGW1LuQkmwrq9xsQNgX7tDAM8DTHhE7vXMZ7Hue2FR8SMAGDW57fy76HFmN1jnckSmeX2cDMWVA1KViot6bLgJZuN",
				),
				dataset.expected1,
			);
			assert.is(
				subject.needsWalletSignature(
					"Vpub5mYgzMb93fDtChZ2xmY7g3aEgHFjdgQE6P596AiL5zENEcVjDCciGfWmhZJngn6gVmBRh6E1Vp7aZYY7wQkMRTQSKhauGwYAUEdiGbS35D1",
				),
				dataset.expected2,
			);
			assert.is(
				subject.needsWalletSignature(
					"Vpub5mSSLBPFi3acdjk5giwrmA7gXPAJsiLXXKibgjXYycH1gp95t2Pqv3U8dT9kEGxvAdfiN5DGmozDmZ7sJyDuMgfxt4h4KujF7MWt5tQH8py",
				),
				dataset.expected3,
			);
		},
		[
			{ tx: unsignedNativeSegwitMusigRegistrationTx, expected1: true, expected2: true, expected3: true },
			{ tx: oneSignatureNativeSegwitMusigRegistrationTx, expected1: false, expected2: true, expected3: true },
			{ tx: twoSignatureNativeSegwitMusigRegistrationTx, expected1: false, expected2: false, expected3: true },
			{ tx: threeSignatureNativeSegwitMusigRegistrationTx, expected1: false, expected2: false, expected3: false },
		],
	);

	each(
		"needsWalletSignature for transfer",
		({ dataset }) => {
			const subject = new PendingMultiSignatureTransaction(dataset.tx, bitcoin.networks.testnet);
			assert.is(
				subject.needsWalletSignature(
					"Vpub5mtyU6Hx9xrx63Y3W4aGW1LuQkmwrq9xsQNgX7tDAM8DTHhE7vXMZ7Hue2FR8SMAGDW57fy76HFmN1jnckSmeX2cDMWVA1KViot6bLgJZuN",
				),
				dataset.expected1,
			);
			assert.is(
				subject.needsWalletSignature(
					"Vpub5mYgzMb93fDtChZ2xmY7g3aEgHFjdgQE6P596AiL5zENEcVjDCciGfWmhZJngn6gVmBRh6E1Vp7aZYY7wQkMRTQSKhauGwYAUEdiGbS35D1",
				),
				dataset.expected2,
			);
			assert.is(
				subject.needsWalletSignature(
					"Vpub5mSSLBPFi3acdjk5giwrmA7gXPAJsiLXXKibgjXYycH1gp95t2Pqv3U8dT9kEGxvAdfiN5DGmozDmZ7sJyDuMgfxt4h4KujF7MWt5tQH8py",
				),
				dataset.expected3,
			);
		},
		[
			{ tx: unsignedNativeSegwitMusigTransferTx, expected1: true, expected2: true, expected3: true },
			{ tx: oneSignatureNativeSegwitMusigTransferTx, expected1: false, expected2: true, expected3: true },
			{ tx: twoSignatureNativeSegwitMusigTransferTx, expected1: false, expected2: false, expected3: false },
			{ tx: threeSignatureNativeSegwitMusigTransferTx, expected1: false, expected2: false, expected3: false },
		],
	);

	each(
		"needsFinalSignature for musig registration",
		({ dataset }) => {
			const subject = new PendingMultiSignatureTransaction(dataset.tx, bitcoin.networks.testnet);
			assert.false(subject.needsFinalSignature());
		},
		[
			{ tx: unsignedNativeSegwitMusigRegistrationTx },
			{ tx: oneSignatureNativeSegwitMusigRegistrationTx },
			{ tx: twoSignatureNativeSegwitMusigRegistrationTx },
			{ tx: threeSignatureNativeSegwitMusigRegistrationTx },
			{ tx: unsignedNativeSegwitMusigTransferTx },
			{ tx: oneSignatureNativeSegwitMusigTransferTx },
			{ tx: twoSignatureNativeSegwitMusigTransferTx },
			{ tx: threeSignatureNativeSegwitMusigTransferTx },
		],
	);

	each(
		"remainingSignatureCount for musig registration",
		({ dataset }) => {
			const subject = new PendingMultiSignatureTransaction(dataset.tx, bitcoin.networks.testnet);
			assert.is(subject.remainingSignatureCount(), dataset.expected);
		},
		[
			{ tx: unsignedNativeSegwitMusigRegistrationTx, expected: 3 },
			{ tx: oneSignatureNativeSegwitMusigRegistrationTx, expected: 2 },
			{ tx: twoSignatureNativeSegwitMusigRegistrationTx, expected: 1 },
			{ tx: threeSignatureNativeSegwitMusigRegistrationTx, expected: 0 },
		],
	);

	each(
		"remainingSignatureCount for transfer",
		({ dataset }) => {
			const subject = new PendingMultiSignatureTransaction(dataset.tx, bitcoin.networks.testnet);
			assert.is(subject.remainingSignatureCount(), dataset.expected);
		},
		[
			{ tx: unsignedNativeSegwitMusigTransferTx, expected: 2 },
			{ tx: oneSignatureNativeSegwitMusigTransferTx, expected: 1 },
			{ tx: twoSignatureNativeSegwitMusigTransferTx, expected: 0 },
			{ tx: threeSignatureNativeSegwitMusigTransferTx, expected: 0 },
		],
	);
});
