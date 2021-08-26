import "jest-extended";
import { Services, Signatories } from "@payvo/sdk";

import { IoC } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { TransactionService } from "./transaction.service";
import { BindingType } from "./constants";
import { AddressFactory } from "./address.factory";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { DataTransferObjects } from "./coin.dtos";

let subject: TransactionService;

beforeEach(async () => {
	subject = createService(TransactionService, "btc.testnet", async (container: IoC.Container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(BindingType.AddressFactory, AddressFactory);
	});
});

describe("Transfer", () => {
	describe("#fromMnemonic", () => {
		it("should generate an output from a mnemonic (BIP44)", async () => {
			const signatory = new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: identity.mnemonic,
					address: identity.addressBIP44,
					publicKey: identity.publicKey,
					privateKey: identity.privateKey,
				}),
			);
			const result = await subject.transfer({
				data: {
					amount: 1000,
					to: "",
				},
				signatory,
			});

			console.log("result", result);
			// expect(result.type).toBe("bip44");
			// expect(result.address).toBe("1PLDRLacEkAaaiWnfojVDb5hWpwXvKJrRa");
			// expect(result.path).toBe("m/44'/0'/0'/0/0");
		});
	});
});
