import { describe } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import { WalletData } from "./wallet.dto";
import { createService } from "../test/mocking";

let subject;

const WalletDataFixture = {
	mainnet: {
		address: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
		publicKey: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
		nonce: "111932",
		balance: "55827093444556",
		isDelegate: true,
		isResigned: false,
		vote: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
		username: "arkx",
	},
	devnet: {
		address: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
		publicKey: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
		nonce: "111932",
		balance: "55827093444556",
		attributes: {
			delegate: {
				username: "arkx",
				voteBalance: "57037342430760",
				forgedFees: "124364463486",
				forgedRewards: "16899000000000",
				producedBlocks: 84709,
				lastBlock: {
					id: "682a1c53eb9e6fcf285d1b6819de08f88bd15b083a612c3fe32aa870001dbf22",
					height: 4269235,
					timestamp: 91907944,
					generatorPublicKey: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
				},
				resigned: false,
			},
			vote: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
			entities: {
				df520b0a278314e998dc93be1e20c72b8313950c19da23967a9db60eb4e990da: {
					type: 0,
					subType: 0,
					data: {
						name: "business2reg",
						ipfsData: "QmRwgWaaEyYgGqp55196TsFDQLW4NZkyTnPwiSVhJ7NPRV",
					},
				},
				"9d25ddf8e59d8595a74d7fe74fdee3380660d60333c453b1a352326d80ba4b43": {
					type: 3,
					subType: 1,
					data: {
						name: "coreplugin2",
						ipfsData: "QmXCuXaBuWZGqES7tDW6AHFCGj8zEzFG48P1BHWSU1fqq3",
					},
				},
				"03e44853b26f450d5aba78e3fad390faa8ae9aa6995b1fa80b8d191516b52f1e": {
					type: 3,
					subType: 2,
					data: {
						name: "desktopplugin2",
						ipfsData: "QmNgvK9AAh7XVHubzJE3F33K4GJubFcQm9AUPBy1vFCEsV",
					},
				},
			},
			multiSignature: {
				publicKeys: [
					"0276e139773e7f7cfae7dbc8cb9afa37a52ffa8d4614482f9b9fe7eeab0f2447b6",
					"0272a9fb36e7a7d212aedfab53b2cdd48c8b620583d1927e03104122e6792482db",
					"0262faf4f0add64aecd44d2f7223198aec5116e3c1dcd80aa4fff193aa490b3e5f",
				],
				min: 1,
			},
		},
	},
};

for (const network of ["mainnet", "devnet"]) {
	describe(`WalletData - ${network}`, ({ assert, beforeEach, it }) => {
		beforeEach(async () => {
			subject = (await createService(WalletData)).fill(WalletDataFixture[network]);
		});

		it("should have a primary key", () => {
			assert.is(subject.primaryKey(), "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9");
		});

		it("should have a address", () => {
			assert.is(subject.address(), "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9");
		});

		it("should have a public key", () => {
			assert.is(subject.publicKey(), "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec");
		});

		it("should have a balance", () => {
			assert.equal(subject.balance().available, BigNumber.make("55827093444556"));
		});

		it("should have a nonce", () => {
			assert.equal(subject.nonce(), BigNumber.make("111932"));
		});

		it("should have a secondary public key", () => {
			assert.undefined(subject.secondPublicKey());
		});

		it("should have a username", () => {
			assert.is(subject.username(), "arkx");
		});

		it("should have a rank", () => {
			assert.undefined(subject.rank());
		});

		it("should have a votes", () => {
			assert.equal(subject.votes(), network === "devnet" ? BigNumber.make(0) : undefined);
		});

		it("should determine if it is a delegate", async () => {
			subject = (await createService(WalletData)).fill({ ...WalletDataFixture.devnet, isResigned: false });

			assert.true(subject.isDelegate());

			subject = (await createService(WalletData)).fill({ ...WalletDataFixture.mainnet, isResigned: true });

			assert.false(subject.isDelegate());
		});

		it("should determine if it is a resigned delegate", () => {
			assert.boolean(subject.isResignedDelegate());
		});

		it("should determine if it is a multi signature", () => {
			assert.boolean(subject.isMultiSignature());
		});

		it("should determine if it is a second signature", () => {
			assert.false(subject.isSecondSignature());
		});

		it("should turn into a normalised object", () => {
			assert.object(subject.toObject());
		});

		it("should have a multi signature asset", async () => {
			const devnetSubject = (await createService(WalletData)).fill(WalletDataFixture.devnet);
			const mainnetSubject = (await createService(WalletData)).fill(WalletDataFixture.mainnet);

			assert.throws(() => mainnetSubject.multiSignature(), "does not have");
			assert.is(devnetSubject.multiSignature(), WalletDataFixture.devnet.attributes.multiSignature);
		});
	});
}
