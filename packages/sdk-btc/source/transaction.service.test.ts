import "jest-extended";
import { Services, Signatories } from "@payvo/sdk";
import nock from "nock";

import { IoC } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { TransactionService } from "./transaction.service";
import { BindingType } from "./constants";
import { AddressFactory } from "./address.factory";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { DataTransferObjects } from "./coin.dtos";

const mnemonic = "skin fortune security mom coin hurdle click emotion heart brisk exact reason";

let subject: TransactionService;

beforeEach(async () => {
	nock.disableNetConnect();

	subject = createService(TransactionService, "btc.testnet", async (container: IoC.Container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(BindingType.AddressFactory, AddressFactory);
	});
	nock("https://btc-test.payvo.com:443", { encodedQueryParams: true })
		.post("/api/wallets/transactions/unspent", { addresses: ["mv9pNZs3d65sjL68JueZDphWe3vHNmmSn6"] })
		.reply(
			200,
			'{"data":[{"address":"mv9pNZs3d65sjL68JueZDphWe3vHNmmSn6","txId":"3b182fedfbf8dca089b5ff97004e53081c6610a2eb08dd9bd8c3243a64216649","outputIndex":0,"script":"76a914a08a89d81d7a9be55a18d12f9808dcd572e2cd1c88ac","satoshis":1000000}],"links":{"first":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent?page=1","last":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent?page=1","prev":null,"next":null},"meta":{"current_page":1,"from":1,"last_page":1,"links":[{"url":null,"label":"&laquo; Previous","active":false},{"url":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent?page=1","label":"1","active":true},{"url":null,"label":"Next &raquo;","active":false}],"path":"https:\\/\\/btc-test.payvo.com\\/api\\/wallets\\/transactions\\/unspent","per_page":15,"to":1,"total":1}}',
		);
});

describe("Transfer", () => {
	it("should generate an output from a mnemonic (bip44)", async () => {
		// nock.recorder.rec();

		const signatory = new Signatories.Signatory(
			new Signatories.MnemonicSignatory({
				signingKey: mnemonic,
				address: identity.addressBIP44,
				publicKey: identity.publicKey,
				privateKey: identity.privateKey,
				options: {
					bip44: {
						account: 0,
					},
				},
			}),
		);
		const result = await subject.transfer({
			data: {
				amount: 0.001,
				to: "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn",
			},
			signatory,
		});

		console.log("result", result);
		// expect(Transactions.TransactionFactory.fromJson(result.data()).verify()).toBeTrue();
		expect(result.amount().toNumber()).toBe(100_000_000);
	});
});
