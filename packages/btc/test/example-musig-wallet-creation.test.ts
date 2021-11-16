import "jest-extended";
import { jest } from "@jest/globals";

import { openTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import nock from "nock";
import { UUID } from "@payvo/sdk-cryptography";
import { musig } from "./fixtures/musig";
import { createServiceAsync } from "./mocking";
import { TransactionService } from "../source/transaction.service";
import { AddressService } from "../source/address.service";
import { ClientService } from "../source/client.service";
import { SignedTransactionData } from "../source/signed-transaction.dto";
import { ConfirmedTransactionData } from "../source/confirmed-transaction.dto";
import { WalletData } from "../source/wallet.dto";
import { ExtendedPublicKeyService } from "../source/extended-public-key.service";
import { FeeService } from "../source/fee.service";
import { LedgerService } from "../source/ledger.service";
import { MultiSignatureService } from "../source/multi-signature.service";
import { BindingType } from "../source/constants";
import { MultiSignatureSigner } from "../source/multi-signature.signer";
import { AddressFactory } from "../source/address.factory";
import { IoC, Services, Signatories } from "@payvo/sdk";

let subject: TransactionService;
let musigService: MultiSignatureService;

beforeEach(async () => {
	nock.disableNetConnect();

	subject = await createServiceAsync(TransactionService, "btc.testnet", async (container: IoC.Container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(IoC.BindingType.ExtendedPublicKeyService, ExtendedPublicKeyService);
		container.singleton(IoC.BindingType.FeeService, FeeService);
		container.constant(
			IoC.BindingType.LedgerTransportFactory,
			async () => await openTransportReplayer(RecordStore.fromString("")),
		);
		container.singleton(IoC.BindingType.LedgerService, LedgerService);
		container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
		container.singleton(BindingType.MultiSignatureSigner, MultiSignatureSigner);
		container.singleton(BindingType.AddressFactory, AddressFactory);
	});

	musigService = await createServiceAsync(MultiSignatureService, "btc.testnet", async (container: IoC.Container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(IoC.BindingType.ExtendedPublicKeyService, ExtendedPublicKeyService);
		container.singleton(IoC.BindingType.FeeService, FeeService);
		container.constant(
			IoC.BindingType.LedgerTransportFactory,
			async () => await openTransportReplayer(RecordStore.fromString("")),
		);
		container.singleton(IoC.BindingType.LedgerService, LedgerService);
		container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
		container.singleton(BindingType.MultiSignatureSigner, MultiSignatureSigner);
		container.singleton(BindingType.AddressFactory, AddressFactory);
	});
});

describe("example musig wallet creation and joining", () => {
	it("first cosigner should create a wallet and others join it", async () => {
		jest.spyOn(UUID, "random").mockReturnValueOnce("189f015c-2a58-4664-83f4-0b331fa9172a");

		// Wallet 1 creates the musig wallet and signs it
		const wallet1 = {
			signingKey: musig.accounts[0].mnemonic,
			publicKey: musig.accounts[0].legacyMasterPublicKey,
			path: musig.accounts[0].legacyMasterPath,
		};

		const transaction1 = await subject.multiSignature({
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: wallet1.signingKey,
					address: "address", // Not needed / used
					publicKey: wallet1.path, // TODO for now we use publicKey for passing path
					privateKey: "privateKey", // Not needed / used
				}),
			),
			data: {
				min: 2,
				numberOfSignatures: 3,
				publicKeys: [],
				derivationMethod: "legacyMusig",
			},
		});

		expect(transaction1).toBeInstanceOf(SignedTransactionData);
		expect(transaction1.id()).toBe("189f015c-2a58-4664-83f4-0b331fa9172a");
		expect(transaction1.data().senderPublicKey).toBe(wallet1.publicKey);
		expect(transaction1.data().multiSignature.publicKeys).toBeInstanceOf(Array);
		expect(transaction1.data().multiSignature.publicKeys[0]).toBe(wallet1.publicKey);
		expect(musigService.isMultiSignatureReady(transaction1)).toBeFalse();
		expect(musigService.needsFinalSignature(transaction1)).toBeFalse();
		expect(musigService.needsSignatures(transaction1)).toBeTrue();
		expect(musigService.needsAllSignatures(transaction1)).toBeTrue();
		expect(musigService.remainingSignatureCount(transaction1)).toBe(2);

		const wallet2 = {
			signingKey: musig.accounts[1].mnemonic,
			publicKey: musig.accounts[1].legacyMasterPublicKey,
			path: musig.accounts[1].legacyMasterPath,
		};

		const transaction2 = await musigService.addSignature(
			transaction1.data(),
			new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: wallet2.signingKey,
					address: "address", // Not needed / used
					publicKey: wallet2.path, // TODO really? We need a way to pass in the account path
					privateKey: "privateKey", // Not needed / used
				}),
			),
		);

		expect(transaction2).toBeInstanceOf(SignedTransactionData);
		expect(transaction2.data().senderPublicKey).toBe(wallet1.publicKey);
		expect(transaction2.data().multiSignature.publicKeys).toBeInstanceOf(Array);
		expect(transaction2.data().multiSignature.publicKeys[0]).toBe(wallet1.publicKey);
		expect(musigService.isMultiSignatureReady(transaction2)).toBeFalse();
		expect(musigService.needsFinalSignature(transaction2)).toBeFalse();
		expect(musigService.needsSignatures(transaction2)).toBeTrue();
		expect(musigService.needsAllSignatures(transaction2)).toBeTrue();
		expect(musigService.remainingSignatureCount(transaction2)).toBe(1);

		const wallet3 = {
			signingKey: musig.accounts[2].mnemonic,
			path: musig.accounts[2].legacyMasterPath,
		};

		const transaction3 = await musigService.addSignature(
			transaction2.data(),
			new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: wallet3.signingKey,
					address: "address", // Not needed / used
					publicKey: wallet3.path, // TODO really?
					privateKey: "privateKey", // Not needed / used
				}),
			),
		);

		expect(transaction3).toBeInstanceOf(SignedTransactionData);
		expect(transaction3.data().senderPublicKey).toBe(wallet1.publicKey);
		expect(transaction3.data().multiSignature.publicKeys).toBeInstanceOf(Array);
		expect(transaction3.data().multiSignature.publicKeys[0]).toBe(wallet1.publicKey);
		expect(musigService.isMultiSignatureReady(transaction3)).toBeTrue();
		expect(musigService.needsFinalSignature(transaction3)).toBeFalse();
		expect(musigService.needsSignatures(transaction3)).toBeFalse();
		expect(musigService.needsAllSignatures(transaction3)).toBeTrue();
		expect(musigService.remainingSignatureCount(transaction3)).toBe(0);
	});
});
