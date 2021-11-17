import "jest-extended";

import { IoC, Services, Signatories } from "@payvo/sdk";
import { waitReady } from "@polkadot/wasm-crypto";

import { identity } from "../test/fixtures/identity.js";
import { createServiceAsync } from "../test/mocking.js";
import { BindingType } from "./constants.js";
import { createApiPromise, createKeyring } from "./factories.js";
import { AddressService } from "./address.service.js";
import { KeyPairService } from "./key-pair.service.js";
import { PublicKeyService } from "./public-key.service.js";
import { TransactionService } from "./transaction.service.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";

let subject: TransactionService;

beforeAll(async () => {
	await waitReady();

	subject = await createServiceAsync(TransactionService, undefined, async (container: IoC.Container) => {
		const apiPromise = await createApiPromise(container.get(IoC.BindingType.ConfigRepository));
		const keyring = createKeyring(container.get(IoC.BindingType.ConfigRepository));

		container.constant(BindingType.ApiPromise, apiPromise);
		container.constant(BindingType.Keyring, keyring);

		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
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

describe("TransactionService", () => {
	describe("#transfer", () => {
		it.skip("should verify", async () => {
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
					amount: 12345,
					to: identity.address,
				},
			});

			expect(result).toBeInstanceOf(SignedTransactionData);
			expect(result.amount().toString()).toBe("123450000000000");
		});
	});
});
