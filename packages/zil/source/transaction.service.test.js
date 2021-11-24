import { describe } from "@payvo/sdk-test";
import { IoC, Services, Signatories } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService, mockWallet } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { KeyPairService } from "./key-pair.service";
import { PublicKeyService } from "./public-key.service";
import { TransactionService } from "./transaction.service";
import { BindingType } from "./constants";

let subject;

describe("AddressService", async ({ assert, beforeEach, it }) => {
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

it("#transfer", async () => {
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

	assert.instance(result, SignedTransactionData);
	assert.string(result.toBroadcast());
	assert.is(result.amount().toNumber(), 100_000_000_000_000);
});
});
