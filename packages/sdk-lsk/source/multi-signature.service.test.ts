import "jest-extended";

import { jest } from "@jest/globals";
import { IoC, Services, Signatories } from "@payvo/sdk";
import nock from "nock";

import { identity } from "../test/fixtures/identity";
import { createService, require } from "../test/mocking";
import { DataTransferObjects } from "./coin.dtos";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { FeeService } from "./fee.service";
import { KeyPairService } from "./key-pair.service";
import { LedgerService } from "./ledger.service";
import { PublicKeyService } from "./public-key.service";
import { TransactionService } from "./transaction.service";
import { MultiSignatureService } from "./multi-signature.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { TransactionSerializer } from "./transaction.serializer";
import { BindingType } from "./coin.contract";
import { AssetSerializer } from "./asset.serializer";
import { DateTime } from "@payvo/intl";

let subject: TransactionService;
let musig: MultiSignatureService;

beforeAll(async () => {
	nock.disableNetConnect();

	subject = await createService(TransactionService, "lsk.testnet", (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(IoC.BindingType.FeeService, FeeService);
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		container.singleton(IoC.BindingType.LedgerService, LedgerService);
		container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
		container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
		container.singleton(BindingType.AssetSerializer, AssetSerializer);
		container.singleton(BindingType.TransactionSerializer, TransactionSerializer);
	});

	musig = createService(MultiSignatureService, "lsk.testnet", (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(IoC.BindingType.FeeService, FeeService);
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		container.singleton(IoC.BindingType.LedgerService, LedgerService);
		container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
		container.singleton(BindingType.AssetSerializer, AssetSerializer);
		container.singleton(BindingType.TransactionSerializer, TransactionSerializer);
	});

	jest.spyOn(DateTime, "make").mockReturnValue(DateTime.make("2021-01-01 12:00:00"));
});

describe("MultiSignatureService", () => {
	const wallet1 = {
		signingKey: "foil broccoli rare pony man umbrella visual cram wing rotate fall never",
		address: "lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p",
		publicKey: "ac574896c846b59477a9115b952563938c48d0096b84846c0b634a621e1774ed",
	};

	const wallet2 = {
		signingKey: "penalty name learn right reason inherit peace mango guitar heart nature love",
		address: "lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a",
		publicKey: "5f7f98c50575a4a7e70a46ff35b72f4fe2a1ad3bc9a918b692d132d9c556bdf0",
	};

	beforeAll(async () => {
		nock(/.+/)
			.get("/api/v2/accounts")
			.query({ address: "lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p" })
			.reply(200, await require(`../test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
			.get("/api/v2/accounts")
			.query({ publicKey: "ac574896c846b59477a9115b952563938c48d0096b84846c0b634a621e1774ed" })
			.reply(200, await require(`../test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
			.persist();
	});

	it("should add signature", async () => {
		const transaction1 = await subject.transfer({
			fee: 10,
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: wallet1.signingKey,
					address: wallet1.address,
					publicKey: wallet1.publicKey,
					privateKey: identity.privateKey,
				}),
			),
			data: {
				amount: 1,
				to: wallet1.address,
			},
		});

		expect(transaction1).toBeInstanceOf(SignedTransactionData);
		expect(transaction1).toMatchSnapshot();

		expect(musig.isMultiSignatureReady(transaction1)).toBeFalse();
		expect(musig.needsSignatures(transaction1)).toBeTrue();
		expect(musig.needsAllSignatures(transaction1)).toBeTrue();
		expect(musig.getValidMultiSignatures(transaction1)).toEqual([wallet1.publicKey]);
		expect(musig.remainingSignatureCount(transaction1)).toBe(1);

		const transaction2 = await musig.addSignature(
			transaction1.data(),
			new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: wallet2.signingKey,
					address: wallet2.address,
					publicKey: wallet2.publicKey,
					privateKey: identity.privateKey,
				}),
			),
		);

		expect(transaction2).toBeInstanceOf(SignedTransactionData);
		expect(transaction2).toMatchSnapshot();

		expect(musig.isMultiSignatureReady(transaction2)).toBeTrue();
		expect(musig.needsSignatures(transaction2)).toBeFalse();
		expect(musig.needsAllSignatures(transaction2)).toBeFalse();
		expect(musig.getValidMultiSignatures(transaction2)).toEqual([wallet1.publicKey, wallet2.publicKey]);
		expect(musig.remainingSignatureCount(transaction2)).toBe(0);
	});

	it("should broadcast", async () => {
		nock(/.+/)
			.post("/")
			.reply(200, {
				result: { id: "384b0438-36c0-4437-a35b-a8135cbba17d" },
			});

		const transaction1 = await subject.transfer({
			fee: 10,
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: wallet1.signingKey,
					address: wallet1.address,
					publicKey: wallet1.publicKey,
					privateKey: identity.privateKey,
				}),
			),
			data: {
				amount: 1,
				to: wallet1.address,
			},
		});

		const transaction2 = await musig.addSignature(
			transaction1.data(),
			new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: wallet2.signingKey,
					address: wallet2.address,
					publicKey: wallet2.publicKey,
					privateKey: identity.privateKey,
				}),
			),
		);

		await expect(musig.broadcast(transaction2.data())).resolves.toEqual({
			accepted: ["384b0438-36c0-4437-a35b-a8135cbba17d"],
			errors: {},
			rejected: [],
		});
	});
});
