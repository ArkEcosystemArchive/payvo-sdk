/* eslint-disable jest/expect-expect */
import "jest-extended";
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

describe("ARK", () => {
	let profile: IProfile;
	const { mockServerResponse, resetServerResponseMocks } = mockMusigServer({
		url: "https://ark-test-musig.payvo.com",
	});

	beforeAll(() => {
		bootContainer();

		// Default mocks
		nock("https://ark-test.payvo.com:443")
			.get("/api/blockchain")
			.reply(200, require("../fixtures/client/blockchain.json"))
			.get("/api/node/configuration")
			.reply(200, require("../fixtures/client/configuration.json"))
			.get("/api/peers")
			.reply(200, require("../fixtures/client/peers.json"))
			.get("/api/node/configuration/crypto")
			.reply(200, require("../fixtures/client/cryptoConfiguration.json"))
			.get("/api/node/syncing")
			.reply(200, require("../fixtures/client/syncing.json"))
			// Wallet mocks
			.get("/api/wallets/DABCrsfEqhtdzmBrE2AU5NNmdUFCGXKEkr")
			.reply(200, require("../fixtures/wallets/DABCrsfEqhtdzmBrE2AU5NNmdUFCGXKEkr.json"))
			.get("/api/wallets/DCX2kvwgL2mrd9GjyYAbfXLGGXWwgN3Px7")
			.reply(200, require("../fixtures/wallets/DCX2kvwgL2mrd9GjyYAbfXLGGXWwgN3Px7.json"))
			.get("/api/wallets/DDHk393YcsxTPN1H5SWTcbjfnCRmF1iBR8")
			.reply(200, require("../fixtures/wallets/DDHk393YcsxTPN1H5SWTcbjfnCRmF1iBR8.json"))
			.persist();

		profile = new Profile({ id: "profile-id", name: "name", avatar: "avatar", data: "" });
	});

	afterEach(() => {
		resetServerResponseMocks();
	});

	describe("MuSig Registration", () => {
		it("should perform a 2 out of 2 registration", async () => {
			const { wallets, publicKeys } = await generateWallets({
				numberOfWallets: 2,
				profile,
				coinId: "ARK",
				networkId: "ark.devnet",
			});

			const [first, second] = wallets;

			const { fee, transactionData } = await generateRegistrationTransactionData({
				wallet: first,
				timestamp: 1597806483,
				publicKeys,
				minSignatures: 2,
			});

			const createFixtures = (uuid: string) => {
				return {
					withFirstSignature: createMusigRegistrationFixture({
						uuid,
						min: 2,
						wallet: first.wallet,
						publicKeys,
						signatures: first.wallet.transaction().transaction(uuid).toObject().data.signatures,
						timestamp: 1597806483,
					}),

					withSecondSignature: createMusigRegistrationFixture({
						uuid,
						min: 2,
						wallet: first.wallet,
						publicKeys,
						signatures: [
							"002d2edfa6f8dad244bbd0b0f1f7bb90fbd0c9fd9bc6abb423eedd8ddb128e4c400defc7e955cc4665fde985b7d90fe8560e111ae4967e2a59f20eeb84e9b4c586",
							"010f508bca87011ceb1689e50d6d5f3d60ff312381467281a3394f60c92b0755f5ba7c5d98393053486bfd0779bee7c077286b93a4bc70dda1c1d72d3857994ba3",
						],
						timestamp: 1597806483,
					}),

					withFinalSignature: createMusigRegistrationFixture({
						uuid,
						min: 2,
						wallet: first.wallet,
						publicKeys,
						signatures: [
							"002d2edfa6f8dad244bbd0b0f1f7bb90fbd0c9fd9bc6abb423eedd8ddb128e4c400defc7e955cc4665fde985b7d90fe8560e111ae4967e2a59f20eeb84e9b4c586",
							"010f508bca87011ceb1689e50d6d5f3d60ff312381467281a3394f60c92b0755f5ba7c5d98393053486bfd0779bee7c077286b93a4bc70dda1c1d72d3857994ba3",
						],
						signature:
							"89ff2bc9549417da8f150257196e0844d6ab376b2695b6a9ce632e1167a85045acc5fa6210208b1dcdba1f8c59270fcd02d44c15ef090f44235ea10bf2beb45f",
						timestamp: 1597806483,
					}),
				};
			};

			// 1. Sign musig registration by first
			const uuid = await first.wallet.transaction().signMultiSignature(transactionData);
			const fixtures = createFixtures(uuid);

			// Broadcast the transaction to musig server with first's signature.
			// All participant wallets should see when calling wallet.transaction.sync()
			mockServerResponse("store", { id: uuid });
			const result = await first.wallet.transaction().broadcast(uuid);

			expect(result).toEqual({ accepted: [uuid], errors: {}, rejected: [] });

			// Validate multi-signature registration data.
			expect(first.wallet.transaction().canBeBroadcasted(uuid)).toBeFalse();
			expect(first.wallet.transaction().canBeSigned(uuid)).toBeFalse();
			expect(first.wallet.transaction().transaction(uuid).fee()).toEqual(fee.toNumber());
			expect(first.wallet.transaction().transaction(uuid).amount()).toEqual(0);
			expect(first.wallet.transaction().transaction(uuid).timestamp()).toBeDefined();
			expect(first.wallet.transaction().transaction(uuid).isMultiSignatureRegistration()).toBeTrue();
			expect(first.wallet.transaction().transaction(uuid).usesMultiSignature()).toBeTrue();
			expect(first.wallet.transaction().transaction(uuid).get("multiSignature")).toEqual({
				min: 2,
				publicKeys,
			});

			mockServerResponse("pending", [fixtures.withFirstSignature]);
			mockServerResponse("ready", []);

			await first.wallet.transaction().sync();

			expect(first.wallet.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			expect(first.wallet.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);

			expect(first.wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
			expect(first.wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeTrue();
			expect(first.wallet.transaction().isAwaitingFinalSignature(uuid)).toBeTrue();

			expect(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeFalse();
			expect(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeTrue();

			expect(first.wallet.transaction().canBeSigned(uuid)).toBeFalse();
			expect(first.wallet.transaction().canBeBroadcasted(uuid)).toBeFalse();

			await second.wallet.transaction().sync();

			expect(second.wallet.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			expect(second.wallet.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);

			expect(second.wallet.transaction().isAwaitingOurSignature(uuid)).toBeTrue();
			expect(second.wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
			expect(second.wallet.transaction().isAwaitingFinalSignature(uuid)).toBeTrue();

			expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeFalse();
			expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeTrue();

			expect(second.wallet.transaction().canBeSigned(uuid)).toBeTrue();
			expect(second.wallet.transaction().canBeBroadcasted(uuid)).toBeFalse();

			mockServerResponse("show", fixtures.withFirstSignature);
			mockServerResponse("pending", []);
			mockServerResponse("ready", [fixtures.withSecondSignature]);

			// 2. Add the second signature from the second participant, and re-broadcast the transaction.
			await second.wallet
				.transaction()
				.addSignature(uuid, await second.wallet.coin().signatory().mnemonic(second.mnemonic));

			await second.wallet.transaction().sync();

			expect(second.wallet.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			expect(second.wallet.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);

			expect(second.wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
			expect(second.wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
			expect(second.wallet.transaction().isAwaitingFinalSignature(uuid)).toBeTrue();

			// When awaiting final signature, transaction awaits initiator to sign again the final signature.
			expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeTrue();
			expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeFalse();

			expect(second.wallet.transaction().canBeSigned(uuid)).toBeFalse();
			expect(second.wallet.transaction().canBeBroadcasted(uuid)).toBeFalse();

			await first.wallet.transaction().sync();

			expect(first.wallet.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			expect(first.wallet.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);

			expect(first.wallet.transaction().isAwaitingOurSignature(uuid)).toBeTrue();
			expect(first.wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
			expect(first.wallet.transaction().isAwaitingFinalSignature(uuid)).toBeTrue();

			expect(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeTrue();
			expect(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeFalse();

			mockServerResponse("show", fixtures.withSecondSignature);

			// 4. Add the final signature by signing the whole transaction with the signatures of all participants.
			await first.wallet
				.transaction()
				.addSignature(uuid, await first.wallet.coin().signatory().mnemonic(first.mnemonic));

			mockServerResponse("pending", []);
			mockServerResponse("ready", [fixtures.withFinalSignature]);

			await first.wallet.transaction().sync();

			expect(first.wallet.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			expect(first.wallet.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);

			expect(first.wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
			expect(first.wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
			expect(first.wallet.transaction().isAwaitingFinalSignature(uuid)).toBeFalse();

			expect(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeFalse();
			expect(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeFalse();

			expect(first.wallet.transaction().canBeSigned(uuid)).toBeFalse();
			expect(first.wallet.transaction().canBeBroadcasted(uuid)).toBeTrue();

			await second.wallet.transaction().sync();

			expect(second.wallet.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			expect(second.wallet.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);

			expect(second.wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
			expect(second.wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
			expect(second.wallet.transaction().isAwaitingFinalSignature(uuid)).toBeFalse();

			expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeFalse();
			expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeFalse();

			expect(second.wallet.transaction().canBeSigned(uuid)).toBeFalse();
			expect(second.wallet.transaction().canBeBroadcasted(uuid)).toBeTrue();
		});

		it("should perform a 2 out of 3 registration", async () => {
			const { wallets, publicKeys } = await generateWallets({
				numberOfWallets: 3,
				profile,
				coinId: "ARK",
				networkId: "ark.devnet",
			});

			const [first, second, third] = wallets;

			const { fee, transactionData } = await generateRegistrationTransactionData({
				wallet: first,
				timestamp: 1597806483,
				publicKeys,
				minSignatures: 2,
			});

			const createFixtures = (uuid: string) => {
				return {
					withFirstSignature: createMusigRegistrationFixture({
						uuid,
						min: 2,
						wallet: first.wallet,
						publicKeys,
						fee: "2000000000",
						signatures: first.wallet.transaction().transaction(uuid).toObject().data.signatures,
						timestamp: 1597806483,
					}),

					withSecondSignature: createMusigRegistrationFixture({
						uuid,
						min: 2,
						wallet: first.wallet,
						publicKeys,
						fee: "2000000000",
						signatures: [
							"003c6d5f1da5a29d93bd7b742d5e2ddd0e5511f53f1d1328a55ddca99d210b7282488ff9b7fb46160db39bbb78789acead1fb3da34c3c4d9f98b679257b23c31dd",
							"01d728cbc527f545b0b3a7bdcd1dc30e2a55e57eef7779ca2b3928959ad2e7d8bdb3eed0dd42d2caa08075af07edb79667f3f464fa45fe7b0c7dee415266b6ae21",
						],
						timestamp: 1597806483,
					}),

					withThirdSignature: createMusigRegistrationFixture({
						uuid,
						min: 2,
						wallet: first.wallet,
						publicKeys,
						fee: "2000000000",
						signatures: [
							"003c6d5f1da5a29d93bd7b742d5e2ddd0e5511f53f1d1328a55ddca99d210b7282488ff9b7fb46160db39bbb78789acead1fb3da34c3c4d9f98b679257b23c31dd",
							"01d728cbc527f545b0b3a7bdcd1dc30e2a55e57eef7779ca2b3928959ad2e7d8bdb3eed0dd42d2caa08075af07edb79667f3f464fa45fe7b0c7dee415266b6ae21",
							"0276b492fee1500358a43bbc85579f11b9fe63d21feb1bc84310f069ad15cc0f160e2e7b8d2c8ce0afe544439aa1d3394fed6579be4d1e1a8a4bb6b8efa3545731",
						],
						timestamp: 1597806483,
					}),

					withFinalSignature: createMusigRegistrationFixture({
						uuid,
						min: 2,
						wallet: first.wallet,
						publicKeys,
						fee: "2000000000",
						signatures: [
							"003c6d5f1da5a29d93bd7b742d5e2ddd0e5511f53f1d1328a55ddca99d210b7282488ff9b7fb46160db39bbb78789acead1fb3da34c3c4d9f98b679257b23c31dd",
							"01d728cbc527f545b0b3a7bdcd1dc30e2a55e57eef7779ca2b3928959ad2e7d8bdb3eed0dd42d2caa08075af07edb79667f3f464fa45fe7b0c7dee415266b6ae21",
							"0276b492fee1500358a43bbc85579f11b9fe63d21feb1bc84310f069ad15cc0f160e2e7b8d2c8ce0afe544439aa1d3394fed6579be4d1e1a8a4bb6b8efa3545731",
						],
						signature:
							"1e9794ace1991a1c37b4e54409c36f712a980310db3baa687cea20a93f741dc7c6744e7780c62ad4a13c6b7219b45b15ded6f7350630a8a2eccbe4740c61ab1f",
						timestamp: 1597806483,
					}),
				};
			};

			// 1. Sign musig registration with initiator wallet's signature
			const uuid = await first.wallet.transaction().signMultiSignature(transactionData);
			const fixtures = createFixtures(uuid);

			mockServerResponse("store", { id: uuid });

			// Broadcast the transaction to musig server with first's signature.
			// All participant wallets should see when calling wallet.transaction.sync()
			const result = await first.wallet.transaction().broadcast(uuid);
			expect(result).toEqual({ accepted: [uuid], errors: {}, rejected: [] });

			// Validate multi-signature registration data.
			expect(first.wallet.transaction().canBeBroadcasted(uuid)).toBeFalse();
			expect(first.wallet.transaction().canBeSigned(uuid)).toBeFalse();
			expect(first.wallet.transaction().transaction(uuid).fee()).toEqual(fee.toNumber());
			expect(first.wallet.transaction().transaction(uuid).amount()).toEqual(0);
			expect(first.wallet.transaction().transaction(uuid).timestamp()).toBeDefined();
			expect(first.wallet.transaction().transaction(uuid).isMultiSignatureRegistration()).toBeTrue();
			expect(first.wallet.transaction().transaction(uuid).usesMultiSignature()).toBeTrue();
			expect(first.wallet.transaction().transaction(uuid).get("multiSignature")).toEqual({
				min: 2,
				publicKeys,
			});

			mockServerResponse("pending", [fixtures.withFirstSignature]);
			mockServerResponse("ready", []);

			await first.wallet.transaction().sync();

			expect(first.wallet.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			expect(first.wallet.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);

			expect(first.wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
			expect(first.wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeTrue();
			expect(first.wallet.transaction().isAwaitingFinalSignature(uuid)).toBeTrue();

			expect(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeFalse();
			expect(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeTrue();
			expect(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2])).toBeTrue();

			await second.wallet.transaction().sync();

			expect(second.wallet.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			expect(second.wallet.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);

			expect(second.wallet.transaction().isAwaitingOurSignature(uuid)).toBeTrue();
			expect(second.wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeTrue();
			expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeFalse();
			expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeTrue();
			expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2])).toBeTrue();

			mockServerResponse("show", fixtures.withFirstSignature);
			mockServerResponse("ready", []);
			mockServerResponse("pending", [fixtures.withSecondSignature]);

			// 2. Add the second signature from the second participant, and re-broadcast the transaction.
			await second.wallet
				.transaction()
				.addSignature(uuid, await second.wallet.coin().signatory().mnemonic(second.mnemonic));

			await second.wallet.transaction().sync();

			expect(second.wallet.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			expect(second.wallet.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);

			expect(second.wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
			expect(second.wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeTrue();
			expect(second.wallet.transaction().isAwaitingFinalSignature(uuid)).toBeTrue();

			expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeFalse();
			expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeFalse();
			expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2])).toBeTrue();

			// 3. Add the third signature and re-broadcast the transaction.
			mockServerResponse("show", fixtures.withSecondSignature);

			await third.wallet
				.transaction()
				.addSignature(uuid, await third.wallet.coin().signatory().mnemonic(third.mnemonic));

			mockServerResponse("ready", [fixtures.withThirdSignature]);
			mockServerResponse("pending", []);

			await third.wallet.transaction().sync();

			expect(third.wallet.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			expect(third.wallet.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);

			expect(third.wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
			expect(third.wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
			expect(third.wallet.transaction().isAwaitingFinalSignature(uuid)).toBeTrue();

			expect(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeTrue();
			expect(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeFalse();
			expect(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2])).toBeFalse();

			await second.wallet.transaction().sync();

			expect(second.wallet.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			expect(second.wallet.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);

			expect(second.wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
			expect(second.wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
			expect(second.wallet.transaction().isAwaitingFinalSignature(uuid)).toBeTrue();

			expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeTrue();
			expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeFalse();
			expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2])).toBeFalse();

			await first.wallet.transaction().sync();

			expect(first.wallet.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			expect(first.wallet.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);

			expect(first.wallet.transaction().isAwaitingOurSignature(uuid)).toBeTrue();
			expect(first.wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
			expect(first.wallet.transaction().isAwaitingFinalSignature(uuid)).toBeTrue();

			expect(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeTrue();
			expect(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeFalse();
			expect(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2])).toBeFalse();

			mockServerResponse("show", fixtures.withThirdSignature);

			// 4. Add the final signature by signing the whole transaction with the signatures of all participants.
			await first.wallet
				.transaction()
				.addSignature(uuid, await first.wallet.coin().signatory().mnemonic(first.mnemonic));

			mockServerResponse("ready", [fixtures.withFinalSignature]);

			await first.wallet.transaction().sync();

			expect(first.wallet.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			expect(first.wallet.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);

			expect(first.wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
			expect(first.wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
			expect(first.wallet.transaction().isAwaitingFinalSignature(uuid)).toBeFalse();

			expect(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeFalse();
			expect(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeFalse();
			expect(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2])).toBeFalse();

			expect(first.wallet.transaction().canBeSigned(uuid)).toBeFalse();
			expect(first.wallet.transaction().canBeBroadcasted(uuid)).toBeTrue();

			await second.wallet.transaction().sync();

			expect(second.wallet.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			expect(second.wallet.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);

			expect(second.wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
			expect(second.wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
			expect(second.wallet.transaction().isAwaitingFinalSignature(uuid)).toBeFalse();

			expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeFalse();
			expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeFalse();

			expect(second.wallet.transaction().canBeSigned(uuid)).toBeFalse();
			expect(second.wallet.transaction().canBeBroadcasted(uuid)).toBeTrue();

			await third.wallet.transaction().sync();

			expect(third.wallet.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			expect(third.wallet.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);

			expect(third.wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
			expect(third.wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
			expect(third.wallet.transaction().isAwaitingFinalSignature(uuid)).toBeFalse();

			expect(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeFalse();
			expect(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeFalse();

			expect(third.wallet.transaction().canBeSigned(uuid)).toBeFalse();
			expect(third.wallet.transaction().canBeBroadcasted(uuid)).toBeTrue();
		});

		it("should keep ready musig transactions in sync with musig server", async () => {
			const { wallets, publicKeys } = await generateWallets({
				numberOfWallets: 2,
				profile,
				coinId: "ARK",
				networkId: "ark.devnet",
			});

			const [first] = wallets;

			const { transactionData } = await generateRegistrationTransactionData({
				wallet: first,
				timestamp: 1597806483,
				publicKeys,
				minSignatures: 2,
			});

			const createFixtures = (uuid: string) => {
				return {
					withFinalSignature: createMusigRegistrationFixture({
						uuid,
						min: 2,
						wallet: first.wallet,
						publicKeys,
						signatures: [
							"002d2edfa6f8dad244bbd0b0f1f7bb90fbd0c9fd9bc6abb423eedd8ddb128e4c400defc7e955cc4665fde985b7d90fe8560e111ae4967e2a59f20eeb84e9b4c586",
							"010f508bca87011ceb1689e50d6d5f3d60ff312381467281a3394f60c92b0755f5ba7c5d98393053486bfd0779bee7c077286b93a4bc70dda1c1d72d3857994ba3",
						],
						signature:
							"89ff2bc9549417da8f150257196e0844d6ab376b2695b6a9ce632e1167a85045acc5fa6210208b1dcdba1f8c59270fcd02d44c15ef090f44235ea10bf2beb45f",
						timestamp: 1597806483,
					}),
				};
			};

			// Sign musig registration first to get the uuid.
			const uuid = await first.wallet.transaction().signMultiSignature(transactionData);
			const fixtures = createFixtures(uuid);

			// Musig server has 1 ready transaction.
			mockServerResponse("pending", []);
			mockServerResponse("ready", [fixtures.withFinalSignature]);

			await first.wallet.transaction().sync();

			expect(Object.keys(first.wallet.transaction().signed())).toHaveLength(1);
			expect(Object.keys(first.wallet.transaction().signed())).toContain(uuid);

			// Musig server has 0 ready transactions.
			mockServerResponse("pending", []);
			mockServerResponse("ready", []);

			await first.wallet.transaction().sync();

			expect(Object.values(first.wallet.transaction().signed())).toHaveLength(0);
		});

		it("should generate musig address", async () => {
			const { wallets, publicKeys } = await generateWallets({
				numberOfWallets: 2,
				profile,
				coinId: "ARK",
				networkId: "ark.devnet",
			});

			const [first] = wallets;

			const { transactionData } = await generateRegistrationTransactionData({
				wallet: first,
				timestamp: 1597806483,
				publicKeys,
				minSignatures: 2,
			});

			const createFixtures = (uuid: string) => {
				return {
					generatedAddress: "DJV8ebA7YEeShMmY6FFnjUK7dykqL1ZFrH",
					withFirstSignature: createMusigRegistrationFixture({
						uuid,
						min: 2,
						wallet: first.wallet,
						publicKeys,
						signatures: first.wallet.transaction().transaction(uuid).toObject().data.signatures,
						timestamp: 1597806483,
					}),
				};
			};

			// 1. Sign musig registration by first
			const uuid = await first.wallet.transaction().signMultiSignature(transactionData);
			const fixtures = createFixtures(uuid);

			// Broadcast the transaction to musig server with first's signature.
			mockServerResponse("store", { id: uuid });

			const result = await first.wallet.transaction().broadcast(uuid);

			expect(result).toEqual({ accepted: [uuid], errors: {}, rejected: [] });

			const { address } = await first.wallet.coin().address().fromMultiSignature({
				min: fixtures.withFirstSignature.data.multiSignature.min,
				publicKeys: fixtures.withFirstSignature.data.multiSignature.publicKeys,
			});

			expect(address).toEqual(fixtures.generatedAddress);
		});

		it("should avoid adding duplicate signatures", async () => {
			const { wallets, publicKeys } = await generateWallets({
				numberOfWallets: 2,
				profile,
				coinId: "ARK",
				networkId: "ark.devnet",
			});

			const [first, second] = wallets;

			const { fee, transactionData } = await generateRegistrationTransactionData({
				wallet: first,
				timestamp: 1597806483,
				publicKeys,
				minSignatures: 2,
			});

			const createFixtures = (uuid: string) => {
				return {
					withFirstSignature: createMusigRegistrationFixture({
						uuid,
						min: 2,
						wallet: first.wallet,
						publicKeys,
						signatures: first.wallet.transaction().transaction(uuid).toObject().data.signatures,
						timestamp: 1597806483,
					}),

					withSecondSignature: createMusigRegistrationFixture({
						uuid,
						min: 2,
						wallet: first.wallet,
						publicKeys,
						signatures: [
							"002d2edfa6f8dad244bbd0b0f1f7bb90fbd0c9fd9bc6abb423eedd8ddb128e4c400defc7e955cc4665fde985b7d90fe8560e111ae4967e2a59f20eeb84e9b4c586",
							"010f508bca87011ceb1689e50d6d5f3d60ff312381467281a3394f60c92b0755f5ba7c5d98393053486bfd0779bee7c077286b93a4bc70dda1c1d72d3857994ba3",
						],
						timestamp: 1597806483,
					}),
				};
			};

			// 1. Sign musig registration by first
			const uuid = await first.wallet.transaction().signMultiSignature(transactionData);
			const fixtures = createFixtures(uuid);

			// Broadcast the transaction to musig server with first's signature.
			mockServerResponse("store", { id: uuid });
			const result = await first.wallet.transaction().broadcast(uuid);

			expect(result).toEqual({ accepted: [uuid], errors: {}, rejected: [] });

			// Validate multi-signature registration data.
			expect(first.wallet.transaction().canBeBroadcasted(uuid)).toBeFalse();
			expect(first.wallet.transaction().canBeSigned(uuid)).toBeFalse();
			expect(first.wallet.transaction().transaction(uuid).fee()).toEqual(fee.toNumber());
			expect(first.wallet.transaction().transaction(uuid).amount()).toEqual(0);
			expect(first.wallet.transaction().transaction(uuid).timestamp()).toBeDefined();
			expect(first.wallet.transaction().transaction(uuid).isMultiSignatureRegistration()).toBeTrue();
			expect(first.wallet.transaction().transaction(uuid).usesMultiSignature()).toBeTrue();
			expect(first.wallet.transaction().transaction(uuid).get("multiSignature")).toEqual({
				min: 2,
				publicKeys,
			});

			mockServerResponse("pending", [fixtures.withFirstSignature]);
			mockServerResponse("ready", []);

			await first.wallet.transaction().sync();

			// 1. Check the first signature
			const transactionDataWithFirstSignature = first.wallet.transaction().transaction(uuid).data().data();
			expect(transactionDataWithFirstSignature.signatures).toHaveLength(1);
			expect(transactionDataWithFirstSignature.signatures[0]).toEqual(
				fixtures.withFirstSignature.data.signatures[0],
			);

			await second.wallet.transaction().sync();

			mockServerResponse("show", fixtures.withFirstSignature);
			mockServerResponse("pending", []);
			mockServerResponse("ready", [fixtures.withSecondSignature]);

			// 2. Sign with second participant
			await second.wallet
				.transaction()
				.addSignature(uuid, await second.wallet.coin().signatory().mnemonic(second.mnemonic));

			await second.wallet.transaction().sync();

			const transactionDataWithSecondSignature = second.wallet.transaction().transaction(uuid).data().data();
			expect(transactionDataWithSecondSignature.signatures).toHaveLength(2);
			expect(transactionDataWithSecondSignature.signatures).toEqual(fixtures.withSecondSignature.data.signatures);

			// Add same signature again.
			await second.wallet
				.transaction()
				.addSignature(uuid, await second.wallet.coin().signatory().mnemonic(second.mnemonic));

			const transactionWithUniqueSignatures = second.wallet.transaction().transaction(uuid).data().data();
			expect(transactionWithUniqueSignatures.signatures).toHaveLength(2);
			expect(transactionWithUniqueSignatures.signatures).toEqual(fixtures.withSecondSignature.data.signatures);
		});
	});
});
