import "jest-extended";

import { IoC, Services } from "@payvo/sdk";
import nock from "nock";
import * as bitcoin from "bitcoinjs-lib";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";
import { MultiSignatureService } from "./multi-signature.service";
import { ClientService } from "./client.service";
import { MultiSignatureSigner } from "./multi-signature.signer";
import { KeyPairService } from "./key-pair.service";
import { LedgerService } from "./ledger.service";
import { PublicKeyService } from "./public-key.service";
import { AddressService } from "./address.service";
import { BindingType } from "./constants";
import {
	oneSignatureMusigRegistrationTx,
	oneSignatureTransferTx,
	threeSignatureMusigRegistrationTx,
	threeSignatureTransferTx,
	twoSignatureMusigRegistrationTx,
	twoSignatureTransferTx,
	unsignedMusigRegistrationTx,
	unsignedTransferTx,
} from "../test/fixtures/musig-txs";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";
import { PendingMultiSignatureTransaction } from "./multi-signature.transaction";

let subject: MultiSignatureService;

beforeAll(async () => {
	nock.disableNetConnect();

	subject = await createService(MultiSignatureService, "btc.testnet", (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(BindingType.MultiSignatureSigner, MultiSignatureSigner);
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		container.singleton(IoC.BindingType.LedgerService, LedgerService);
		container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
	});
});

afterEach(() => nock.cleanAll());

