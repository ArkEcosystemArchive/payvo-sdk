import { describe } from "@payvo/sdk-test";
import { createService } from "../test/mocking";
import { TransactionSerializer } from "./transaction.serializer.js";

const clone = (data) => JSON.parse(JSON.stringify(data));

const transactions = [
	{
		moduleID: 2,
		assetID: 0,
		asset: { recipientAddress: "lsk72fxrb264kvw6zuojntmzzsqds35sqvfzz76d7", amount: "100000000", data: "" },
		senderPublicKey: "5e93fd5cfe306ea2c34d7082a6c79692cf2f5c6e07aa6f9b4a11b4917d33f16b",
		nonce: "3",
		fee: "207000",
		signatures: [
			"64e1c880e844f970e46ebdcc7c9c89a80bf8618de82706f3873ee91fa666657de610a8899f1370664721cdcb08eb5ac1e12aa6e1611b85a12050711aca478604",
		],
		id: "73413ba3034d67f794b5c151c0a148b058ee476415c631e5f3d68d37c7b64db0",
	},
	{
		moduleID: 4,
		assetID: 0,
		asset: {
			numberOfSignatures: 2,
			mandatoryKeys: [
				"5948cc0565a3e9320c7442cecb62acdc92b428a0da504c52afb3e84a025d221f",
				"a3c22fd67483ae07134c93224384dac7206c40b1b7a14186dd2d3f0dcc8234ff",
			],
			optionalKeys: [],
		},
		senderPublicKey: "5e93fd5cfe306ea2c34d7082a6c79692cf2f5c6e07aa6f9b4a11b4917d33f16b",
		nonce: "3",
		fee: "207000",
		signatures: [
			"fbedfba740b75c2c4ab3fee0422a0d65b0995b009d83e75c40bdb6f0653814dc9719a20c99af9ef4980eb8f7c67d4b3147023869e330003036ad2781227a5604",
			"fbedfba740b75c2c4ab3fee0422a0d65b0995b009d83e75c40bdb6f0653814dc9719a20c99af9ef4980eb8f7c67d4b3147023869e330003036ad2781227a5604",
			"d9ef77f025ad25ccb9871c1e931906345c621726f68fab057afaf5ecd85497ae2205178057c4f37ea1687a69f84140b74b159b086da560d6b8870a2a7fc90505",
		],
		id: "73413ba3034d67f794b5c151c0a148b058ee476415c631e5f3d68d37c7b64db0",
	},
	{
		moduleID: 5,
		assetID: 0,
		asset: { username: "johndoe" },
		senderPublicKey: "5e93fd5cfe306ea2c34d7082a6c79692cf2f5c6e07aa6f9b4a11b4917d33f16b",
		nonce: "3",
		fee: "207000",
		signatures: [
			"64e1c880e844f970e46ebdcc7c9c89a80bf8618de82706f3873ee91fa666657de610a8899f1370664721cdcb08eb5ac1e12aa6e1611b85a12050711aca478604",
		],
		id: "73413ba3034d67f794b5c151c0a148b058ee476415c631e5f3d68d37c7b64db0",
	},
	{
		moduleID: 5,
		assetID: 1,
		asset: { votes: [{ delegateAddress: "lsk72fxrb264kvw6zuojntmzzsqds35sqvfzz76d7", amount: `${10e8}` }] },
		senderPublicKey: "5e93fd5cfe306ea2c34d7082a6c79692cf2f5c6e07aa6f9b4a11b4917d33f16b",
		nonce: "3",
		fee: "207000",
		signatures: [
			"64e1c880e844f970e46ebdcc7c9c89a80bf8618de82706f3873ee91fa666657de610a8899f1370664721cdcb08eb5ac1e12aa6e1611b85a12050711aca478604",
		],
		id: "73413ba3034d67f794b5c151c0a148b058ee476415c631e5f3d68d37c7b64db0",
	},
	{
		moduleID: 5,
		assetID: 2,
		asset: {
			unlockObjects: [
				{
					delegateAddress: "lsk72fxrb264kvw6zuojntmzzsqds35sqvfzz76d7",
					amount: `${10e8}`,
					unvoteHeight: 14548929,
				},
			],
		},
		senderPublicKey: "5e93fd5cfe306ea2c34d7082a6c79692cf2f5c6e07aa6f9b4a11b4917d33f16b",
		nonce: "3",
		fee: "207000",
		signatures: [
			"64e1c880e844f970e46ebdcc7c9c89a80bf8618de82706f3873ee91fa666657de610a8899f1370664721cdcb08eb5ac1e12aa6e1611b85a12050711aca478604",
		],
		id: "73413ba3034d67f794b5c151c0a148b058ee476415c631e5f3d68d37c7b64db0",
	},
];

describe("#toMachine", async ({ it, assert }) => {
	for (const transaction of clone(transactions)) {
		it(`should serialize to machine ${JSON.stringify({ transaction })}`, () => {
			assert.object(createService(TransactionSerializer).toMachine(transaction));
		});
	}
});

describe("#toHuman", ({ it, assert }) => {
	for (const transaction of clone(transactions)) {
		it(`should serialize to human ${JSON.stringify({ transaction })}`, async () => {
			const subject = await createService(TransactionSerializer);

			assert.object(subject.toHuman(subject.toMachine(transaction)));
		});
	}

	it("should default transfer data to empty string when not present", async () => {
		const subject = await createService(TransactionSerializer);

		const transaction = subject.toMachine({
			moduleID: 2,
			assetID: 0,
			asset: { recipientAddress: "lsk72fxrb264kvw6zuojntmzzsqds35sqvfzz76d7", amount: "100000000" },
			senderPublicKey: "5e93fd5cfe306ea2c34d7082a6c79692cf2f5c6e07aa6f9b4a11b4917d33f16b",
			nonce: "3",
			fee: "207000",
		});

		delete transaction.asset.data;

		assert.is(subject.toHuman(transaction).asset.data, "");
	});
});

describe("#toString", ({ it, assert }) => {
	for (const transaction of clone(transactions)) {
		it(`should serialize to string ${JSON.stringify({ transaction })}`, async () => {
			const subject = await createService(TransactionSerializer);

			assert.string(subject.toString(subject.toHuman(transaction)));
		});
	}

	it("should throw error for unrecognized transaction types", async () => {
		const subject = await createService(TransactionSerializer);

		assert.throws(
			() => subject.toString({ moduleID: 10, assetID: 10 }),
			"Failed to determine the transaction type.",
		);
	});
});
