import { IoC, Services, Signatories } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity.js";
import { createService, mockWallet } from "../test/mocking.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { AddressService } from "./address.service.js";
import { ClientService } from "./client.service.js";
import { KeyPairService } from "./key-pair.service.js";
import { PublicKeyService } from "./public-key.service.js";
import { TransactionService } from "./transaction.service.js";
import { BindingType } from "./constants.js";

let subject: TransactionService;

beforeAll(async () => {
	subject = await createService(TransactionService, undefined, (container) => {
		container.constant(BindingType.Zilliqa, mockWallet());
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
	});
});

describe("TransactionService", () => {
	describe("#transfer", () => {
		it("should sign transaction", async () => {
			const result = await subject.transfer({
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey: identity.mnemonic,
						address: identity.bech32Address,
						publicKey: identity.publicKey,
						privateKey: identity.privateKey,
					}),
				),
				data: {
					amount: 100,
					to: identity.bech32Address,
				},
				fee: 2000,
				feeLimit: 50,
				nonce: "1",
			});

			assert.is(result instanceof SignedTransactionData);
			assert.is(typeof result.toBroadcast(), "string");
			assert.is(result.amount().toNumber(), 100_000_000_000_000);
		});
	});
});
