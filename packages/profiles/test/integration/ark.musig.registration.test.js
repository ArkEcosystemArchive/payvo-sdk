import "reflect-metadata";
import { describe } from "@payvo/sdk-test";

import { bootContainer } from "../mocking";
import { Profile } from "../../source/profile";
import {
	mockMusigServer,
	generateWallets,
	createMusigRegistrationFixture,
	generateRegistrationTransactionData,
} from "./musig.test.helpers";

let profile;

describe("ARK MuSig Registration", ({ assert, afterEach, beforeEach, it, nock }) => {
	beforeEach((context) => {
		bootContainer({ flush: true });

		// Default mocks
		nock.fake("https://ark-test.payvo.com:443")
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

		const { mockServerResponse, resetServerResponseMocks } = mockMusigServer(
			nock, "https://ark-test-musig.payvo.com",
		);

		context.mockServerResponse = mockServerResponse;
		context.resetServerResponseMocks = resetServerResponseMocks;
	});

	afterEach((context) => {
		context.resetServerResponseMocks();
	});

	it("should perform a 2 out of 2 registration", async (context) => {
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

		const createFixtures = (uuid) => {
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
		context.mockServerResponse("store", { id: uuid });
		const result = await first.wallet.transaction().broadcast(uuid);

		assert.equal(result, { accepted: [uuid], errors: {}, rejected: [] });

		// Validate multi-signature registration data.
		assert.false(first.wallet.transaction().canBeBroadcasted(uuid));
		assert.false(first.wallet.transaction().canBeSigned(uuid));
		assert.is(first.wallet.transaction().transaction(uuid).fee(), fee.toNumber());
		assert.is(first.wallet.transaction().transaction(uuid).amount(), 0);
		assert.defined(first.wallet.transaction().transaction(uuid).timestamp());
		assert.true(first.wallet.transaction().transaction(uuid).isMultiSignatureRegistration());
		assert.true(first.wallet.transaction().transaction(uuid).usesMultiSignature());
		assert.equal(first.wallet.transaction().transaction(uuid).get("multiSignature"), {
			min: 2,
			publicKeys,
		});

		context.mockServerResponse("pending", [fixtures.withFirstSignature]);
		context.mockServerResponse("ready", []);

		await first.wallet.transaction().sync();

		assert.true(first.wallet.transaction().transaction(uuid).timestamp().isValid());
		assert.is(first.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

		assert.false(first.wallet.transaction().isAwaitingOurSignature(uuid));
		assert.true(first.wallet.transaction().isAwaitingOtherSignatures(uuid));
		assert.true(first.wallet.transaction().isAwaitingFinalSignature(uuid));

		assert.false(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]));
		assert.true(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]));

		assert.false(first.wallet.transaction().canBeSigned(uuid));
		assert.false(first.wallet.transaction().canBeBroadcasted(uuid));

		await second.wallet.transaction().sync();

		assert.true(second.wallet.transaction().transaction(uuid).timestamp().isValid());
		assert.is(second.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

		assert.true(second.wallet.transaction().isAwaitingOurSignature(uuid));
		assert.false(second.wallet.transaction().isAwaitingOtherSignatures(uuid));
		assert.true(second.wallet.transaction().isAwaitingFinalSignature(uuid));

		assert.false(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]));
		assert.true(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]));

		assert.true(second.wallet.transaction().canBeSigned(uuid));
		assert.false(second.wallet.transaction().canBeBroadcasted(uuid));

		context.mockServerResponse("show", fixtures.withFirstSignature);
		context.mockServerResponse("pending", []);
		context.mockServerResponse("ready", [fixtures.withSecondSignature]);

		// 2. Add the second signature from the second participant, and re-broadcast the transaction.
		await second.wallet
			.transaction()
			.addSignature(uuid, await second.wallet.coin().signatory().mnemonic(second.mnemonic));

		await second.wallet.transaction().sync();

		assert.true(second.wallet.transaction().transaction(uuid).timestamp().isValid());
		assert.is(second.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

		assert.false(second.wallet.transaction().isAwaitingOurSignature(uuid));
		assert.false(second.wallet.transaction().isAwaitingOtherSignatures(uuid));
		assert.true(second.wallet.transaction().isAwaitingFinalSignature(uuid));

		// When awaiting final signature, transaction awaits initiator to sign again the final signature.
		assert.true(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]));
		assert.false(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]));

		assert.false(second.wallet.transaction().canBeSigned(uuid));
		assert.false(second.wallet.transaction().canBeBroadcasted(uuid));

		await first.wallet.transaction().sync();

		assert.true(first.wallet.transaction().transaction(uuid).timestamp().isValid());
		assert.is(first.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

		assert.true(first.wallet.transaction().isAwaitingOurSignature(uuid));
		assert.false(first.wallet.transaction().isAwaitingOtherSignatures(uuid));
		assert.true(first.wallet.transaction().isAwaitingFinalSignature(uuid));

		assert.true(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]));
		assert.false(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]));

		context.mockServerResponse("show", fixtures.withSecondSignature);

		// 4. Add the final signature by signing the whole transaction with the signatures of all participants.
		await first.wallet
			.transaction()
			.addSignature(uuid, await first.wallet.coin().signatory().mnemonic(first.mnemonic));

		context.mockServerResponse("pending", []);
		context.mockServerResponse("ready", [fixtures.withFinalSignature]);

		await first.wallet.transaction().sync();

		assert.true(first.wallet.transaction().transaction(uuid).timestamp().isValid());
		assert.is(first.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

		assert.false(first.wallet.transaction().isAwaitingOurSignature(uuid));
		assert.false(first.wallet.transaction().isAwaitingOtherSignatures(uuid));
		assert.false(first.wallet.transaction().isAwaitingFinalSignature(uuid));

		assert.false(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]));
		assert.false(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]));

		assert.false(first.wallet.transaction().canBeSigned(uuid));
		assert.true(first.wallet.transaction().canBeBroadcasted(uuid));

		await second.wallet.transaction().sync();

		assert.true(second.wallet.transaction().transaction(uuid).timestamp().isValid());
		assert.is(second.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

		assert.false(second.wallet.transaction().isAwaitingOurSignature(uuid));
		assert.false(second.wallet.transaction().isAwaitingOtherSignatures(uuid));
		assert.false(second.wallet.transaction().isAwaitingFinalSignature(uuid));

		assert.false(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]));
		assert.false(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]));

		assert.false(second.wallet.transaction().canBeSigned(uuid));
		assert.true(second.wallet.transaction().canBeBroadcasted(uuid));
	});

	it("should perform a 2 out of 3 registration", async (context) => {
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

		const createFixtures = (uuid) => {
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

		context.mockServerResponse("store", { id: uuid });

		// Broadcast the transaction to musig server with first's signature.
		// All participant wallets should see when calling wallet.transaction.sync()
		const result = await first.wallet.transaction().broadcast(uuid);
		assert.equal(result, { accepted: [uuid], errors: {}, rejected: [] });

		// Validate multi-signature registration data.
		assert.false(first.wallet.transaction().canBeBroadcasted(uuid));
		assert.false(first.wallet.transaction().canBeSigned(uuid));
		assert.is(first.wallet.transaction().transaction(uuid).fee(), fee.toNumber());
		assert.is(first.wallet.transaction().transaction(uuid).amount(), 0);
		assert.defined(first.wallet.transaction().transaction(uuid).timestamp());
		assert.true(first.wallet.transaction().transaction(uuid).isMultiSignatureRegistration());
		assert.true(first.wallet.transaction().transaction(uuid).usesMultiSignature());
		assert.equal(first.wallet.transaction().transaction(uuid).get("multiSignature"), {
			min: 2,
			publicKeys,
		});

		context.mockServerResponse("pending", [fixtures.withFirstSignature]);
		context.mockServerResponse("ready", []);

		await first.wallet.transaction().sync();

		assert.true(first.wallet.transaction().transaction(uuid).timestamp().isValid());
		assert.is(first.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

		assert.false(first.wallet.transaction().isAwaitingOurSignature(uuid));
		assert.true(first.wallet.transaction().isAwaitingOtherSignatures(uuid));
		assert.true(first.wallet.transaction().isAwaitingFinalSignature(uuid));

		assert.false(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]));
		assert.true(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]));
		assert.true(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]));

		await second.wallet.transaction().sync();

		assert.true(second.wallet.transaction().transaction(uuid).timestamp().isValid());
		assert.is(second.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

		assert.true(second.wallet.transaction().isAwaitingOurSignature(uuid));
		assert.true(second.wallet.transaction().isAwaitingOtherSignatures(uuid));
		assert.false(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]));
		assert.true(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]));
		assert.true(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]));

		context.mockServerResponse("show", fixtures.withFirstSignature);
		context.mockServerResponse("ready", []);
		context.mockServerResponse("pending", [fixtures.withSecondSignature]);

		// 2. Add the second signature from the second participant, and re-broadcast the transaction.
		await second.wallet
			.transaction()
			.addSignature(uuid, await second.wallet.coin().signatory().mnemonic(second.mnemonic));

		await second.wallet.transaction().sync();

		assert.true(second.wallet.transaction().transaction(uuid).timestamp().isValid());
		assert.is(second.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

		assert.false(second.wallet.transaction().isAwaitingOurSignature(uuid));
		assert.true(second.wallet.transaction().isAwaitingOtherSignatures(uuid));
		assert.true(second.wallet.transaction().isAwaitingFinalSignature(uuid));

		assert.false(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]));
		assert.false(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]));
		assert.true(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]));

		// 3. Add the third signature and re-broadcast the transaction.
		context.mockServerResponse("show", fixtures.withSecondSignature);

		await third.wallet
			.transaction()
			.addSignature(uuid, await third.wallet.coin().signatory().mnemonic(third.mnemonic));

		context.mockServerResponse("ready", [fixtures.withThirdSignature]);
		context.mockServerResponse("pending", []);

		await third.wallet.transaction().sync();

		assert.true(third.wallet.transaction().transaction(uuid).timestamp().isValid());
		assert.is(third.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

		assert.false(third.wallet.transaction().isAwaitingOurSignature(uuid));
		assert.false(third.wallet.transaction().isAwaitingOtherSignatures(uuid));
		assert.true(third.wallet.transaction().isAwaitingFinalSignature(uuid));

		assert.true(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]));
		assert.false(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]));
		assert.false(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]));

		await second.wallet.transaction().sync();

		assert.true(second.wallet.transaction().transaction(uuid).timestamp().isValid());
		assert.is(second.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

		assert.false(second.wallet.transaction().isAwaitingOurSignature(uuid));
		assert.false(second.wallet.transaction().isAwaitingOtherSignatures(uuid));
		assert.true(second.wallet.transaction().isAwaitingFinalSignature(uuid));

		assert.true(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]));
		assert.false(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]));
		assert.false(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]));

		await first.wallet.transaction().sync();

		assert.true(first.wallet.transaction().transaction(uuid).timestamp().isValid());
		assert.is(first.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

		assert.true(first.wallet.transaction().isAwaitingOurSignature(uuid));
		assert.false(first.wallet.transaction().isAwaitingOtherSignatures(uuid));
		assert.true(first.wallet.transaction().isAwaitingFinalSignature(uuid));

		assert.true(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]));
		assert.false(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]));
		assert.false(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]));

		context.mockServerResponse("show", fixtures.withThirdSignature);

		// 4. Add the final signature by signing the whole transaction with the signatures of all participants.
		await first.wallet
			.transaction()
			.addSignature(uuid, await first.wallet.coin().signatory().mnemonic(first.mnemonic));

		context.mockServerResponse("ready", [fixtures.withFinalSignature]);

		await first.wallet.transaction().sync();

		assert.true(first.wallet.transaction().transaction(uuid).timestamp().isValid());
		assert.is(first.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

		assert.false(first.wallet.transaction().isAwaitingOurSignature(uuid));
		assert.false(first.wallet.transaction().isAwaitingOtherSignatures(uuid));
		assert.false(first.wallet.transaction().isAwaitingFinalSignature(uuid));

		assert.false(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]));
		assert.false(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]));
		assert.false(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[2]));

		assert.false(first.wallet.transaction().canBeSigned(uuid));
		assert.true(first.wallet.transaction().canBeBroadcasted(uuid));

		await second.wallet.transaction().sync();

		assert.true(second.wallet.transaction().transaction(uuid).timestamp().isValid());
		assert.is(second.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

		assert.false(second.wallet.transaction().isAwaitingOurSignature(uuid));
		assert.false(second.wallet.transaction().isAwaitingOtherSignatures(uuid));
		assert.false(second.wallet.transaction().isAwaitingFinalSignature(uuid));

		assert.false(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]));
		assert.false(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]));

		assert.false(second.wallet.transaction().canBeSigned(uuid));
		assert.true(second.wallet.transaction().canBeBroadcasted(uuid));

		await third.wallet.transaction().sync();

		assert.true(third.wallet.transaction().transaction(uuid).timestamp().isValid());
		assert.is(third.wallet.transaction().transaction(uuid).timestamp().toUNIX(), transactionData.timestamp);

		assert.false(third.wallet.transaction().isAwaitingOurSignature(uuid));
		assert.false(third.wallet.transaction().isAwaitingOtherSignatures(uuid));
		assert.false(third.wallet.transaction().isAwaitingFinalSignature(uuid));

		assert.false(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0]));
		assert.false(third.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1]));

		assert.false(third.wallet.transaction().canBeSigned(uuid));
		assert.true(third.wallet.transaction().canBeBroadcasted(uuid));
	});

	it("should keep ready musig transactions in sync with musig server", async (context) => {
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

		const createFixtures = (uuid) => {
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
		context.mockServerResponse("pending", []);
		context.mockServerResponse("ready", [fixtures.withFinalSignature]);

		await first.wallet.transaction().sync();

		assert.length(Object.keys(first.wallet.transaction().signed()), 1);
		assert.containKeys(first.wallet.transaction().signed(), [uuid]);

		// Musig server has 0 ready transactions.
		context.mockServerResponse("pending", []);
		context.mockServerResponse("ready", []);

		await first.wallet.transaction().sync();

		assert.length(Object.values(first.wallet.transaction().signed()), 0);
	});

	it("should generate musig address", async (context) => {
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

		const createFixtures = (uuid) => {
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
		context.mockServerResponse("store", { id: uuid });

		const result = await first.wallet.transaction().broadcast(uuid);

		assert.equal(result, { accepted: [uuid], errors: {}, rejected: [] });

		const { address } = await first.wallet.coin().address().fromMultiSignature({
			min: fixtures.withFirstSignature.data.multiSignature.min,
			publicKeys: fixtures.withFirstSignature.data.multiSignature.publicKeys,
		});

		assert.is(address, fixtures.generatedAddress);
	});

	it("should avoid adding duplicate signatures", async (context) => {
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

		const createFixtures = (uuid) => {
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
		context.mockServerResponse("store", { id: uuid });
		const result = await first.wallet.transaction().broadcast(uuid);

		assert.equal(result, { accepted: [uuid], errors: {}, rejected: [] });

		// Validate multi-signature registration data.
		assert.false(first.wallet.transaction().canBeBroadcasted(uuid));
		assert.false(first.wallet.transaction().canBeSigned(uuid));
		assert.is(first.wallet.transaction().transaction(uuid).fee(), fee.toNumber());
		assert.is(first.wallet.transaction().transaction(uuid).amount(), 0);
		assert.defined(first.wallet.transaction().transaction(uuid).timestamp());
		assert.true(first.wallet.transaction().transaction(uuid).isMultiSignatureRegistration());
		assert.true(first.wallet.transaction().transaction(uuid).usesMultiSignature());
		assert.equal(first.wallet.transaction().transaction(uuid).get("multiSignature"), {
			min: 2,
			publicKeys,
		});

		context.mockServerResponse("pending", [fixtures.withFirstSignature]);
		context.mockServerResponse("ready", []);

		await first.wallet.transaction().sync();

		// 1. Check the first signature
		const transactionDataWithFirstSignature = first.wallet.transaction().transaction(uuid).data().data();
		assert.length(transactionDataWithFirstSignature.signatures, 1);
		assert.is(transactionDataWithFirstSignature.signatures[0], fixtures.withFirstSignature.data.signatures[0]);

		await second.wallet.transaction().sync();

		context.mockServerResponse("show", fixtures.withFirstSignature);
		context.mockServerResponse("pending", []);
		context.mockServerResponse("ready", [fixtures.withSecondSignature]);

		// 2. Sign with second participant
		await second.wallet
			.transaction()
			.addSignature(uuid, await second.wallet.coin().signatory().mnemonic(second.mnemonic));

		await second.wallet.transaction().sync();

		const transactionDataWithSecondSignature = second.wallet.transaction().transaction(uuid).data().data();
		assert.length(transactionDataWithSecondSignature.signatures, 2);
		assert.equal(transactionDataWithSecondSignature.signatures, fixtures.withSecondSignature.data.signatures);

		// Add same signature again.
		await second.wallet
			.transaction()
			.addSignature(uuid, await second.wallet.coin().signatory().mnemonic(second.mnemonic));

		const transactionWithUniqueSignatures = second.wallet.transaction().transaction(uuid).data().data();
		assert.length(transactionWithUniqueSignatures.signatures, 2);
		assert.equal(transactionWithUniqueSignatures.signatures, fixtures.withSecondSignature.data.signatures);
	});
});
