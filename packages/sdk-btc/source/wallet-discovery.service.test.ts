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
		container.singleton(BindingType.AddressFactory, AddressFactory);
	});
});

describe("WalletDiscoveryService", () => {
	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		expect(result).toBeArrayOfSize(3);
		expect(result[0]).toEqual({
			address: "n2qGdjfjmFyvAXqbErrtXpfypXhtbNWruM",
			path: "m/44'/1'/0'/0/0",
			type: "bip44",
		});
		expect(result[1]).toEqual({
			address: "2N5Hnn7HAizAwizSUXsMtoGnBNuXdMxDzBt",
			path: "m/49'/1'/0'/0/0",
			type: "bip49",
		});
		expect(result[2]).toEqual({
			address: "tb1qdyxry6tza2sflfzlr8w6m65873thva724yjlmw",
			path: "m/84'/1'/0'/0/0",
			type: "bip84",
		});
	});
	it("should generate an output from a mnemonic for specific paths for each addressing schema", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic, {
			bip44: {
				account: 1,
				change: 0,
				addressIndex: 3,
			},
			bip49: {
				account: 1,
				change: 1,
				addressIndex: 2,
			},
			bip84: {
				account: 1,
				change: 0,
				addressIndex: 4,
			}
		});

		expect(result).toBeArrayOfSize(3);
		expect(result[0]).toEqual({"address": "mgG73hJV966H8j4m3Ltbcikqh8j1mQXiWH", "path": "m/44'/1'/1'/0/3", "type": "bip44"});
		expect(result[1]).toEqual({"address": "2MyfuuAKVRCZFa5RvqDZ3H9ckUjzRkSXq6R", "path": "m/49'/1'/1'/0/2", "type": "bip49"});
		expect(result[2]).toEqual({"address": "tb1q26un8dvdan9kpvlyqn049jkhljhmckewkm9haz", "path": "m/84'/1'/1'/0/4", "type": "bip84"});
	});
});
