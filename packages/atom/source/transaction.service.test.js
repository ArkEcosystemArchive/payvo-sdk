import { describe, loader } from "@payvo/sdk-test";
import { IoC, Services, Signatories } from "@payvo/sdk";
import { nock } from "@payvo/sdk-test";

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

describe("TransactionService", async ({ beforeAll, assert, it }) => {
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

	it("#transfer should succeed", async () => {
		nock.fake("https://stargate.cosmos.network")
			.get("/auth/accounts/cosmos1wqus3z856rwadvum3l0lg0nl4sc957vq0wn8d0")
			.reply(200, loader.json(`test/fixtures/client/wallet.json`))
			.get("/bank/balances/cosmos1wqus3z856rwadvum3l0lg0nl4sc957vq0wn8d0")
			.reply(200, loader.json(`test/fixtures/client/wallet-balance.json`));

		const result = await subject.transfer({
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
					address: "cosmos1wqus3z856rwadvum3l0lg0nl4sc957vq0wn8d0",
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				amount: 1,
				to: "cosmos1wqus3z856rwadvum3l0lg0nl4sc957vq0wn8d0",
			},
		});

		assert.object(result);
	});
});
