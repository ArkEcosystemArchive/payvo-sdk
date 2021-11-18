/* eslint-disable jest/expect-expect */
import "reflect-metadata";

import { bootContainer } from "../mocking";
import { Profile } from "../../source/profile";
import { IProfile } from "../../source/contracts";
import nock from "nock";

import {
	mockMusigServer,
	generateWallets,
	createMusigRegistrationFixture,
	generateRegistrationTransactionData,
} from "./musig.test.helpers";

describe("LSK", () => {
	let profile: IProfile;

	const { mockServerResponse, resetServerResponseMocks } = mockMusigServer({
		url: "https://lsk-test-musig.payvo.com",
	});

	test.before(() => {
		bootContainer();

		nock("https://lsk-test.payvo.com:443")
			.get("/api/v2/accounts?address=lskmb4waqehazt6j8468nrpy455jbvxy7cxqzfgap")
			.reply(200, require("../fixtures/wallets/lsk/lskmb4waqehazt6j8468nrpy455jbvxy7cxqzfgap.json"))
			.get("/api/v2/accounts?address=lskk8upba9sj8zsktr8hb2vcgk3quvgmx8h27h4gr")
			.reply(200, require("../fixtures/wallets/lsk/lskk8upba9sj8zsktr8hb2vcgk3quvgmx8h27h4gr.json"))
			.get("/api/v2/accounts?address=lskz89pmnqf6hteroab3hqxk69ghn6c7coepd6fdg")
			.reply(200, require("../fixtures/wallets/lsk/lskz89pmnqf6hteroab3hqxk69ghn6c7coepd6fdg.json"))
			.persist();

		profile = new Profile({ id: "profile-id", name: "name", avatar: "avatar", data: "" });
	});

	test.after.each(() => {
		resetServerResponseMocks();
	});

	describe("MuSig Registration", () => {
		it.each(["mandatory", "optional"])(
			"should perform a 2 out of 2 registration using all keys as %s",
			async (key) => {
				const { wallets, publicKeys } = await generateWallets({
					numberOfWallets: 2,
					profile,
					coinId: "LSK",
					networkId: "lsk.testnet",
				});

				const [first, second] = wallets;

				const { fee, transactionData } = await generateRegistrationTransactionData({
					wallet: first,
					timestamp: 133697283,
					minSignatures: 2,
					mandatoryKeys: key === "mandatory" ? publicKeys : [],
					optionalKeys: key === "optional" ? publicKeys : [],
				});

				const createFixtures = (uuid: string) => {
					return {
						withFirstSignature: createMusigRegistrationFixture({
							uuid,
							min: 2,
							wallet: first.wallet,
							mandatoryKeys: publicKeys,
							signatures: first.wallet.transaction().transaction(uuid).toObject().data.signatures,
							timestamp: 133697283,
						}),

						withSecondSignature: createMusigRegistrationFixture({
							uuid,
							min: 2,
							wallet: first.wallet,
							mandatoryKeys: publicKeys,
							signatures: [
								"c85de7e77f036992ae0080f064c9d0a11af8318cfd12747bf23a3136cdd7d3e0903993354b000eb5ae94c4ee99143daf238fece144b0092795117addc617ea0d",
								"40609653fd43e95a4b98040fe9ad938426da7a0c45117488899fdbe661ad373bf4afd6b9497222a5bdc8bfe710073c489bfc12642784bd919f7b5b00fc500c0c",
								"c85de7e77f036992ae0080f064c9d0a11af8318cfd12747bf23a3136cdd7d3e0903993354b000eb5ae94c4ee99143daf238fece144b0092795117addc617ea0d",
							],
							timestamp: 133697283,
						}),
					};
				};

				// // 1. Sign musig registration by first wallet's signature
				const uuid = await first.wallet.transaction().signMultiSignature(transactionData);
				const fixtures = createFixtures(uuid);

				// Broadcast the transaction to musig server with first wallet's  signature.
				// All participant wallets should see when calling wallet.transaction.sync()
				mockServerResponse("store", { id: uuid });
				const result = await first.wallet.transaction().broadcast(uuid);

				assert.is(result, { accepted: [uuid], errors: {}, rejected: [] });

				// Validate multi-signature registration data.
				assert.is(first.wallet.transaction().canBeBroadcasted(uuid), false);
				assert.is(first.wallet.transaction().canBeSigned(uuid), false);
				assert.is(first.wallet.transaction().transaction(uuid).fee(), fee.toNumber());
				assert.is(first.wallet.transaction().transaction(uuid).amount(), 0);
				assert.is(first.wallet.transaction().transaction(uuid).timestamp()).toBeDefined();
				assert.is(first.wallet.transaction().transaction(uuid).isMultiSignatureRegistration(), true);
				assert.is(first.wallet.transaction().transaction(uuid).usesMultiSignature(), true);
				assert.is(first.wallet.transaction().transaction(uuid).get("multiSignature"), {
					mandatoryKeys: expect.toContainValues(transactionData.data.mandatoryKeys),
					optionalKeys: expect.toContainValues(transactionData.data.optionalKeys),
					numberOfSignatures: 2,
				});

				mockServerResponse("pending", [fixtures.withFirstSignature]);
				mockServerResponse("ready", []);

				await first.wallet.transaction().sync();

				assert.is(first.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
				assert.is(first.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

				assert.is(first.wallet.transaction().isAwaitingOurSignature(uuid), false);
				assert.is(first.wallet.transaction().isAwaitingOtherSignatures(uuid), true);
				assert.is(first.wallet.transaction().isAwaitingFinalSignature(uuid), true);

				assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
				assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), true);

				assert.is(first.wallet.transaction().canBeSigned(uuid), false);
				assert.is(first.wallet.transaction().canBeBroadcasted(uuid), false);

				await second.wallet.transaction().sync();

				assert.is(second.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
				assert.is(
					second.wallet.transaction().transaction(uuid).timestamp().toUNIX(),
					transactionData.timestamp,
				);

				assert.is(second.wallet.transaction().isAwaitingOurSignature(uuid), true);
				assert.is(second.wallet.transaction().isAwaitingOtherSignatures(uuid), false);
				assert.is(second.wallet.transaction().isAwaitingFinalSignature(uuid), true);

				assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
				assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), true);

				assert.is(second.wallet.transaction().canBeSigned(uuid), true);
				assert.is(second.wallet.transaction().canBeBroadcasted(uuid), false);

				mockServerResponse("show", fixtures.withFirstSignature);
				mockServerResponse("pending", []);
				mockServerResponse("ready", [fixtures.withSecondSignature]);

				// 2. Add the second signature from the second participant, and re-broadcast the transaction.
				await second.wallet
					.transaction()
					.addSignature(uuid, await second.wallet.coin().signatory().mnemonic(second.mnemonic));

				await second.wallet.transaction().sync();

				assert.is(first.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
				assert.is(first.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

				assert.is(second.wallet.transaction().isAwaitingOurSignature(uuid), false);
				assert.is(second.wallet.transaction().isAwaitingOtherSignatures(uuid), false);
				assert.is(second.wallet.transaction().isAwaitingFinalSignature(uuid), false);

				assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
				assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), false);

				assert.is(second.wallet.transaction().canBeSigned(uuid), false);
				assert.is(second.wallet.transaction().canBeBroadcasted(uuid), true);

				await first.wallet.transaction().sync();

				assert.is(first.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
				assert.is(first.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

				assert.is(first.wallet.transaction().isAwaitingOurSignature(uuid), false);
				assert.is(first.wallet.transaction().isAwaitingOtherSignatures(uuid), false);
				assert.is(first.wallet.transaction().isAwaitingFinalSignature(uuid), false);

				assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
				assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), false);

				assert.is(first.wallet.transaction().canBeSigned(uuid), false);
				assert.is(first.wallet.transaction().canBeBroadcasted(uuid), true);
			},
		);

		test("should perform a 2 out of 3 registration without mandatory keys", async () => {
			const { wallets, publicKeys } = await generateWallets({
				numberOfWallets: 3,
				profile,
				coinId: "LSK",
				networkId: "lsk.testnet",
			});

			const [first, second, third] = wallets;

			const { fee, transactionData } = await generateRegistrationTransactionData({
				wallet: first,
				timestamp: 133697283,
				minSignatures: 2,
				mandatoryKeys: [],
				optionalKeys: publicKeys,
			});

			const createFixtures = (uuid: string) => {
				return {
					withFirstSignature: createMusigRegistrationFixture({
						uuid,
						min: 2,
						fee: "2000000000",
						wallet: first.wallet,
						mandatoryKeys: transactionData.data.mandatoryKeys,
						optionalKeys: transactionData.data.optionalKeys,
						signatures: [
							"bc556782547e114de888bf84b65d71198f8ce61649692821a6f5c4d1688bb47b3d53859200c582c61b5f6310e34ac042854ef9c37c3fa0e34070bbf16bf4fd08",
							"",
							"",
							"bc556782547e114de888bf84b65d71198f8ce61649692821a6f5c4d1688bb47b3d53859200c582c61b5f6310e34ac042854ef9c37c3fa0e34070bbf16bf4fd08",
						],
						timestamp: 133697283,
					}),

					withSecondSignature: createMusigRegistrationFixture({
						uuid,
						min: 2,
						wallet: first.wallet,
						fee: "2000000000",
						mandatoryKeys: transactionData.data.mandatoryKeys,
						optionalKeys: transactionData.data.optionalKeys,
						signatures: [
							"bc556782547e114de888bf84b65d71198f8ce61649692821a6f5c4d1688bb47b3d53859200c582c61b5f6310e34ac042854ef9c37c3fa0e34070bbf16bf4fd08",
							"60cd9b8e9ed9d7b4c0a2d8d46dfc5b0a62f3d0aede212ba041b444dee8021c4b85ad6867904e3b052fc346593a90e289f0bce2aa43abe3f1ab558c59444c0f06",
							"",
							"bc556782547e114de888bf84b65d71198f8ce61649692821a6f5c4d1688bb47b3d53859200c582c61b5f6310e34ac042854ef9c37c3fa0e34070bbf16bf4fd08",
						],
						timestamp: 133697283,
					}),

					withThirdSignature: createMusigRegistrationFixture({
						uuid,
						min: 2,
						wallet: first.wallet,
						fee: "2000000000",
						mandatoryKeys: transactionData.data.mandatoryKeys,
						optionalKeys: transactionData.data.optionalKeys,
						signatures: [
							"bc556782547e114de888bf84b65d71198f8ce61649692821a6f5c4d1688bb47b3d53859200c582c61b5f6310e34ac042854ef9c37c3fa0e34070bbf16bf4fd08",
							"60cd9b8e9ed9d7b4c0a2d8d46dfc5b0a62f3d0aede212ba041b444dee8021c4b85ad6867904e3b052fc346593a90e289f0bce2aa43abe3f1ab558c59444c0f06",
							"6701937ab30ea104a6943351648b4f1474a9b9c991c6359b69a3ae94e4da9a0b8f205b21ebb296173bdb80d0bb9672b8cb4896bfd6507a9ad76534dc63843e0d",
							"bc556782547e114de888bf84b65d71198f8ce61649692821a6f5c4d1688bb47b3d53859200c582c61b5f6310e34ac042854ef9c37c3fa0e34070bbf16bf4fd08",
						],
						timestamp: 133697283,
					}),
				};
			};

			// // 1. Sign musig registration by first wallet's signature
			const uuid = await first.wallet.transaction().signMultiSignature(transactionData);
			const fixtures = createFixtures(uuid);

			// Broadcast the transaction to musig server with first wallet's  signature.
			// All participant wallets should see when calling wallet.transaction.sync()
			mockServerResponse("store", { id: uuid });
			const result = await first.wallet.transaction().broadcast(uuid);

			assert.is(result, { accepted: [uuid], errors: {}, rejected: [] });

			// Validate multi-signature registration data.
			assert.is(first.wallet.transaction().canBeBroadcasted(uuid), false);
			assert.is(first.wallet.transaction().canBeSigned(uuid), false);
			assert.is(first.wallet.transaction().transaction(uuid).fee(), fee.toNumber());
			assert.is(first.wallet.transaction().transaction(uuid).amount(), 0);
			assert.is(first.wallet.transaction().transaction(uuid).timestamp()).toBeDefined();
			assert.is(first.wallet.transaction().transaction(uuid).isMultiSignatureRegistration(), true);
			assert.is(first.wallet.transaction().transaction(uuid).usesMultiSignature(), true);

			const signedMultiSignatureData = first.wallet
				.transaction()
				.transaction(uuid)
				.get("multiSignature") as Record<string, any>;

			assert.is(signedMultiSignatureData.mandatoryKeys).toHaveLength(transactionData.data.mandatoryKeys.length);
			assert.is(signedMultiSignatureData.optionalKeys).toHaveLength(transactionData.data.optionalKeys.length);

			assert.is(signedMultiSignatureData.mandatoryKeys).toContainValues(transactionData.data.mandatoryKeys);
			assert.is(signedMultiSignatureData.optionalKeys).toContainValues(transactionData.data.optionalKeys);
			assert.is(signedMultiSignatureData.numberOfSignatures, 2);

			mockServerResponse("pending", [fixtures.withFirstSignature]);
			mockServerResponse("ready", []);

			await first.wallet.transaction().sync();

			assert.is(first.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(first.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(first.wallet.transaction().isAwaitingOurSignature(uuid), false);
			assert.is(first.wallet.transaction().isAwaitingOtherSignatures(uuid), true);
			assert.is(first.wallet.transaction().isAwaitingFinalSignature(uuid), true);

			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), true);
			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), true);

			assert.is(first.wallet.transaction().canBeSigned(uuid), false);
			assert.is(first.wallet.transaction().canBeBroadcasted(uuid), false);

			await second.wallet.transaction().sync();

			assert.is(second.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(second.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(second.wallet.transaction().isAwaitingOurSignature(uuid), true);
			assert.is(second.wallet.transaction().isAwaitingOtherSignatures(uuid), true);
			assert.is(second.wallet.transaction().isAwaitingFinalSignature(uuid), true);

			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), true);
			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), true);

			assert.is(second.wallet.transaction().canBeSigned(uuid), true);
			assert.is(second.wallet.transaction().canBeBroadcasted(uuid), false);

			await third.wallet.transaction().sync();
			//
			assert.is(third.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(third.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(third.wallet.transaction().isAwaitingOurSignature(uuid), true);
			assert.is(third.wallet.transaction().isAwaitingOtherSignatures(uuid), true);
			assert.is(third.wallet.transaction().isAwaitingFinalSignature(uuid), true);

			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), true);
			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), true);

			assert.is(third.wallet.transaction().canBeSigned(uuid), true);
			assert.is(third.wallet.transaction().canBeBroadcasted(uuid), false);

			mockServerResponse("show", fixtures.withFirstSignature);
			mockServerResponse("ready", []);
			mockServerResponse("pending", [fixtures.withSecondSignature]);

			// 2. Add the second signature from the second participant, and re-broadcast the transaction.
			await second.wallet
				.transaction()
				.addSignature(uuid, await second.wallet.coin().signatory().mnemonic(second.mnemonic));

			await first.wallet.transaction().sync();

			assert.is(first.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(first.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(first.wallet.transaction().isAwaitingOurSignature(uuid), false);
			assert.is(first.wallet.transaction().isAwaitingOtherSignatures(uuid), true);
			assert.is(first.wallet.transaction().isAwaitingFinalSignature(uuid), true);

			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), false);
			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), true);

			assert.is(first.wallet.transaction().canBeSigned(uuid), false);
			assert.is(first.wallet.transaction().canBeBroadcasted(uuid), false);

			await second.wallet.transaction().sync();

			assert.is(second.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(second.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(second.wallet.transaction().isAwaitingOurSignature(uuid), false);
			assert.is(second.wallet.transaction().isAwaitingOtherSignatures(uuid), true);
			assert.is(second.wallet.transaction().isAwaitingFinalSignature(uuid), true);

			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), false);
			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), true);

			assert.is(second.wallet.transaction().canBeSigned(uuid), false);
			assert.is(second.wallet.transaction().canBeBroadcasted(uuid), false);

			await third.wallet.transaction().sync();

			assert.is(third.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(third.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(third.wallet.transaction().isAwaitingOurSignature(uuid), true);
			assert.is(third.wallet.transaction().isAwaitingOtherSignatures(uuid), false);
			assert.is(third.wallet.transaction().isAwaitingFinalSignature(uuid), true);

			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), false);
			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), true);

			assert.is(third.wallet.transaction().canBeSigned(uuid), true);
			assert.is(third.wallet.transaction().canBeBroadcasted(uuid), false);

			mockServerResponse("show", fixtures.withSecondSignature);

			// 2. Add the third (final) signature from the third participant, and re-broadcast the transaction.
			await third.wallet
				.transaction()
				.addSignature(uuid, await third.wallet.coin().signatory().mnemonic(third.mnemonic));

			mockServerResponse("ready", [fixtures.withThirdSignature]);
			mockServerResponse("pending", []);

			await first.wallet.transaction().sync();

			assert.is(first.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(first.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(first.wallet.transaction().isAwaitingOurSignature(uuid), false);
			assert.is(first.wallet.transaction().isAwaitingOtherSignatures(uuid), false);
			assert.is(first.wallet.transaction().isAwaitingFinalSignature(uuid), false);

			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), false);
			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), false);

			assert.is(first.wallet.transaction().canBeSigned(uuid), false);
			assert.is(first.wallet.transaction().canBeBroadcasted(uuid), true);

			await second.wallet.transaction().sync();

			assert.is(second.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(second.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(second.wallet.transaction().isAwaitingOurSignature(uuid), false);
			assert.is(second.wallet.transaction().isAwaitingOtherSignatures(uuid), false);
			assert.is(second.wallet.transaction().isAwaitingFinalSignature(uuid), false);

			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), false);
			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), false);

			assert.is(second.wallet.transaction().canBeSigned(uuid), false);
			assert.is(second.wallet.transaction().canBeBroadcasted(uuid), true);

			await third.wallet.transaction().sync();

			assert.is(third.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(third.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(third.wallet.transaction().isAwaitingOurSignature(uuid), false);
			assert.is(third.wallet.transaction().isAwaitingOtherSignatures(uuid), false);
			assert.is(third.wallet.transaction().isAwaitingFinalSignature(uuid), false);

			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), false);
			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), false);

			assert.is(third.wallet.transaction().canBeSigned(uuid), false);
			assert.is(third.wallet.transaction().canBeBroadcasted(uuid), true);
		});

		test("should perform a 2 out of 3 registration with 1 mandatory key", async () => {
			const { wallets, publicKeys } = await generateWallets({
				numberOfWallets: 3,
				profile,
				coinId: "LSK",
				networkId: "lsk.testnet",
			});

			const [first, second, third] = wallets;

			const { fee, transactionData } = await generateRegistrationTransactionData({
				wallet: first,
				timestamp: 133697283,
				minSignatures: 2,
				mandatoryKeys: publicKeys.slice(0, 1),
				optionalKeys: publicKeys.slice(1),
			});

			const createFixtures = (uuid: string) => {
				return {
					withFirstSignature: createMusigRegistrationFixture({
						uuid,
						min: 2,
						fee: "2000000000",
						wallet: first.wallet,
						mandatoryKeys: transactionData.data.mandatoryKeys,
						optionalKeys: transactionData.data.optionalKeys,
						signatures: [
							"22f7c295cbdd413fcdab6155a8a7c5d3a5866b2c11c81420d6d28e58ed1a9eb08ee3ea520fb2ea75b2e9a9c42f2f4c6c71231a873c659e41b8c6584f7f457008",
							"22f7c295cbdd413fcdab6155a8a7c5d3a5866b2c11c81420d6d28e58ed1a9eb08ee3ea520fb2ea75b2e9a9c42f2f4c6c71231a873c659e41b8c6584f7f457008",
							"",
							"",
						],
						timestamp: 133697283,
					}),

					withSecondSignature: createMusigRegistrationFixture({
						uuid,
						min: 2,
						wallet: first.wallet,
						fee: "2000000000",
						mandatoryKeys: transactionData.data.mandatoryKeys,
						optionalKeys: transactionData.data.optionalKeys,
						signatures: [
							"22f7c295cbdd413fcdab6155a8a7c5d3a5866b2c11c81420d6d28e58ed1a9eb08ee3ea520fb2ea75b2e9a9c42f2f4c6c71231a873c659e41b8c6584f7f457008",
							"22f7c295cbdd413fcdab6155a8a7c5d3a5866b2c11c81420d6d28e58ed1a9eb08ee3ea520fb2ea75b2e9a9c42f2f4c6c71231a873c659e41b8c6584f7f457008",
							"77575b27104b7897af396e612c84beeabdfcd97798779ecda85aa778e64cf1a5d7392f34e2d60c3cfbe98a63503f61b527e25dcef280234335174c6eb1ce7708",
							"",
						],
						timestamp: 133697283,
					}),

					withThirdSignature: createMusigRegistrationFixture({
						uuid,
						min: 2,
						wallet: first.wallet,
						fee: "2000000000",
						mandatoryKeys: transactionData.data.mandatoryKeys,
						optionalKeys: transactionData.data.optionalKeys,
						signatures: [
							"22f7c295cbdd413fcdab6155a8a7c5d3a5866b2c11c81420d6d28e58ed1a9eb08ee3ea520fb2ea75b2e9a9c42f2f4c6c71231a873c659e41b8c6584f7f457008",
							"22f7c295cbdd413fcdab6155a8a7c5d3a5866b2c11c81420d6d28e58ed1a9eb08ee3ea520fb2ea75b2e9a9c42f2f4c6c71231a873c659e41b8c6584f7f457008",
							"77575b27104b7897af396e612c84beeabdfcd97798779ecda85aa778e64cf1a5d7392f34e2d60c3cfbe98a63503f61b527e25dcef280234335174c6eb1ce7708",
							"d6c93f4be3108edf4a90f87404049e7259d7fb60e335fdcc2b8d6bfd57c68f6b9f86dae7a39ff0e6b963ca942db6fb89ae4ab3b2610a794e8dc5d46f20e5cd09",
						],
						timestamp: 133697283,
					}),
				};
			};

			// // 1. Sign musig registration by first wallet's signature
			const uuid = await first.wallet.transaction().signMultiSignature(transactionData);
			const fixtures = createFixtures(uuid);

			// Broadcast the transaction to musig server with first wallet's  signature.
			// All participant wallets should see when calling wallet.transaction.sync()
			mockServerResponse("store", { id: uuid });
			const result = await first.wallet.transaction().broadcast(uuid);

			assert.is(result, { accepted: [uuid], errors: {}, rejected: [] });

			// Validate multi-signature registration data.
			assert.is(first.wallet.transaction().canBeBroadcasted(uuid), false);
			assert.is(first.wallet.transaction().canBeSigned(uuid), false);
			assert.is(first.wallet.transaction().transaction(uuid).fee(), fee.toNumber());
			assert.is(first.wallet.transaction().transaction(uuid).amount(), 0);
			assert.is(first.wallet.transaction().transaction(uuid).timestamp()).toBeDefined();
			assert.is(first.wallet.transaction().transaction(uuid).isMultiSignatureRegistration(), true);
			assert.is(first.wallet.transaction().transaction(uuid).usesMultiSignature(), true);

			const signedMultiSignatureData = first.wallet
				.transaction()
				.transaction(uuid)
				.get("multiSignature") as Record<string, any>;

			assert.is(signedMultiSignatureData.mandatoryKeys).toHaveLength(transactionData.data.mandatoryKeys.length);
			assert.is(signedMultiSignatureData.optionalKeys).toHaveLength(transactionData.data.optionalKeys.length);

			assert.is(signedMultiSignatureData.mandatoryKeys).toContainValues(transactionData.data.mandatoryKeys);
			assert.is(signedMultiSignatureData.optionalKeys).toContainValues(transactionData.data.optionalKeys);
			assert.is(signedMultiSignatureData.numberOfSignatures, 2);

			mockServerResponse("pending", [fixtures.withFirstSignature]);
			mockServerResponse("ready", []);

			await first.wallet.transaction().sync();

			assert.is(first.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(first.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(first.wallet.transaction().isAwaitingOurSignature(uuid), false);
			assert.is(first.wallet.transaction().isAwaitingOtherSignatures(uuid), true);
			assert.is(first.wallet.transaction().isAwaitingFinalSignature(uuid), true);

			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), true);
			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), true);

			assert.is(first.wallet.transaction().canBeSigned(uuid), false);
			assert.is(first.wallet.transaction().canBeBroadcasted(uuid), false);

			await second.wallet.transaction().sync();

			assert.is(second.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(second.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(second.wallet.transaction().isAwaitingOurSignature(uuid), true);
			assert.is(second.wallet.transaction().isAwaitingOtherSignatures(uuid), true);
			assert.is(second.wallet.transaction().isAwaitingFinalSignature(uuid), true);

			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), true);
			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), true);

			assert.is(second.wallet.transaction().canBeSigned(uuid), true);
			assert.is(second.wallet.transaction().canBeBroadcasted(uuid), false);

			await third.wallet.transaction().sync();

			assert.is(third.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(third.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(third.wallet.transaction().isAwaitingOurSignature(uuid), true);
			assert.is(third.wallet.transaction().isAwaitingOtherSignatures(uuid), true);
			assert.is(third.wallet.transaction().isAwaitingFinalSignature(uuid), true);

			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), true);
			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), true);

			assert.is(third.wallet.transaction().canBeSigned(uuid), true);
			assert.is(third.wallet.transaction().canBeBroadcasted(uuid), false);

			mockServerResponse("show", fixtures.withFirstSignature);
			mockServerResponse("ready", []);
			mockServerResponse("pending", [fixtures.withSecondSignature]);

			// 2. Add the second signature from the second participant, and re-broadcast the transaction.
			await second.wallet
				.transaction()
				.addSignature(uuid, await second.wallet.coin().signatory().mnemonic(second.mnemonic));

			await first.wallet.transaction().sync();

			assert.is(first.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(first.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(first.wallet.transaction().isAwaitingOurSignature(uuid), false);
			assert.is(first.wallet.transaction().isAwaitingOtherSignatures(uuid), true);
			assert.is(first.wallet.transaction().isAwaitingFinalSignature(uuid), true);

			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), false);
			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), true);

			assert.is(first.wallet.transaction().canBeSigned(uuid), false);
			assert.is(first.wallet.transaction().canBeBroadcasted(uuid), false);

			await second.wallet.transaction().sync();

			assert.is(second.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(second.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(second.wallet.transaction().isAwaitingOurSignature(uuid), false);
			assert.is(second.wallet.transaction().isAwaitingOtherSignatures(uuid), true);
			assert.is(second.wallet.transaction().isAwaitingFinalSignature(uuid), true);

			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), false);
			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), true);

			assert.is(second.wallet.transaction().canBeSigned(uuid), false);
			assert.is(second.wallet.transaction().canBeBroadcasted(uuid), false);

			await third.wallet.transaction().sync();

			assert.is(third.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(third.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(third.wallet.transaction().isAwaitingOurSignature(uuid), true);
			assert.is(third.wallet.transaction().isAwaitingOtherSignatures(uuid), false);
			assert.is(third.wallet.transaction().isAwaitingFinalSignature(uuid), true);

			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), false);
			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), true);

			assert.is(third.wallet.transaction().canBeSigned(uuid), true);
			assert.is(third.wallet.transaction().canBeBroadcasted(uuid), false);

			mockServerResponse("show", fixtures.withSecondSignature);

			// 2. Add the third (final) signature from the third participant, and re-broadcast the transaction.
			await third.wallet
				.transaction()
				.addSignature(uuid, await third.wallet.coin().signatory().mnemonic(third.mnemonic));

			mockServerResponse("ready", [fixtures.withThirdSignature]);
			mockServerResponse("pending", []);

			await first.wallet.transaction().sync();

			assert.is(first.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(first.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(first.wallet.transaction().isAwaitingOurSignature(uuid), false);
			assert.is(first.wallet.transaction().isAwaitingOtherSignatures(uuid), false);
			assert.is(first.wallet.transaction().isAwaitingFinalSignature(uuid), false);

			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), false);
			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), false);

			assert.is(first.wallet.transaction().canBeSigned(uuid), false);
			assert.is(first.wallet.transaction().canBeBroadcasted(uuid), true);

			await second.wallet.transaction().sync();

			assert.is(second.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(second.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(second.wallet.transaction().isAwaitingOurSignature(uuid), false);
			assert.is(second.wallet.transaction().isAwaitingOtherSignatures(uuid), false);
			assert.is(second.wallet.transaction().isAwaitingFinalSignature(uuid), false);

			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), false);
			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), false);

			assert.is(second.wallet.transaction().canBeSigned(uuid), false);
			assert.is(second.wallet.transaction().canBeBroadcasted(uuid), true);

			await third.wallet.transaction().sync();

			assert.is(third.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(third.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(third.wallet.transaction().isAwaitingOurSignature(uuid), false);
			assert.is(third.wallet.transaction().isAwaitingOtherSignatures(uuid), false);
			assert.is(third.wallet.transaction().isAwaitingFinalSignature(uuid), false);

			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), false);
			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), false);

			assert.is(third.wallet.transaction().canBeSigned(uuid), false);
			assert.is(third.wallet.transaction().canBeBroadcasted(uuid), true);
		});

		test("should perform a 2 out of 3 registration with 2 mandatory keys", async () => {
			const { wallets, publicKeys } = await generateWallets({
				numberOfWallets: 3,
				profile,
				coinId: "LSK",
				networkId: "lsk.testnet",
			});

			const [first, second, third] = wallets;

			const { fee, transactionData } = await generateRegistrationTransactionData({
				wallet: first,
				timestamp: 133697283,
				minSignatures: 2,
				mandatoryKeys: publicKeys.slice(0, 2),
				optionalKeys: publicKeys.slice(2),
			});

			const createFixtures = (uuid: string) => {
				return {
					withFirstSignature: createMusigRegistrationFixture({
						uuid,
						min: 2,
						fee: "2000000000",
						wallet: first.wallet,
						mandatoryKeys: transactionData.data.mandatoryKeys,
						optionalKeys: transactionData.data.optionalKeys,
						signatures: [
							"503c269c7c0a92e2986fb101725640ab69fa6b1267d11a715254f70ebe3f9dde4a45fd05a3f025e25ad1d07204e344e4cc551dea7f6e1a20a99561dac41f7707",
							"",
							"503c269c7c0a92e2986fb101725640ab69fa6b1267d11a715254f70ebe3f9dde4a45fd05a3f025e25ad1d07204e344e4cc551dea7f6e1a20a99561dac41f7707",
							"",
						],
						timestamp: 133697283,
					}),

					withSecondSignature: createMusigRegistrationFixture({
						uuid,
						min: 2,
						wallet: first.wallet,
						fee: "2000000000",
						mandatoryKeys: transactionData.data.mandatoryKeys,
						optionalKeys: transactionData.data.optionalKeys,
						signatures: [
							"503c269c7c0a92e2986fb101725640ab69fa6b1267d11a715254f70ebe3f9dde4a45fd05a3f025e25ad1d07204e344e4cc551dea7f6e1a20a99561dac41f7707",
							"1bef5eeab8a0919e275100b71b6805327a48be4dfdc12177ea28b64e604c0bf68182a4f6b868ebaec56641d671e55ebac65bdb4b85248c69c1a18c9d453e900c",
							"503c269c7c0a92e2986fb101725640ab69fa6b1267d11a715254f70ebe3f9dde4a45fd05a3f025e25ad1d07204e344e4cc551dea7f6e1a20a99561dac41f7707",
							"",
						],
						timestamp: 133697283,
					}),

					withThirdSignature: createMusigRegistrationFixture({
						uuid,
						min: 2,
						wallet: first.wallet,
						fee: "2000000000",
						mandatoryKeys: transactionData.data.mandatoryKeys,
						optionalKeys: transactionData.data.optionalKeys,
						signatures: [
							"503c269c7c0a92e2986fb101725640ab69fa6b1267d11a715254f70ebe3f9dde4a45fd05a3f025e25ad1d07204e344e4cc551dea7f6e1a20a99561dac41f7707",
							"1bef5eeab8a0919e275100b71b6805327a48be4dfdc12177ea28b64e604c0bf68182a4f6b868ebaec56641d671e55ebac65bdb4b85248c69c1a18c9d453e900c",
							"503c269c7c0a92e2986fb101725640ab69fa6b1267d11a715254f70ebe3f9dde4a45fd05a3f025e25ad1d07204e344e4cc551dea7f6e1a20a99561dac41f7707",
							"7d5706b11df44658896c5e6862afcc16841f3649df9185ae1d5dfa5a2e6d1cc01f4afa9bc23bbf83dd03f9aeb6a16ab52b06ce627fcea33df3f036ae6dc5b001",
						],
						timestamp: 133697283,
					}),
				};
			};

			// // 1. Sign musig registration by first wallet's signature
			const uuid = await first.wallet.transaction().signMultiSignature(transactionData);
			const fixtures = createFixtures(uuid);

			// Broadcast the transaction to musig server with first wallet's  signature.
			// All participant wallets should see when calling wallet.transaction.sync()
			mockServerResponse("store", { id: uuid });
			const result = await first.wallet.transaction().broadcast(uuid);

			assert.is(result, { accepted: [uuid], errors: {}, rejected: [] });

			// Validate multi-signature registration data.
			assert.is(first.wallet.transaction().canBeBroadcasted(uuid), false);
			assert.is(first.wallet.transaction().canBeSigned(uuid), false);
			assert.is(first.wallet.transaction().transaction(uuid).fee(), fee.toNumber());
			assert.is(first.wallet.transaction().transaction(uuid).amount(), 0);
			assert.is(first.wallet.transaction().transaction(uuid).timestamp()).toBeDefined();
			assert.is(first.wallet.transaction().transaction(uuid).isMultiSignatureRegistration(), true);
			assert.is(first.wallet.transaction().transaction(uuid).usesMultiSignature(), true);

			const signedMultiSignatureData = first.wallet
				.transaction()
				.transaction(uuid)
				.get("multiSignature") as Record<string, any>;

			assert.is(signedMultiSignatureData.mandatoryKeys).toHaveLength(transactionData.data.mandatoryKeys.length);
			assert.is(signedMultiSignatureData.optionalKeys).toHaveLength(transactionData.data.optionalKeys.length);

			assert.is(signedMultiSignatureData.mandatoryKeys).toContainValues(transactionData.data.mandatoryKeys);
			assert.is(signedMultiSignatureData.optionalKeys).toContainValues(transactionData.data.optionalKeys);
			assert.is(signedMultiSignatureData.numberOfSignatures, 2);

			mockServerResponse("pending", [fixtures.withFirstSignature]);
			mockServerResponse("ready", []);

			await first.wallet.transaction().sync();

			assert.is(first.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(first.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(first.wallet.transaction().isAwaitingOurSignature(uuid), false);
			assert.is(first.wallet.transaction().isAwaitingOtherSignatures(uuid), true);
			assert.is(first.wallet.transaction().isAwaitingFinalSignature(uuid), true);

			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), true);
			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), true);

			assert.is(first.wallet.transaction().canBeSigned(uuid), false);
			assert.is(first.wallet.transaction().canBeBroadcasted(uuid), false);

			await second.wallet.transaction().sync();

			assert.is(second.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(second.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(second.wallet.transaction().isAwaitingOurSignature(uuid), true);
			assert.is(second.wallet.transaction().isAwaitingOtherSignatures(uuid), true);
			assert.is(second.wallet.transaction().isAwaitingFinalSignature(uuid), true);

			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), true);
			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), true);

			assert.is(second.wallet.transaction().canBeSigned(uuid), true);
			assert.is(second.wallet.transaction().canBeBroadcasted(uuid), false);

			await third.wallet.transaction().sync();
			//
			assert.is(third.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(third.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(third.wallet.transaction().isAwaitingOurSignature(uuid), true);
			assert.is(third.wallet.transaction().isAwaitingOtherSignatures(uuid), true);
			assert.is(third.wallet.transaction().isAwaitingFinalSignature(uuid), true);

			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), true);
			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), true);

			assert.is(third.wallet.transaction().canBeSigned(uuid), true);
			assert.is(third.wallet.transaction().canBeBroadcasted(uuid), false);

			mockServerResponse("show", fixtures.withFirstSignature);
			mockServerResponse("ready", []);
			mockServerResponse("pending", [fixtures.withSecondSignature]);

			// 2. Add the second signature from the second participant, and re-broadcast the transaction.
			await second.wallet
				.transaction()
				.addSignature(uuid, await second.wallet.coin().signatory().mnemonic(second.mnemonic));

			await first.wallet.transaction().sync();

			assert.is(first.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(first.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(first.wallet.transaction().isAwaitingOurSignature(uuid), false);
			assert.is(first.wallet.transaction().isAwaitingOtherSignatures(uuid), true);
			assert.is(first.wallet.transaction().isAwaitingFinalSignature(uuid), true);

			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), false);
			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), true);

			assert.is(first.wallet.transaction().canBeSigned(uuid), false);
			assert.is(first.wallet.transaction().canBeBroadcasted(uuid), false);

			await second.wallet.transaction().sync();

			assert.is(second.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(second.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(second.wallet.transaction().isAwaitingOurSignature(uuid), false);
			assert.is(second.wallet.transaction().isAwaitingOtherSignatures(uuid), true);
			assert.is(second.wallet.transaction().isAwaitingFinalSignature(uuid), true);

			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), false);
			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), true);

			assert.is(second.wallet.transaction().canBeSigned(uuid), false);
			assert.is(second.wallet.transaction().canBeBroadcasted(uuid), false);

			await third.wallet.transaction().sync();

			assert.is(third.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(third.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(third.wallet.transaction().isAwaitingOurSignature(uuid), true);
			assert.is(third.wallet.transaction().isAwaitingOtherSignatures(uuid), false);
			assert.is(third.wallet.transaction().isAwaitingFinalSignature(uuid), true);

			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), false);
			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), true);

			assert.is(third.wallet.transaction().canBeSigned(uuid), true);
			assert.is(third.wallet.transaction().canBeBroadcasted(uuid), false);

			mockServerResponse("show", fixtures.withSecondSignature);

			// 2. Add the third (final) signature from the third participant, and re-broadcast the transaction.
			await third.wallet
				.transaction()
				.addSignature(uuid, await third.wallet.coin().signatory().mnemonic(third.mnemonic));

			mockServerResponse("ready", [fixtures.withThirdSignature]);
			mockServerResponse("pending", []);

			await first.wallet.transaction().sync();

			assert.is(first.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(first.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(first.wallet.transaction().isAwaitingOurSignature(uuid), false);
			assert.is(first.wallet.transaction().isAwaitingOtherSignatures(uuid), false);
			assert.is(first.wallet.transaction().isAwaitingFinalSignature(uuid), false);

			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), false);
			assert.is(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), false);

			assert.is(first.wallet.transaction().canBeSigned(uuid), false);
			assert.is(first.wallet.transaction().canBeBroadcasted(uuid), true);

			await second.wallet.transaction().sync();

			assert.is(second.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(second.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(second.wallet.transaction().isAwaitingOurSignature(uuid), false);
			assert.is(second.wallet.transaction().isAwaitingOtherSignatures(uuid), false);
			assert.is(second.wallet.transaction().isAwaitingFinalSignature(uuid), false);

			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), false);
			assert.is(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), false);

			assert.is(second.wallet.transaction().canBeSigned(uuid), false);
			assert.is(second.wallet.transaction().canBeBroadcasted(uuid), true);

			await third.wallet.transaction().sync();

			assert.is(third.wallet.transaction().transaction(uuid).timestamp().isValid(), true);
			assert.is(third.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

			assert.is(third.wallet.transaction().isAwaitingOurSignature(uuid), false);
			assert.is(third.wallet.transaction().isAwaitingOtherSignatures(uuid), false);
			assert.is(third.wallet.transaction().isAwaitingFinalSignature(uuid), false);

			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]), false);
			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]), false);
			assert.is(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]), false);

			assert.is(third.wallet.transaction().canBeSigned(uuid), false);
			assert.is(third.wallet.transaction().canBeBroadcasted(uuid), true);
		});

		test("should generate musig address", async () => {
			const { wallets, publicKeys } = await generateWallets({
				numberOfWallets: 2,
				profile,
				coinId: "LSK",
				networkId: "lsk.testnet",
			});

			const [first] = wallets;

			const { transactionData } = await generateRegistrationTransactionData({
				wallet: first,
				timestamp: 133697283,
				minSignatures: 2,
				mandatoryKeys: publicKeys.slice(0, 2),
				optionalKeys: publicKeys.slice(2),
			});

			// 1. Sign musig registration by first wallet's signature
			const uuid = await first.wallet.transaction().signMultiSignature(transactionData);

			mockServerResponse("store", { id: uuid });

			const result = await first.wallet.transaction().broadcast(uuid);

			assert.is(result, { accepted: [uuid], errors: {}, rejected: [] });

			const { address } = await first.wallet.coin().address().fromMultiSignature({
				senderPublicKey: first.wallet.publicKey(),
			});

			assert.is(address, first.wallet.address());
		});
	});
});
