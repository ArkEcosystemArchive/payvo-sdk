import { assert, loader, test } from "@payvo/sdk-test";
import { IoC, Services } from "@payvo/sdk";
import {nock} from "@payvo/sdk-test";

import { createService } from "../test/mocking";
import { ClientService } from "./client.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

let subject;

test.before(async () => {
	nock.disableNetConnect();

	subject = await createService(ClientService, undefined, (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
	});
});

test.after.each(() => nock.cleanAll());

test.before(async () => {
	nock.disableNetConnect();
});

test("#wallet", async () => {
	nock.fake("https://api.testnet.eos.io")
		.post("/v1/chain/get_account")
		.reply(200, loader.json(`test/fixtures/client/wallet.json`));

	const result = await subject.wallet({
		type: "address",
		value: "bdfkbzietxos",
	});

	assert.instance(result, WalletData);
});

test.run();
