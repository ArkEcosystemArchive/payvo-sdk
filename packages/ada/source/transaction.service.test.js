import { assert, loader, test } from "@payvo/sdk-test";
import { IoC, Services, Signatories } from "@payvo/sdk";
import {nock} from "@payvo/sdk-test";

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

test("#transfer", async () => {
	nock.fake(/.+/)
		.post("/")
		.reply(200, loader.json(`test/fixtures/transaction/transactions-page-1.json`))
		.post("/")
		.reply(200, loader.json(`test/fixtures/transaction/transactions-page-2.json`))
		.post("/")
		.reply(200, loader.json(`test/fixtures/transaction/utxos.json`))
		.post("/")
		.reply(200, loader.json(`test/fixtures/transaction/expiration.json`));

	const result = await subject.transfer({
		signatory: new Signatories.Signatory(
			new Signatories.MnemonicSignatory({
				signingKey:
					"excess behave track soul table wear ocean cash stay nature item turtle palm soccer lunch horror start stumble month panic right must lock dress",
				address:
					"aec30330deaecdd7503195a0d730256faef87027022b1bdda7ca0a61bca0a55e4d575af5a93bdf4905a3702fadedf451ea584791d233ade90965d608bac57304",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		),
		data: {
			amount: 1,
			to: "addr_test1qpz03ezdyda8ag724zp3n5fqulay02dp7j9mweyeylcaapsxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknscw3xw7",
		},
	});

	assert.instance(result, SignedTransactionData);
	assert.is(result.id(), "e2e75b04c4b1dc4d4b3db14166fb02cb26f5b9ed3c49b1e1c8379a21502dc77c");
	assert.is(result.amount().toString(), "1000000");
});

test.run();
