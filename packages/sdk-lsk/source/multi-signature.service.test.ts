import "jest-extended";

import { IoC, Services, Signatories } from "@payvo/sdk";
import nock from "nock";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { DataTransferObjects } from "./coin.dtos";
import { AddressService } from "./address.service";
import { ClientService } from "./client-three.service";
import { KeyPairService } from "./key-pair.service";
import { LedgerService } from "./ledger.service";
import { PublicKeyService } from "./public-key.service";
import { TransactionService } from "./transaction-three.service";
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

	subject = createService(TransactionService, "lsk.testnet", (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
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
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		container.singleton(IoC.BindingType.LedgerService, LedgerService);
		container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
		container.singleton(BindingType.AssetSerializer, AssetSerializer);
		container.singleton(BindingType.TransactionSerializer, TransactionSerializer);
	});

	jest.spyOn(DateTime, "make").mockReturnValue(DateTime.make("2021-01-01 12:00:00"));
});

describe("MultiSignatureService", () => {
	test("#addSignture", async () => {
		nock(/.+/)
			.get("/api/v2/accounts")
			.query({ address: "lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p" })
			.reply(200, require(`${__dirname}/../test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
			.get("/api/v2/accounts")
			.query({ publicKey: "ac574896c846b59477a9115b952563938c48d0096b84846c0b634a621e1774ed" })
			.reply(200, require(`${__dirname}/../test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`));

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
	});
});
