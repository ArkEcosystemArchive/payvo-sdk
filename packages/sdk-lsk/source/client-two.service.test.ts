import "jest-extended";

import { DTO, IoC, Services } from "@payvo/sdk";
import nock from "nock";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";
import { WalletData } from "./wallet.dto";
import { DataTransferObjects } from "./coin.dtos";
import { ClientService } from "./client-two.service";
import { ConfirmedTransactionData } from "./transaction.dto";

let subject: ClientService;

beforeAll(() => {
	nock.disableNetConnect();

	subject = createService(ClientService, "lsk.mainnet", (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
	});
});

beforeAll(() => {
	nock.disableNetConnect();
});

describe("ClientService", () => {
	describe("#transaction", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/transactions?id=15562133894377717094")
				.reply(200, require(`${__dirname}/../test/fixtures/client/two/transaction.json`));

			const result = await subject.transaction("15562133894377717094");

			expect(result).toBeInstanceOf(ConfirmedTransactionData);
		});
	});

	describe("#transactions", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/transactions")
				.query(true)
				.reply(200, require(`${__dirname}/../test/fixtures/client/two/transactions.json`));

			const result = await subject.transactions({ address: "6566229458323231555L" });

			expect(result).toBeObject();
			expect(result.items()[0]).toBeInstanceOf(ConfirmedTransactionData);
		});
	});

	describe("#wallet", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/accounts?address=6566229458323231555L")
				.reply(200, require(`${__dirname}/../test/fixtures/client/two/wallet.json`));

			const result = await subject.wallet("6566229458323231555L");

			expect(result).toBeInstanceOf(WalletData);
		});
	});

	describe("#wallets", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/accounts?address=6566229458323231555L")
				.reply(200, require(`${__dirname}/../test/fixtures/client/two/wallets.json`));

			const result = await subject.wallets({ address: "6566229458323231555L" });

			expect(result).toBeObject();
			expect(result.items()[0]).toBeInstanceOf(WalletData);
		});
	});

	describe("#delegate", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/delegates?username=cc001")
				.reply(200, require(`${__dirname}/../test/fixtures/client/two/delegate.json`));

			const result = await subject.delegate("cc001");

			expect(result).toBeInstanceOf(WalletData);
		});
	});

	describe("#delegates", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/delegates")
				.query(true)
				.reply(200, require(`${__dirname}/../test/fixtures/client/two/delegates.json`));

			const result = await subject.delegates();

			expect(result).toBeObject();
			expect(result.items()[0]).toBeInstanceOf(WalletData);
		});
	});

	describe("#votes", () => {
		it("should succeed", async () => {
			nock(/.+/)
				.get("/api/votes")
				.query(true)
				.reply(200, require(`${__dirname}/../test/fixtures/client/two/votes.json`));

			const result = await subject.votes("6566229458323231555L");

			expect(result).toBeObject();
			expect(result.used).toBe(101);
			expect(result.available).toBe(0);
			expect(result.votes).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "amount": 0,
			    "id": "b7633636a88ba1ce8acd98aa58b4a9618650c8ab860c167be6f8d78404265bae",
			  },
			  Object {
			    "amount": 0,
			    "id": "fc4f231b00f72ba93a4778890c5d2b89d3f570e606c04619a0343a3cdddf73c7",
			  },
			  Object {
			    "amount": 0,
			    "id": "ea613be11a264b5775e985b9d7d40f836a74bd181a1855de218ee849efa3b1fe",
			  },
			  Object {
			    "amount": 0,
			    "id": "abf9787621f8f43ec4e4a645b515094f42fc5615f2e231eca24eaf6e69dc6a65",
			  },
			  Object {
			    "amount": 0,
			    "id": "7ac9d4b708fb19eaa200eb883be56601ddceed96290a3a033114750b7fda9d0b",
			  },
			  Object {
			    "amount": 0,
			    "id": "5fb6b29846e95c88d464e003c835ca4f88260eaa57cd8deded8fc8038dfcbc60",
			  },
			  Object {
			    "amount": 0,
			    "id": "8a78340976359a3125139af30f0fb82bc49a0708691ef4f29700c326f02a1519",
			  },
			  Object {
			    "amount": 0,
			    "id": "cdcba9e30dfd559bdc217fbc5674007927ef68d443650ba804a67d41bf05a1b7",
			  },
			  Object {
			    "amount": 0,
			    "id": "8ab0b8b0e663d49c8aaf3a8a6d75a46b477455f9d25ac92898461164c31758ee",
			  },
			  Object {
			    "amount": 0,
			    "id": "dd786687dd2399605ce8fe70212d078db1a2fc6effba127defb176a004cec6d4",
			  },
			  Object {
			    "amount": 0,
			    "id": "36f1c2ac9b765e0162e34d8b1b8131dce9875422dec778f7447f4b4dbd3a0242",
			  },
			  Object {
			    "amount": 0,
			    "id": "e50137b28121e786f3730c4585d6ae919505b97b397b433442e4de29efce3412",
			  },
			  Object {
			    "amount": 0,
			    "id": "0035cb5cd9c310f79e808042bcf9cda24c1d55b83a535345808042c98fb0a456",
			  },
			  Object {
			    "amount": 0,
			    "id": "55a43c0ec83565c71b46a0d279dc16d943c5ec51530c0bf968df63c0678ba2bd",
			  },
			  Object {
			    "amount": 0,
			    "id": "0ff7c51065f0a0a1ba34f9febcb72f204b72f69239b3dfc00d212745990492fe",
			  },
			  Object {
			    "amount": 0,
			    "id": "a56255b9c56fccafdf18a475e4f83c159bfd45ba90cd15de3c941f684fe6a5ec",
			  },
			  Object {
			    "amount": 0,
			    "id": "828beee8b6e2a1e5698a4eb17aa0b557299bd35beea5ecce49c678135a152ebd",
			  },
			  Object {
			    "amount": 0,
			    "id": "d7b740bcc5bdfb4c8e2ec6140770c5b9c7b4f9f3311fcc9a62b988a28bf9e0a8",
			  },
			  Object {
			    "amount": 0,
			    "id": "89e24cffc906013611954d1607813feb8c8d56568c5043929bd1dc4ed5f4c4f5",
			  },
			  Object {
			    "amount": 0,
			    "id": "0d6fac29846ff5b56c1db6ff9af4d0c6104967579fcb51cd4b7aadfcc568da2e",
			  },
			  Object {
			    "amount": 0,
			    "id": "d7fc3a6fd380e9d669c4fceb5bf2a4abf6619e82cd41f252a2e828996e30ec1f",
			  },
			  Object {
			    "amount": 0,
			    "id": "80400ce87828250b202a75f7a15a039dc06bca0edbf5f2dbabc43728bd8ed958",
			  },
			  Object {
			    "amount": 0,
			    "id": "18b4a5dbb809279ac51e17669c903e21dca2561b90aab96dcc172578a255d925",
			  },
			  Object {
			    "amount": 0,
			    "id": "537c9c4e1265fea1c05b5a6b32436ba05c1c32762f7240d81c72d5558f5458ca",
			  },
			  Object {
			    "amount": 0,
			    "id": "2440a4afc9a31dfe3e888aa1cf776af136124be946ff22a58166aaeae66ef355",
			  },
			  Object {
			    "amount": 0,
			    "id": "09383659c86795111ac0f59a8157280ad1b06ab2b3089d18a3d327984cedef65",
			  },
			  Object {
			    "amount": 0,
			    "id": "8495e7d37619f35ea010e1e71260336ea90dab4cb2f45874c590670c6b6cd309",
			  },
			  Object {
			    "amount": 0,
			    "id": "54066d888a2a3f7aee4631ca1c1583486bef53d28c6a05f2eb67cad91d4599e8",
			  },
			  Object {
			    "amount": 0,
			    "id": "4df5f86b88e474af48898054ea551501777370f98fbfe6d51a544793a44b57d5",
			  },
			  Object {
			    "amount": 0,
			    "id": "584943b6eb00853b785c06669a4b4edb259be0e51f4423fe048e0436001a0b8e",
			  },
			  Object {
			    "amount": 0,
			    "id": "09e50cbc812b84ab93198aabb2dd51e25c8cf5a530e022277917479f7069bda3",
			  },
			  Object {
			    "amount": 0,
			    "id": "29267ef3cc26aa4be4cc303bbba34cd8e8bed786257e2005fd29ea32865254b4",
			  },
			  Object {
			    "amount": 0,
			    "id": "4f12f49ee704d8554dc3dc392ba3ecf7a6e6f700b291fd77f75181cb48e34ad6",
			  },
			  Object {
			    "amount": 0,
			    "id": "81c9e56143972eedb42b42b438c43785bb735174ee3b33b2533b3a64541d7884",
			  },
			  Object {
			    "amount": 0,
			    "id": "03a724e5eb2610247607dc37614d72f15efe92de7c8cc06a717f1c9b22bf0c90",
			  },
			  Object {
			    "amount": 0,
			    "id": "3bc7df82bd5438421c1fe4cf6007b08f14201523528b3df290cdff1b04154a20",
			  },
			  Object {
			    "amount": 0,
			    "id": "f893611a9aea20301d1f72bb326d4fed4901b94e9978e606230f3c91a0723164",
			  },
			  Object {
			    "amount": 0,
			    "id": "7e36ff8680c06482ac89b0e69462e6428030bb31390ceeba684c8ac15227b4c8",
			  },
			  Object {
			    "amount": 0,
			    "id": "055d765a22911d96386d808d14dad6f62de2472410fa9da99a39e1c2ed6ce77c",
			  },
			  Object {
			    "amount": 0,
			    "id": "7ad7696571a48328c2583623c4c9b3acd1a89efd2d1aa5121d792d7e91c65881",
			  },
			  Object {
			    "amount": 0,
			    "id": "ab9f0ef5f1f7623d1facbb1fa727495dfae60cc622ced781eedeb16d80eab621",
			  },
			  Object {
			    "amount": 0,
			    "id": "83e42508f79bdd2325a82a2385814c322099ece54739c8344e32679a4e3f3c39",
			  },
			  Object {
			    "amount": 0,
			    "id": "7059775c4a49d7f7e871baee97bfc6dacf4331514259ab2fe659f48f29162999",
			  },
			  Object {
			    "amount": 0,
			    "id": "7ee643f6249b74bf037e7ada9c98e5c1bc2a26e31ed2f86c1070de7f9affe556",
			  },
			  Object {
			    "amount": 0,
			    "id": "0cee545dcc9b15c3d9c0c26bfa0dfb7d445e4a4e650fa716762fdb3ae18139b1",
			  },
			  Object {
			    "amount": 0,
			    "id": "5b00dc32bd0c3d3fe697a0af6089378468646c217f6b7af3257b764afa004210",
			  },
			  Object {
			    "amount": 0,
			    "id": "bc9418bbd25ad4e0befe346c327f486b7fe83a52a46398e1f67ae564f739e83c",
			  },
			  Object {
			    "amount": 0,
			    "id": "a24416a05bef8874fb1c638105d892162f7d5736b7a2deda318e976fd80f64e9",
			  },
			  Object {
			    "amount": 0,
			    "id": "390733908f3cbf71bdb882cfc9934a2c3506a52adeeb3de9bb4d97b764e2764d",
			  },
			  Object {
			    "amount": 0,
			    "id": "088e83ee4470f87a2ae3f486085fc21fe720233f5d3119a4e553c2f98b614860",
			  },
			  Object {
			    "amount": 0,
			    "id": "1fea49dedfd3b3dc39f1aa6cd1ad619220b72007a3094b3ada94d9b09b0b6f11",
			  },
			  Object {
			    "amount": 0,
			    "id": "4e0cc1d9f121faf17c6674b5ba36a2f4bd02417fed278da5b9902081aa0c3ac9",
			  },
			  Object {
			    "amount": 0,
			    "id": "9ccfbfd5be1d2126e9ffc692c20c88c2ea23b6d671c1991a439c3b3a5a3ad635",
			  },
			  Object {
			    "amount": 0,
			    "id": "6faca232c17535045294d753f852cb73973b5682ba75456d67f710c1b053b70f",
			  },
			  Object {
			    "amount": 0,
			    "id": "911915a59400a0c914d0b709ce5b3b4c41816cb03225220c3dd543501e0217d5",
			  },
			  Object {
			    "amount": 0,
			    "id": "bd74673d49a74b3acd9857a42e968f3d817f3d89d68148cae8e99e2b20451ef7",
			  },
			  Object {
			    "amount": 0,
			    "id": "1765388a02711fc9ac08d1c8fbd073942f7b6af28f41e6c3c7e6360306b64765",
			  },
			  Object {
			    "amount": 0,
			    "id": "a567f2975e7c68d687cf5d6390ea08c87c11680e079d4504a345aa2d0f0c5765",
			  },
			  Object {
			    "amount": 0,
			    "id": "84bf63cf622cbedc03dc6ac97c350231681faa582bbab2f33dbcf1b5354aea5a",
			  },
			  Object {
			    "amount": 0,
			    "id": "4dc72c05beeb5cfb597f42e3cbfe18693e48dda902fc7bf5b5bb048c3191d50f",
			  },
			  Object {
			    "amount": 0,
			    "id": "4e5726d2e400825b1998e1ee54c33712b7fcd88bcef3360b46d9ff18a0f6dc99",
			  },
			  Object {
			    "amount": 0,
			    "id": "a66394e3452b1667e1862e6684d36b1b98d1a1ccb4e062a2a552ecb2b361ab23",
			  },
			  Object {
			    "amount": 0,
			    "id": "4ab61bcdee96c7e8f96fad1db457c794ccb60e6b0a36274e4849066a228f7e52",
			  },
			  Object {
			    "amount": 0,
			    "id": "96b520404110fa4aec7213b8bfed59d301735b4409a798daaf5840e4a2bf3a1a",
			  },
			  Object {
			    "amount": 0,
			    "id": "086a906f5d19ed9ccb11853196d7ef20b0d1f2d76416dc3a4cdf9f887cab325b",
			  },
			  Object {
			    "amount": 0,
			    "id": "20d0870fd5f4f349d26c52d7aaec83c28b1631e9da3fc3393ef1a6e439fa37ab",
			  },
			  Object {
			    "amount": 0,
			    "id": "1ba894533cde4891df599d2139196655feee027a8fcb6a73b77134c329b44ebf",
			  },
			  Object {
			    "amount": 0,
			    "id": "59a66480da016eafe8dc8369b40cff9aa10c3dfef984dc823e87e03f94b7c000",
			  },
			  Object {
			    "amount": 0,
			    "id": "58f42102963e2c083bc0bfe33cea518e424fa7492950cc18017a932a76e5330a",
			  },
			  Object {
			    "amount": 0,
			    "id": "4d959e272d3f66079e4f66e627a681197a1d6c5aeb7422062dba1e372a65723c",
			  },
			  Object {
			    "amount": 0,
			    "id": "8855d5ad5c81c99d7a1e182ae34c63923116039b4d4847a1aaf3ca57e8fd24b7",
			  },
			  Object {
			    "amount": 0,
			    "id": "3ae9538e628af9289fc96c71b49d289b925cfbdc9d01503c72e2925f20eeb882",
			  },
			  Object {
			    "amount": 0,
			    "id": "4a96e8fe8b437a0fcdd53741f4f55b440a904cd3fe04aae8233fd77c5071d216",
			  },
			  Object {
			    "amount": 0,
			    "id": "961d1a1057a09f865291873e9ba3d0af7b2a3a1e971bb7576a2aab1c526acbcd",
			  },
			  Object {
			    "amount": 0,
			    "id": "520be8fc06907a5a02d96780e95d7350f96a296f249608fa83b76cf578baf816",
			  },
			  Object {
			    "amount": 0,
			    "id": "eaa049295d96618c51eb30deffe7fc2cc8bfc13190cb97f3b513dd060b000a46",
			  },
			  Object {
			    "amount": 0,
			    "id": "16ee553dccfb1ffe2a3beafa5133b282cffe37f3528baaebe2f2204dee547b41",
			  },
			  Object {
			    "amount": 0,
			    "id": "471bad28073057099b9cd5a111c1bfab4e5355cfa86d2ae7261f4ee1040a00bc",
			  },
			  Object {
			    "amount": 0,
			    "id": "ab5146c3d62747f6372f5b35ca68ff85dccba9094526f84cd557133d395a8a7d",
			  },
			  Object {
			    "amount": 0,
			    "id": "d6619d6dd17a23fbd8bfe8aebc7065956feb956b66bb7d2867e190441657e2f4",
			  },
			  Object {
			    "amount": 0,
			    "id": "8a211e315151bb6cf1c7f49002c056f15c1ad9980337e90676ec0b862d40e7f8",
			  },
			  Object {
			    "amount": 0,
			    "id": "9ebf74d64dcecd6eb0005967d8888e66d3e2901c8d0c72c7396f021d93a130fc",
			  },
			  Object {
			    "amount": 0,
			    "id": "83c19db7ecaf0690445d0d55b9f2103e101d8b8dff495678ffc4d7e0cd2bd4b9",
			  },
			  Object {
			    "amount": 0,
			    "id": "71e1e34dd0529d920ee6c38497b028352c57b7130d55737c8a778ff3974ec29f",
			  },
			  Object {
			    "amount": 0,
			    "id": "2f58f5b6b1e2e91a9634dfadd1d6726a5aed2875f33260b6753cb9ec7da72917",
			  },
			  Object {
			    "amount": 0,
			    "id": "71d74ec6d8d53244fde9cededae7c9c9f1d5dba5c7ddfe63d2e766cb874169b0",
			  },
			  Object {
			    "amount": 0,
			    "id": "014d843f430c9b5ec74ce8d24b94fc1dcb64406576c1715953f1e3cb88548680",
			  },
			  Object {
			    "amount": 0,
			    "id": "3697a4f8c74cb21949eec31fddde190c16ab2497709fb503c567d3a9e6a6e989",
			  },
			  Object {
			    "amount": 0,
			    "id": "0911107983da4b581a109b5fac9579d89e29f06f10d803370f88a41100c3374e",
			  },
			  Object {
			    "amount": 0,
			    "id": "3193057832bb1c9782a8e4a32e543b535ed9d750b1b10383f8b6f50853569609",
			  },
			  Object {
			    "amount": 0,
			    "id": "18d1b236b98b02c464bbe057077c7dea32b4f519f573b4b2de57ea0634e64a7c",
			  },
			  Object {
			    "amount": 0,
			    "id": "8aceda0f39b35d778f55593227f97152f0b5a78b80b5c4ae88979909095d6204",
			  },
			  Object {
			    "amount": 0,
			    "id": "7beb5f1e8592022fe5272b45eeeda6a1b6923a801af6e1790933cc6a78ed95a1",
			  },
			  Object {
			    "amount": 0,
			    "id": "6089206bdd49e8e6c824b4896f5b3c2d71207c30c6bf056d430ba0d8838e7c51",
			  },
			  Object {
			    "amount": 0,
			    "id": "be80ec195679920bc73583e6ec77248d3963512244eb2bbc6ebb31b147138a5f",
			  },
			  Object {
			    "amount": 0,
			    "id": "dc979116a6513fd00a0569d9f2f7f4776432328584494100998e594c2bbea79a",
			  },
			  Object {
			    "amount": 0,
			    "id": "31d29205583befdf88e614ca875ab35a4a9e012bac6404e848ce146986afa7b0",
			  },
			  Object {
			    "amount": 0,
			    "id": "b59c6580a05ae00896f03dd66205ac141a22599674cbf0db6654a0908b73e5e5",
			  },
			  Object {
			    "amount": 0,
			    "id": "633698916662935403780f04fd01119f32f9cd180a3b104b67c5ae5ebb6d5593",
			  },
			  Object {
			    "amount": 0,
			    "id": "0348a623c41ed7742a7f35a5812476750e2ba41208e16a29b110e6fe11e514d4",
			  },
			  Object {
			    "amount": 0,
			    "id": "2493d52fc34ecaaa4a7d0d76e6de9bda24f1b5e11e3363c30a13d59e9c345f82",
			  },
			]
		`);
		});
	});

	describe("#broadcast", () => {
		const transactionPayload = createService(SignedTransactionData).configure(
			"5961193224963457718",
			{
				id: "5961193224963457718",
				amount: 1,
				type: 0,
				timestamp: 125068043,
				senderPublicKey: "ceb7bb7475a14b729eba069dfb27715331727a910acf5773a950ed4f863c89ed",
				senderId: "15957226662510576840L",
				recipientId: "15957226662510576840L",
				fee: "10000000",
				signature:
					"48580d51e30a177b854ef35771a62911140085808bf2299828202ce439faaf96dc677822279caf1bdddf99d01867cba119e9b1cd5bb7f65cbc531f6c1ce93705",
				signatures: [],
				asset: {},
			},
			"",
		);

		it("should pass", async () => {
			nock(/.+/)
				.post("/api/transactions")
				.reply(200, require(`${__dirname}/../test/fixtures/client/two/broadcast.json`));

			const result = await subject.broadcast([transactionPayload]);

			expect(result).toEqual({
				accepted: ["5961193224963457718"],
				rejected: [],
				errors: {},
			});
		});

		it("should fail", async () => {
			nock(/.+/)
				.post("/api/transactions")
				.reply(200, require(`${__dirname}/../test/fixtures/client/two/broadcast-failure.json`));

			const result = await subject.broadcast([transactionPayload]);

			expect(result).toEqual({
				accepted: [],
				rejected: ["5961193224963457718"],
				errors: {
					"5961193224963457718": "Account does not have enough LSK: 18218254863282357638L, balance: 219.2",
				},
			});
		});
	});
});