describe("MultiSignatureTransaction", () => {
	describe("#isMultiSignatureRegistration", () => {
		describe.each([
			{ tx: unsignedMusigRegistrationTx, expected: true },
			{ tx: oneSignatureMusigRegistrationTx, expected: true },
			{ tx: twoSignatureMusigRegistrationTx, expected: true },
			{ tx: threeSignatureMusigRegistrationTx, expected: true },
		])("for musig registration", ({ tx, expected }) => {
			test(` with ${tx.signatures.length} signatures`, () => {
				const subject = new PendingMultiSignatureTransaction(tx, bitcoin.networks.testnet);
				expect(subject.isMultiSignatureRegistration()).toBe(expected);
			});
		});

		describe.each([
			{ tx: unsignedTransferTx, expected: false },
			{ tx: oneSignatureTransferTx, expected: false },
			{ tx: twoSignatureTransferTx, expected: false },
			{ tx: threeSignatureTransferTx, expected: false },
		])("for transfer", ({ tx, expected }) => {
			test(` with ${tx.signatures.length} signatures`, () => {
				const subject = new PendingMultiSignatureTransaction(tx as any, bitcoin.networks.testnet);
				expect(subject.isMultiSignatureRegistration()).toBe(expected);
			});
		});
	});

	describe("#needsSignatures", () => {
		describe.each([
			{ tx: unsignedMusigRegistrationTx, expected: true },
			{ tx: oneSignatureMusigRegistrationTx, expected: true },
			{ tx: twoSignatureMusigRegistrationTx, expected: true },
			{ tx: threeSignatureMusigRegistrationTx, expected: false },
		])("for musig registration", ({ tx, expected }) => {
			test(` with ${tx.signatures.length} signatures`, () => {
				const subject = new PendingMultiSignatureTransaction(tx, bitcoin.networks.testnet);
				expect(subject.needsSignatures()).toBe(expected);
			});
		});

		describe.each([
			{ tx: unsignedTransferTx, expected: true },
			{ tx: oneSignatureTransferTx, expected: true },
			{ tx: twoSignatureTransferTx, expected: false },
			{ tx: threeSignatureTransferTx, expected: false },
		])("for transfer", ({ tx, expected }) => {
			test(` with ${tx.signatures.length} signatures`, () => {
				const subject = new PendingMultiSignatureTransaction(tx as any, bitcoin.networks.testnet);
				expect(subject.needsSignatures()).toBe(expected);
			});
		});
	});

	describe("#needsAllSignatures", () => {
		describe.each([
			{ tx: unsignedMusigRegistrationTx, expected: true },
			{ tx: oneSignatureMusigRegistrationTx, expected: true },
			{ tx: twoSignatureMusigRegistrationTx, expected: true },
			{ tx: threeSignatureMusigRegistrationTx, expected: true },
		])("for musig registration", ({ tx, expected }) => {
			test(` with ${tx.signatures.length} signatures`, () => {
				const subject = new PendingMultiSignatureTransaction(tx, bitcoin.networks.testnet);
				expect(subject.needsAllSignatures()).toBe(expected);
			});
		});

		describe.each([
			{ tx: unsignedTransferTx, expected: false },
			{ tx: oneSignatureTransferTx, expected: false },
			{ tx: twoSignatureTransferTx, expected: false },
			{ tx: threeSignatureTransferTx, expected: false },
		])("for transfer", ({ tx, expected }) => {
			test(` with ${tx.signatures.length} signatures`, () => {
				const subject = new PendingMultiSignatureTransaction(tx as any, bitcoin.networks.testnet);
				expect(subject.needsAllSignatures()).toBe(expected);
			});
		});
	});

	describe("#isMultiSignatureReady", () => {
		describe.each([
			{ tx: unsignedMusigRegistrationTx, expected: false },
			{ tx: oneSignatureMusigRegistrationTx, expected: false },
			{ tx: twoSignatureMusigRegistrationTx, expected: false },
			{ tx: threeSignatureMusigRegistrationTx, expected: true },
		])("for musig registration", ({ tx, expected }) => {
			test(` with ${tx.signatures.length} signatures`, () => {
				const subject = new PendingMultiSignatureTransaction(tx, bitcoin.networks.testnet);
				expect(subject.isMultiSignatureReady()).toBe(expected);
			});
		});

		describe.each([
			{ tx: unsignedTransferTx, expected: false },
			{ tx: oneSignatureTransferTx, expected: false },
			{ tx: twoSignatureTransferTx, expected: true },
			{ tx: threeSignatureTransferTx, expected: true },
		])("for transfer", ({ tx, expected }) => {
			test(` with ${tx.signatures.length} signatures`, () => {
				const subject = new PendingMultiSignatureTransaction(tx as any, bitcoin.networks.testnet);
				expect(subject.isMultiSignatureReady()).toBe(expected);
			});
		});
	});

	describe("#needsWalletSignature", () => {
		describe.each([
			{ tx: unsignedMusigRegistrationTx, expected: false },
			{ tx: oneSignatureMusigRegistrationTx, expected: false },
			{ tx: twoSignatureMusigRegistrationTx, expected: false },
			{ tx: threeSignatureMusigRegistrationTx, expected: true },
		])("for musig registration", ({ tx, expected }) => {
			test(` with ${tx.signatures.length} signatures`, () => {
				const subject = new PendingMultiSignatureTransaction(tx, bitcoin.networks.testnet);
				expect(
					subject.needsWalletSignature("0277ff9d72486136c7ee68abd46b13d3c1cef1b79f5604cdafafca0d880851bd73"),
				).toBe(expected);
			});
		});

		describe.each([
			{ tx: unsignedTransferTx, expected: false },
			{ tx: oneSignatureTransferTx, expected: false },
			{ tx: twoSignatureTransferTx, expected: true },
			{ tx: threeSignatureTransferTx, expected: true },
		])("for transfer", ({ tx, expected }) => {
			test(` with ${tx.signatures.length} signatures`, () => {
				const subject = new PendingMultiSignatureTransaction(tx as any, bitcoin.networks.testnet);
				expect(
					subject.needsWalletSignature("0277ff9d72486136c7ee68abd46b13d3c1cef1b79f5604cdafafca0d880851bd73"),
				).toBe(expected);
			});
		});
	});

	describe("#needsFinalSignature", () => {
		describe.each([
			{ tx: unsignedMusigRegistrationTx },
			{ tx: oneSignatureMusigRegistrationTx },
			{ tx: twoSignatureMusigRegistrationTx },
			{ tx: threeSignatureMusigRegistrationTx },
			{ tx: unsignedTransferTx },
			{ tx: oneSignatureTransferTx },
			{ tx: twoSignatureTransferTx },
			{ tx: threeSignatureTransferTx },
		])("for musig registration", ({ tx }) => {
			test(` with ${tx.signatures.length} signatures`, () => {
				const subject = new PendingMultiSignatureTransaction(tx as any, bitcoin.networks.testnet);
				expect(subject.needsFinalSignature()).toBeFalse();
			});
		});
	});

	describe("#remainingSignatureCount", () => {
		describe.each([
			{ tx: unsignedMusigRegistrationTx, expected: 3 },
			{ tx: oneSignatureMusigRegistrationTx, expected: 2 },
			{ tx: twoSignatureMusigRegistrationTx, expected: 1 },
			{ tx: threeSignatureMusigRegistrationTx, expected: 0 },
		])("for musig registration", ({ tx, expected }) => {
			test(` with ${tx.signatures.length} signatures`, () => {
				const subject = new PendingMultiSignatureTransaction(tx, bitcoin.networks.testnet);
				expect(subject.remainingSignatureCount()).toBe(expected);
			});
		});

		describe.each([
			{ tx: unsignedTransferTx, expected: 2 },
			{ tx: oneSignatureTransferTx, expected: 1 },
			{ tx: twoSignatureTransferTx, expected: 0 },
			{ tx: threeSignatureTransferTx, expected: 0 },
		])("for transfer", ({ tx, expected }) => {
			test(` with ${tx.signatures.length} signatures`, () => {
				const subject = new PendingMultiSignatureTransaction(tx as any, bitcoin.networks.testnet);
				expect(subject.remainingSignatureCount()).toBe(expected);
			});
		});
	});
});
