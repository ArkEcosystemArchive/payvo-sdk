/* eslint-disable jest/expect-expect */
import "jest-extended";
import "reflect-metadata";

import { bootContainer, makeProfile } from "../mocking";
import { IProfile, IReadWriteWallet } from "../../source/contracts";
import nock from "nock";

import { mockMusigServer } from "./musig.test.helpers";
import { mnemonics as testMnemonics } from "../fixtures/identity";
import { Signatories } from "@payvo/sdk";

jest.setTimeout(60_000);

describe("BTC", () => {
	let profile1, profile2, profile3: IProfile;

	const { mockServerResponse, resetServerResponseMocks } = mockMusigServer({
		url: "https://btc-test-musig.payvo.com",
	});

	beforeAll(() => {
		bootContainer();

		// Default mocks
		nock("https://btc-test.payvo.com:443")
			// .get("/api/blockchain")
			// .reply(200, require("../fixtures/client/blockchain.json"))
			// .get("/api/node/configuration")
			// .reply(200, require("../fixtures/client/configuration.json"))
			// .get("/api/peers")
			// .reply(200, require("../fixtures/client/peers.json"))
			// .get("/api/node/configuration/crypto")
			// .reply(200, require("../fixtures/client/cryptoConfiguration.json"))
			// .get("/api/node/syncing")
			// .reply(200, require("../fixtures/client/syncing.json"))
			// // Wallet mocks
			// .get("/api/wallets/DABCrsfEqhtdzmBrE2AU5NNmdUFCGXKEkr")
			// .reply(200, require("../fixtures/wallets/DABCrsfEqhtdzmBrE2AU5NNmdUFCGXKEkr.json"))
			// .get("/api/wallets/DCX2kvwgL2mrd9GjyYAbfXLGGXWwgN3Px7")
			// .reply(200, require("../fixtures/wallets/DCX2kvwgL2mrd9GjyYAbfXLGGXWwgN3Px7.json"))
			// .get("/api/wallets/DDHk393YcsxTPN1H5SWTcbjfnCRmF1iBR8")
			// .reply(200, require("../fixtures/wallets/DDHk393YcsxTPN1H5SWTcbjfnCRmF1iBR8.json"))
			.persist();

		profile1 = makeProfile({ id: "profile-id-1" });
		profile2 = makeProfile({ id: "profile-id-2" });
		profile3 = makeProfile({ id: "profile-id-3" });
	});

	afterEach(() => {
		resetServerResponseMocks();
	});

	describe("MuSig Registration", () => {
		it("should perform a 2 out of 2 registration", async () => {
			nock.recorder.rec();
			// TODO We shouldn't need to create a wallet first, but DW requires so, as the button to create musig wallet is inside an existing wallet
			const first = await bitcoinWallet({
				profile: profile1,
				coinId: "BTC",
				networkId: "btc.testnet",
				mnemonic: testMnemonics["btc.testnet"][0],
				account: 0,
				// path: "m/48'/1'/0'/2'",
			});

			const signatory1 = new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: testMnemonics["btc.testnet"][0],
					address: "address", // Not needed / used
					publicKey: "m/48'/1'/0'/2'", // TODO for now we use publicKey for passing path
					privateKey: "privateKey", // Not needed / used
				}),
			);

			const transactionData = {
				signatory: signatory1,
				data: {
					min: 2,
					numberOfSignatures: 2,
					publicKeys: [],
					derivationMethod: "nativeSegwitMusig",
				},
			};

			// 1. Create and sign musig registration by first
			const multiSignatureRegistrationId = await first
				.transaction()
				// @ts-ignore TODO Not sure why it doesn't like the type as it is
				.signMultiSignature(transactionData);
			console.log(multiSignatureRegistrationId);

			const uuid = multiSignatureRegistrationId;
			console.log(uuid);

			// const fixtures = createFixtures(uuid);

			// Broadcast the transaction to musig server with first's signature.
			// All participant wallets should see when calling wallet.transaction.sync()
			mockServerResponse("store", { id: uuid });
			const result = await first
				// const result = await profile1
				// 	.coins()
				// 	.get("BTC", "btc.testnet")
				.transaction()
				.broadcast(uuid);

			expect(result).toEqual({ accepted: [uuid], errors: {}, rejected: [] });
			//
			// // Validate multi-signature registration data.
			// expect(first.wallet.transaction().canBeBroadcasted(uuid)).toBeFalse();
			// expect(first.wallet.transaction().canBeSigned(uuid)).toBeFalse();
			// expect(first.wallet.transaction().transaction(uuid).fee()).toEqual(fee.toNumber());
			// expect(first.wallet.transaction().transaction(uuid).amount()).toEqual(0);
			// expect(first.wallet.transaction().transaction(uuid).timestamp()).toBeDefined();
			// expect(first.wallet.transaction().transaction(uuid).isMultiSignatureRegistration()).toBeTrue();
			// expect(first.wallet.transaction().transaction(uuid).usesMultiSignature()).toBeTrue();
			// expect(first.wallet.transaction().transaction(uuid).get("multiSignature")).toEqual({
			// 	min: 2,
			// 	publicKeys,
			// });

			// const second = await bitcoinWallet({
			// 	profile: profile2,
			// 	coinId: "BTC",
			// 	networkId: "btc.testnet",
			// 	mnemonic: testMnemonics["btc.testnet"][1],
			// 	account: 0,
			// 	// path: "m/48'/1'/0'/2'",
			// });
			//
			// const { fee, transactionData } = await generateRegistrationTransactionData({
			// 	wallet: first,
			// 	timestamp: 1597806483,
			// 	publicKeys,
			// 	minSignatures: 2,
			// });
			//
			// const createFixtures = (uuid: string) => {
			// 	return {
			// 		withFirstSignature: createMusigRegistrationFixture({
			// 			uuid,
			// 			min: 2,
			// 			wallet: first.wallet,
			// 			publicKeys,
			// 			signatures: first.wallet.transaction().transaction(uuid).toObject().data.signatures,
			// 			timestamp: 1597806483,
			// 		}),
			//
			// 		withSecondSignature: createMusigRegistrationFixture({
			// 			uuid,
			// 			min: 2,
			// 			wallet: first.wallet,
			// 			publicKeys,
			// 			signatures: [
			// 				"002d2edfa6f8dad244bbd0b0f1f7bb90fbd0c9fd9bc6abb423eedd8ddb128e4c400defc7e955cc4665fde985b7d90fe8560e111ae4967e2a59f20eeb84e9b4c586",
			// 				"010f508bca87011ceb1689e50d6d5f3d60ff312381467281a3394f60c92b0755f5ba7c5d98393053486bfd0779bee7c077286b93a4bc70dda1c1d72d3857994ba3",
			// 			],
			// 			timestamp: 1597806483,
			// 		}),
			//
			// 		withFinalSignature: createMusigRegistrationFixture({
			// 			uuid,
			// 			min: 2,
			// 			wallet: first.wallet,
			// 			publicKeys,
			// 			signatures: [
			// 				"002d2edfa6f8dad244bbd0b0f1f7bb90fbd0c9fd9bc6abb423eedd8ddb128e4c400defc7e955cc4665fde985b7d90fe8560e111ae4967e2a59f20eeb84e9b4c586",
			// 				"010f508bca87011ceb1689e50d6d5f3d60ff312381467281a3394f60c92b0755f5ba7c5d98393053486bfd0779bee7c077286b93a4bc70dda1c1d72d3857994ba3",
			// 			],
			// 			signature:
			// 				"89ff2bc9549417da8f150257196e0844d6ab376b2695b6a9ce632e1167a85045acc5fa6210208b1dcdba1f8c59270fcd02d44c15ef090f44235ea10bf2beb45f",
			// 			timestamp: 1597806483,
			// 		}),
			// 	};
			// };
			//
			// // 1. Sign musig registration by first
			// const uuid = await first.wallet.transaction().signMultiSignature(transactionData);
			// const fixtures = createFixtures(uuid);
			//
			// // Broadcast the transaction to musig server with first's signature.
			// // All participant wallets should see when calling wallet.transaction.sync()
			// mockServerResponse("store", { id: uuid });
			// const result = await first.wallet.transaction().broadcast(uuid);
			//
			// expect(result).toEqual({ accepted: [uuid], errors: {}, rejected: [] });
			//
			// // Validate multi-signature registration data.
			// expect(first.wallet.transaction().canBeBroadcasted(uuid)).toBeFalse();
			// expect(first.wallet.transaction().canBeSigned(uuid)).toBeFalse();
			// expect(first.wallet.transaction().transaction(uuid).fee()).toEqual(fee.toNumber());
			// expect(first.wallet.transaction().transaction(uuid).amount()).toEqual(0);
			// expect(first.wallet.transaction().transaction(uuid).timestamp()).toBeDefined();
			// expect(first.wallet.transaction().transaction(uuid).isMultiSignatureRegistration()).toBeTrue();
			// expect(first.wallet.transaction().transaction(uuid).usesMultiSignature()).toBeTrue();
			// expect(first.wallet.transaction().transaction(uuid).get("multiSignature")).toEqual({
			// 	min: 2,
			// 	publicKeys,
			// });
			//
			// mockServerResponse("pending", [fixtures.withFirstSignature]);
			// mockServerResponse("ready", []);
			//
			// await first.wallet.transaction().sync();
			//
			// expect(first.wallet.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			// expect(first.wallet.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);
			//
			// expect(first.wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
			// expect(first.wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeTrue();
			// expect(first.wallet.transaction().isAwaitingFinalSignature(uuid)).toBeTrue();
			//
			// expect(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeFalse();
			// expect(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeTrue();
			//
			// expect(first.wallet.transaction().canBeSigned(uuid)).toBeFalse();
			// expect(first.wallet.transaction().canBeBroadcasted(uuid)).toBeFalse();
			//
			// await second.wallet.transaction().sync();
			//
			// expect(second.wallet.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			// expect(second.wallet.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);
			//
			// expect(second.wallet.transaction().isAwaitingOurSignature(uuid)).toBeTrue();
			// expect(second.wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
			// expect(second.wallet.transaction().isAwaitingFinalSignature(uuid)).toBeTrue();
			//
			// expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeFalse();
			// expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeTrue();
			//
			// expect(second.wallet.transaction().canBeSigned(uuid)).toBeTrue();
			// expect(second.wallet.transaction().canBeBroadcasted(uuid)).toBeFalse();
			//
			// mockServerResponse("show", fixtures.withFirstSignature);
			// mockServerResponse("pending", []);
			// mockServerResponse("ready", [fixtures.withSecondSignature]);
			//
			// // 2. Add the second signature from the second participant, and re-broadcast the transaction.
			// await second.wallet
			// 	.transaction()
			// 	.addSignature(uuid, await second.wallet.coin().signatory().mnemonic(second.mnemonic));
			//
			// await second.wallet.transaction().sync();
			//
			// expect(second.wallet.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			// expect(second.wallet.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);
			//
			// expect(second.wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
			// expect(second.wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
			// expect(second.wallet.transaction().isAwaitingFinalSignature(uuid)).toBeTrue();
			//
			// // When awaiting final signature, transaction awaits initiator to sign again the final signature.
			// expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeTrue();
			// expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeFalse();
			//
			// expect(second.wallet.transaction().canBeSigned(uuid)).toBeFalse();
			// expect(second.wallet.transaction().canBeBroadcasted(uuid)).toBeFalse();
			//
			// await first.wallet.transaction().sync();
			//
			// expect(first.wallet.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			// expect(first.wallet.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);
			//
			// expect(first.wallet.transaction().isAwaitingOurSignature(uuid)).toBeTrue();
			// expect(first.wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
			// expect(first.wallet.transaction().isAwaitingFinalSignature(uuid)).toBeTrue();
			//
			// expect(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeTrue();
			// expect(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeFalse();
			//
			// mockServerResponse("show", fixtures.withSecondSignature);
			//
			// // 4. Add the final signature by signing the whole transaction with the signatures of all participants.
			// await first.wallet
			// 	.transaction()
			// 	.addSignature(uuid, await first.wallet.coin().signatory().mnemonic(first.mnemonic));
			//
			// mockServerResponse("pending", []);
			// mockServerResponse("ready", [fixtures.withFinalSignature]);
			//
			// await first.wallet.transaction().sync();
			//
			// expect(first.wallet.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			// expect(first.wallet.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);
			//
			// expect(first.wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
			// expect(first.wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
			// expect(first.wallet.transaction().isAwaitingFinalSignature(uuid)).toBeFalse();
			//
			// expect(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeFalse();
			// expect(first.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeFalse();
			//
			// expect(first.wallet.transaction().canBeSigned(uuid)).toBeFalse();
			// expect(first.wallet.transaction().canBeBroadcasted(uuid)).toBeTrue();
			//
			// await second.wallet.transaction().sync();
			//
			// expect(second.wallet.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			// expect(second.wallet.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);
			//
			// expect(second.wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
			// expect(second.wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
			// expect(second.wallet.transaction().isAwaitingFinalSignature(uuid)).toBeFalse();
			//
			// expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeFalse();
			// expect(second.wallet.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeFalse();
			//
			// expect(second.wallet.transaction().canBeSigned(uuid)).toBeFalse();
			// expect(second.wallet.transaction().canBeBroadcasted(uuid)).toBeTrue();
		});
	});
});

const bitcoinWallet = async ({
	profile,
	coinId,
	networkId,
	mnemonic,
	account,
}: {
	profile: IProfile;
	coinId: string;
	networkId: string;
	mnemonic: string;
	account: number;
}): Promise<IReadWriteWallet> => {
	return await profile.walletFactory().fromMnemonicWithBIP84({
		coin: coinId,
		network: networkId,
		mnemonic,
		levels: {
			account,
		},
	});
};
