import { describe } from "@payvo/sdk-test";
import { IoC, Services, Signatories } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService, mockWallet } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { AddressService } from "./address.service.js";
import { ClientService } from "./client.service.js";
import { KeyPairService } from "./key-pair.service.js";
import { PublicKeyService } from "./public-key.service.js";
import { TransactionService } from "./transaction.service.js";
import { BindingType } from "./constants";

describe("AddressService", async ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(TransactionService, undefined, (container) => {
			container.constant(BindingType.Zilliqa, mockWallet());
			container.constant(IoC.BindingType.Container, container);
			container.constant(IoC.BindingType.DataTransferObjects, {
				SignedTransactionData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
			container.singleton(IoC.BindingType.AddressService, AddressService);
			container.singleton(IoC.BindingType.ClientService, ClientService);
			container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
			container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
		});
	});

	it("should create a transfer", async (context) => {
		const result = await context.subject.transfer({
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

		assert.instance(result, SignedTransactionData);
		assert.string(result.toBroadcast());
		assert.is(result.amount().toNumber(), 100_000_000_000_000);
	});
});
