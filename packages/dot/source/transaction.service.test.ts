import { describe } from "@payvo/sdk-test";
import { IoC, Services, Signatories } from "@payvo/sdk";
import { waitReady } from "@polkadot/wasm-crypto";

import { identity } from "../test/fixtures/identity";
import { createServiceAsync } from "../test/mocking";
import { BindingType } from "./constants";
import { createApiPromise, createKeyring } from "./factories";
import { ClientService } from "./client.service.js";
import { AddressService } from "./address.service.js";
import { KeyPairService } from "./key-pair.service.js";
import { PublicKeyService } from "./public-key.service.js";
import { TransactionService } from "./transaction.service.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";

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
			.post(
				"/",
				({ method, params }) =>
					method === "state_getStorage" &&
					params.includes("0xcec5070d609dd3497f72bde07fc96ba0e0cdd062e6eaf24295ad4ccfc41d4609"),
			)
			.reply(200, loader.json("test/fixtures/client/state-get-storage-1.json"))
			.post(
				"/",
				({ method, params }) =>
					method === "state_getStorage" &&
					params.includes(
						"0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9ff0f22492f44bac4c4b30ae58d0e8daa0000000000000000000000000000000000000000000000000000000000000000",
					),
			)
			.reply(200, loader.json("test/fixtures/client/state-get-storage-2.json"))
			.post(
				"/",
				({ method, params }) =>
					method === "state_getStorage" &&
					params.includes(
						"0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9dbe895af675627261e8a29886eb71d1fc0e7505bb4a5e539d7effbdb29347ad65075c4cdeb338486bfff9eabbcdb632d",
					),
			)
			.reply(200, loader.json("test/fixtures/client/state-get-storage-3.json"))
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
