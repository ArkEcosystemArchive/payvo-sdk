import { describe } from "@payvo/sdk-test";
import { IoC, Services, Signatories } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { ClientService } from "./client.service";
import { AddressService } from "./address.service";
import { KeyPairService } from "./key-pair.service";
import { PublicKeyService } from "./public-key.service";
import { TransactionService } from "./transaction.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

describe("TransactionService", async ({ assert, beforeAll, it, nock, loader }) => {
	beforeAll(async (context) => {
		context.subject = await createService(TransactionService, undefined, (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.constant(IoC.BindingType.DataTransferObjects, {
				SignedTransactionData,
				ConfirmedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
			container.singleton(IoC.BindingType.ClientService, ClientService);
			container.singleton(IoC.BindingType.AddressService, AddressService);
			container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
			container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
		});
	});

	it("#transfer", async (context) => {
		nock.fake()
			.post("/ext/bc/X", ({ method }) => method === "avm.getUTXOs")
			.reply(200, loader.json("test/fixtures/client/avm-get-utxos.json"))
			.post("/ext/bc/X", ({ method }) => method === "avm.getAssetDescription")
			.reply(200, loader.json("test/fixtures/client/avm-get-asset-description.json"));

		const result = await context.subject.transfer({
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

		assert.instance(result, SignedTransactionData);
		assert.is(result.amount().toHuman(), 1);
	});
});
