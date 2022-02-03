import { BigNumber } from "@payvo/sdk-helpers";
import { describe } from "@payvo/sdk-test";

import { createService } from "../test/mocking";
import { WalletData } from "./wallet.dto.js";

for (const network of ["mainnet", "devnet"]) {
	describe(`WalletData - ${network}`, ({ assert, beforeEach, it, nock, loader }) => {
		const WalletDataFixture = {
			devnet: {
				address: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
				attributes: {
					delegate: {
						forgedFees: "124364463486",
						forgedRewards: "16899000000000",
						lastBlock: {
							generatorPublicKey: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
							height: 4_269_235,
							id: "682a1c53eb9e6fcf285d1b6819de08f88bd15b083a612c3fe32aa870001dbf22",
							timestamp: 91_907_944,
						},
						producedBlocks: 84_709,
						resigned: false,
						username: "arkx",
						voteBalance: "57037342430760",
					},
					entities: {
						"03e44853b26f450d5aba78e3fad390faa8ae9aa6995b1fa80b8d191516b52f1e": {
							data: {
								ipfsData: "QmNgvK9AAh7XVHubzJE3F33K4GJubFcQm9AUPBy1vFCEsV",
								name: "desktopplugin2",
							},
							subType: 2,
							type: 3,
						},
						"9d25ddf8e59d8595a74d7fe74fdee3380660d60333c453b1a352326d80ba4b43": {
							data: {
								ipfsData: "QmXCuXaBuWZGqES7tDW6AHFCGj8zEzFG48P1BHWSU1fqq3",
								name: "coreplugin2",
							},
							subType: 1,
							type: 3,
						},
						df520b0a278314e998dc93be1e20c72b8313950c19da23967a9db60eb4e990da: {
							data: {
								ipfsData: "QmRwgWaaEyYgGqp55196TsFDQLW4NZkyTnPwiSVhJ7NPRV",
								name: "business2reg",
							},
							subType: 0,
							type: 0,
						},
					},
					multiSignature: {
						min: 1,
						publicKeys: [
							"0276e139773e7f7cfae7dbc8cb9afa37a52ffa8d4614482f9b9fe7eeab0f2447b6",
							"0272a9fb36e7a7d212aedfab53b2cdd48c8b620583d1927e03104122e6792482db",
							"0262faf4f0add64aecd44d2f7223198aec5116e3c1dcd80aa4fff193aa490b3e5f",
						],
					},
					vote: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
				},
				balance: "55827093444556",
				nonce: "111932",
				publicKey: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
			},
			mainnet: {
				address: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
				balance: "55827093444556",
				isDelegate: true,
				isResigned: false,
				nonce: "111932",
				publicKey: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
				username: "arkx",
				vote: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
			},
		};

		beforeEach(async (context) => {
			context.subject = (await createService(WalletData)).fill(WalletDataFixture[network]);
		});

		it("should have a primary key", (context) => {
			assert.is(context.subject.primaryKey(), "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9");
		});

		it("should have a address", (context) => {
			assert.is(context.subject.address(), "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9");
		});

		it("should have a public key", (context) => {
			assert.is(
				context.subject.publicKey(),
				"03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
			);
		});

		it("should have a balance", (context) => {
			assert.equal(context.subject.balance().available, BigNumber.make("55827093444556"));
		});

		it("should have a nonce", (context) => {
			assert.equal(context.subject.nonce(), BigNumber.make("111932"));
		});

		it("should have a secondary public key", (context) => {
			assert.undefined(context.subject.secondPublicKey());
		});

		it("should have a username", (context) => {
			assert.is(context.subject.username(), "arkx");
		});

		it("should have a rank", (context) => {
			assert.undefined(context.subject.rank());
		});

		it("should have a votes", (context) => {
			assert.equal(context.subject.votes(), network === "devnet" ? BigNumber.make("57037342430760") : undefined);
		});

		it("should determine if it is a delegate", async (context) => {
			context.subject = (await createService(WalletData)).fill({
				...WalletDataFixture.devnet,
				isResigned: false,
			});

			assert.true(context.subject.isDelegate());

			context.subject = (await createService(WalletData)).fill({
				...WalletDataFixture.mainnet,
				isResigned: true,
			});

			assert.false(context.subject.isDelegate());
		});

		it("should determine if it is a resigned delegate", (context) => {
			assert.boolean(context.subject.isResignedDelegate());
		});

		it("should determine if it is a multi signature", (context) => {
			assert.boolean(context.subject.isMultiSignature());
		});

		it("should determine if it is a second signature", (context) => {
			assert.false(context.subject.isSecondSignature());
		});

		it("should turn into a normalised object", (context) => {
			assert.object(context.subject.toObject());
		});

		it("should have a multi signature asset", async () => {
			const devnetSubject = (await createService(WalletData)).fill(WalletDataFixture.devnet);
			const mainnetSubject = (await createService(WalletData)).fill(WalletDataFixture.mainnet);

			assert.throws(() => mainnetSubject.multiSignature(), "does not have");
			assert.is(devnetSubject.multiSignature(), WalletDataFixture.devnet.attributes.multiSignature);
		});
	});
}
