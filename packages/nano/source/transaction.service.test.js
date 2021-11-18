import { assert, loader, test } from "@payvo/sdk-test";
import { IoC, Services, Signatories } from "@payvo/sdk";
import nock from "nock";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { KeyPairService } from "./key-pair.service";
import { PublicKeyService } from "./public-key.service";
import { TransactionService } from "./transaction.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

let subject;

test.before(async () => {
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

test.after.each(() => nock.cleanAll());

test.before(async () => {
	nock.disableNetConnect();
});

test("should sign transaction", async () => {
	nock("https://proxy.nanos.cc/")
		.post("/proxy")
		.reply(200, loader.json(`test/fixtures/client/account-info.json`));

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
			amount: 100,
			to: identity.address,
		},
	});

	assert.is(result instanceof SignedTransactionData);
	assert.is(result.amount().toString(), "100000000000000000000000000000000");
});

test.run();
