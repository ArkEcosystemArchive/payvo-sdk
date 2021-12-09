import { describe } from "@payvo/sdk-test";
import { IoC, Services, Signatories } from "@payvo/sdk";
import { waitReady } from "@polkadot/wasm-crypto";

import { identity } from "../test/fixtures/identity";
import { createServiceAsync } from "../test/mocking";
import { BindingType } from "./constants";
import { createApiPromise, createKeyring } from "./factories";
import { ClientService } from "./client.service";
import { AddressService } from "./address.service";
import { KeyPairService } from "./key-pair.service";
import { PublicKeyService } from "./public-key.service";
import { TransactionService } from "./transaction.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

describe("TransactionService", async ({ beforeAll, assert, it, nock, loader }) => {
	beforeAll(async (context) => {
		nock.fake()
			.post("/", ({ method }) => method === "state_getRuntimeVersion")
			.reply(200, loader.json("test/fixtures/client/state-get-runtime-version.json"))
			.post("/", ({ method }) => method === "system_chain")
			.reply(200, loader.json("test/fixtures/client/system-chain.json"))
			.post("/", ({ method }) => method === "system_properties")
			.reply(200, loader.json("test/fixtures/client/system-properties.json"))
			.post("/", ({ method }) => method === "rpc_methods")
			.reply(200, loader.json("test/fixtures/client/rpc-methods.json"))
			.post("/", ({ method }) => method === "state_getMetadata")
			.reply(200, loader.json("test/fixtures/client/state-get-metadata.json"))
			.post("/", ({ method }) => method === "chain_getBlockHash")
			.reply(200, loader.json("test/fixtures/client/chain-get-block-hash.json"))
			.post("/", ({ method }) => method === "state_getStorage")
			.reply(200, loader.json("test/fixtures/client/state-get-storage.json"))
			.post("/", ({ method }) => method === "state_queryStorageAt")
			.reply(200, loader.json("test/fixtures/client/state-query-storage-at.json"))
			.post("/", ({ method }) => method === "chain_getHeader")
			.reply(200, loader.json("test/fixtures/client/chain-get-header.json"))
			.post("/", ({ method }) => method === "chain_getFinalizedHead")
			.reply(200, loader.json("test/fixtures/client/chain-get-finalized-head.json"))
			.persist();

		await waitReady();

		context.subject = await createServiceAsync(TransactionService, undefined, async (container) => {
			const apiPromise = await createApiPromise(container.get(IoC.BindingType.ConfigRepository));
			const keyring = createKeyring(container.get(IoC.BindingType.ConfigRepository));

			container.constant(IoC.BindingType.Container, container);
			container.constant(BindingType.ApiPromise, apiPromise);
			container.constant(BindingType.Keyring, keyring);
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

	it("#transfer should succeed", async (context) => {
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
				amount: 12345,
				to: identity.address,
			},
		});

		assert.instance(result, SignedTransactionData);
		assert.is(result.amount().toString(), "123450000000000");
	});
});
