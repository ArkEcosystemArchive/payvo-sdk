import { assert, describe, test } from "@payvo/sdk-test";
import { createService } from "../test/mocking";
import { AssetSerializer } from "./asset.serializer";

describe("AssetSerializer #toMachine", () => {
	for (const { moduleID, assetID, asset } of [
		{
			moduleID: 2,
			assetID: 0,
			asset: { recipientAddress: "lsk72fxrb264kvw6zuojntmzzsqds35sqvfzz76d7", amount: "100000000" },
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
		},
		{
			moduleID: 5,
			assetID: 0,
			asset: { username: "johndoe" },
		},
		{
			moduleID: 5,
			assetID: 1,
			asset: { votes: [{ delegateAddress: "lsk72fxrb264kvw6zuojntmzzsqds35sqvfzz76d7", amount: `${10e8}` }] },
		},
		{
			moduleID: 5,
			assetID: 2,
			asset: {
				unlockObjects: [
					{
						delegateAddress: "lsk72fxrb264kvw6zuojntmzzsqds35sqvfzz76d7",
						amount: `${10e8}`,
						unvoteHeight: "1",
					},
				],
			},
		},
	]) {
		test("should serialize asset of transaction type (%s)", () => {
			assert.object(createService(AssetSerializer).toMachine(moduleID, assetID, asset));
		});
	}

	test("should throw error when transaction type cannot be recognized", () => {
		assert.throws(
			() => createService(AssetSerializer).toMachine(10, 10, {}),
			"Failed to determine transaction type for asset serialization.",
		);
	});

	test("should throw error when serializing vote asset with amount not multiple of 10", () => {
		assert.throws(
			() =>
				createService(AssetSerializer).toMachine(5, 1, {
					votes: [{ delegateAddress: "lsk72fxrb264kvw6zuojntmzzsqds35sqvfzz76d7", amount: `${7 * 1e8}` }],
				}),
			"The value [700000000] is not a multiple of 10.",
		);
	});
});

test.run();
