import { IoC, Services, Signatories, Test } from "@payvo/sdk";
import nock from "nock";

import { identity } from "../test/fixtures/identity";
import { createService, requireModule } from "../test/mocking";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { KeyPairService } from "./key-pair.service";
import { PublicKeyService } from "./public-key.service";
import { TransactionService } from "./transaction.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

let subject: TransactionService;

beforeAll(async () => {
	subject = await createService(TransactionService, undefined, (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
	});
});

afterEach(() => nock.cleanAll());

beforeAll(async () => {
	nock.disableNetConnect();
});

describe("TransactionService", () => {
	describe("#transfer", () => {
		it("should verify", async () => {
			nock("https://horizon-testnet.stellar.org")
				.get("/accounts/GCGYSPQBSQCJKNDXDISBSXAM3THK7MACUVZGEMXF6XRZCPGAWCUGXVNC")
				.query(true)
				.reply(200, requireModule(`../test/fixtures/client/wallet.json`));

			const result = await subject.transfer({
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey: identity.mnemonic,
						address: identity.address,
						publicKey: identity.publicKey,
						privateKey: identity.privateKey,
					}),
				),
				data: {
					amount: 1,
					to: identity.address,
				},
			});

			expect(result).toBeObject();
			expect(result.amount().toNumber()).toBe(10_000_000);
		});
	});
});
