import "jest-extended";

import nock from "nock";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { WalletDiscoveryService } from "./wallet-discovery.service";
import { BindingType } from "./constants";
import { AddressFactory } from "./address.factory";

let subject: WalletDiscoveryService;

beforeAll(async () => {
	nock.disableNetConnect();

	subject = createService(WalletDiscoveryService, "btc.testnet", (container) => {
		container.singleton(BindingType.AddressFactory, AddressFactory)
	});
});

describe("WalletDiscoveryService", () => {
	it("should generate an output from a mnemonic", async () => {
		console.log(identity.mnemonic);
		const result = await subject.fromMnemonic(identity.mnemonic);

		expect(result).toBeArrayOfSize(3);
		expect(result[0]).toEqual({"address": "n2qGdjfjmFyvAXqbErrtXpfypXhtbNWruM", "path": "m/44'/1'/0'/0/0", "type": "bip44"});
		expect(result[1]).toEqual({"address": "2N5Hnn7HAizAwizSUXsMtoGnBNuXdMxDzBt", "path": "m/49'/1'/0'/0/0", "type": "bip49"});
		expect(result[2]).toEqual({"address": "tb1qdyxry6tza2sflfzlr8w6m65873thva724yjlmw", "path": "m/84'/1'/0'/0/0", "type": "bip84"});
	});
});
