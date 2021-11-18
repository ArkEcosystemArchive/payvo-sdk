/* eslint-disable jest/expect-expect */
import "jest-extended";
import "reflect-metadata";

import { bootContainer, makeProfile } from "../mocking";
import { IProfile, IReadWriteWallet } from "../../source/contracts";
import nock from "nock";

import { mockMusigServer } from "./musig.test.helpers";
import { mnemonics as testMnemonics } from "../fixtures/identity";
import { Signatories } from "@payvo/sdk";
import { oneSignatureNativeSegwitMusigRegistrationTx } from "../../../btc/test/fixtures/musig-native-segwit-txs";

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
			const uuid = await first
				.transaction()
				// @ts-ignore TODO Not sure why it doesn't like the type as it is
				.signMultiSignature(transactionData);
			console.log(uuid);

			// Broadcast the transaction to musig server with first's signature.
			// All participant wallets should see when calling wallet.transaction.sync()
			mockServerResponse("store", { id: uuid });
			const result = await first.transaction().broadcast(uuid);

			expect(result).toEqual({ accepted: [uuid], errors: {}, rejected: [] });

			// Validate multi-signature registration data.
			expect(first.transaction().canBeBroadcasted(uuid)).toBeFalse();
			// expect(first.transaction().canBeSigned(uuid)).toBeFalse(); // TODO returning true because profiles is checking against the pub key of the originator's wallet (bip84 m/84'/1'/0') instead of the key that's actually used for musig (m/48'/1'/0'/2')
			expect(first.transaction().transaction(uuid).fee()).toBeNaN();
			expect(first.transaction().transaction(uuid).amount()).toBeNaN();
			expect(first.transaction().transaction(uuid).timestamp()).toBeDefined();
			expect(first.transaction().transaction(uuid).isMultiSignatureRegistration()).toBeTrue();
			expect(first.transaction().transaction(uuid).usesMultiSignature()).toBeTrue();
			expect(first.transaction().transaction(uuid).get("multiSignature")).toEqual({
				min: 2,
				numberOfSignatures: 2,
				publicKeys: [
					"Vpub5mtyU6Hx9xrx63Y3W4aGW1LuQkmwrq9xsQNgX7tDAM8DTHhE7vXMZ7Hue2FR8SMAGDW57fy76HFmN1jnckSmeX2cDMWVA1KViot6bLgJZuN",
				],
			});

			mockServerResponse("pending", [oneSignatureNativeSegwitMusigRegistrationTx]);
			mockServerResponse("ready", []);

			await first.transaction().sync();

			/*
			 TODO None of the following make sense as they are passed a public key which is that of the creator's wallet, not the same used for the musig wallet. And that's by design. I can't see a way out of this.
			 Once again, the problem is that first is a native segwit, non-musig wallet. It has a
			 derivation path of m/84'/1'/0', instead of the key that's actually used for musig coming from m/48'/1'/0'/2'.
			 Only way I see this fixes is that the profile (not an existing wallet) is capable of
			 starting the musig registration based on 3 things:
			 - mnemonic
			 - derivation schema
			 - path
			 */
			expect(first.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
			expect(first.transaction().isAwaitingOtherSignatures(uuid)).toBeTrue();
			expect(first.transaction().isAwaitingFinalSignature(uuid)).toBeTrue();

			expect(first.transaction().isAwaitingSignatureByPublicKey(uuid, "Vpub5mtyU6Hx9xrx63Y3W4aGW1LuQkmwrq9xsQNgX7tDAM8DTHhE7vXMZ7Hue2FR8SMAGDW57fy76HFmN1jnckSmeX2cDMWVA1KViot6bLgJZuN")).toBeFalse();
			expect(first.transaction().isAwaitingSignatureByPublicKey(uuid, "Vpub5mYgzMb93fDtChZ2xmY7g3aEgHFjdgQE6P596AiL5zENEcVjDCciGfWmhZJngn6gVmBRh6E1Vp7aZYY7wQkMRTQSKhauGwYAUEdiGbS35D1")).toBeTrue();

			expect(first.transaction().canBeSigned(uuid)).toBeFalse();
			expect(first.transaction().canBeBroadcasted(uuid)).toBeFalse();

			const second = await bitcoinWallet({
				profile: profile2,
				coinId: "BTC",
				networkId: "btc.testnet",
				mnemonic: testMnemonics["btc.testnet"][1],
				account: 0,
				// path: "m/48'/1'/0'/2'",
			});

			await second.transaction().sync();

			expect(second.transaction().isAwaitingOurSignature(uuid)).toBeTrue();
			expect(second.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
			expect(second.transaction().isAwaitingFinalSignature(uuid)).toBeTrue();

			expect(second.transaction().isAwaitingSignatureByPublicKey(uuid, "Vpub5mtyU6Hx9xrx63Y3W4aGW1LuQkmwrq9xsQNgX7tDAM8DTHhE7vXMZ7Hue2FR8SMAGDW57fy76HFmN1jnckSmeX2cDMWVA1KViot6bLgJZuN")).toBeFalse();
			expect(second.transaction().isAwaitingSignatureByPublicKey(uuid, "Vpub5mYgzMb93fDtChZ2xmY7g3aEgHFjdgQE6P596AiL5zENEcVjDCciGfWmhZJngn6gVmBRh6E1Vp7aZYY7wQkMRTQSKhauGwYAUEdiGbS35D1")).toBeTrue();

			expect(second.transaction().canBeSigned(uuid)).toBeTrue();
			expect(second.transaction().canBeBroadcasted(uuid)).toBeFalse();
			//
			// mockServerResponse("show", fixtures.withFirstSignature);
			// mockServerResponse("pending", []);
			// mockServerResponse("ready", [fixtures.withSecondSignature]);

			// // 2. Add the second signature from the second participant, and re-broadcast the transaction.
			await second
				.transaction()
				.addSignature(uuid, await second.coin().signatory().mnemonic(testMnemonics["btc.testnet"][1]));

			// await second.transaction().sync();
			//
			// expect(second.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			// expect(second.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);
			//
			// expect(second.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
			// expect(second.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
			// expect(second.transaction().isAwaitingFinalSignature(uuid)).toBeTrue();
			//
			// // When awaiting final signature, transaction awaits initiator to sign again the final signature.
			// expect(second.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeTrue();
			// expect(second.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeFalse();
			//
			// expect(second.transaction().canBeSigned(uuid)).toBeFalse();
			// expect(second.transaction().canBeBroadcasted(uuid)).toBeFalse();
			//
			// await first.transaction().sync();
			//
			// expect(first.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			// expect(first.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);
			//
			// expect(first.transaction().isAwaitingOurSignature(uuid)).toBeTrue();
			// expect(first.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
			// expect(first.transaction().isAwaitingFinalSignature(uuid)).toBeTrue();
			//
			// expect(first.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeTrue();
			// expect(first.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeFalse();
			//
			// mockServerResponse("show", fixtures.withSecondSignature);
			//
			// // 4. Add the final signature by signing the whole transaction with the signatures of all participants.
			// await first
			// 	.transaction()
			// 	.addSignature(uuid, await first.coin().signatory().mnemonic(first.mnemonic));
			//
			// mockServerResponse("pending", []);
			// mockServerResponse("ready", [fixtures.withFinalSignature]);
			//
			// await first.transaction().sync();
			//
			// expect(first.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			// expect(first.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);
			//
			// expect(first.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
			// expect(first.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
			// expect(first.transaction().isAwaitingFinalSignature(uuid)).toBeFalse();
			//
			// expect(first.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeFalse();
			// expect(first.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeFalse();
			//
			// expect(first.transaction().canBeSigned(uuid)).toBeFalse();
			// expect(first.transaction().canBeBroadcasted(uuid)).toBeTrue();
			//
			// await second.transaction().sync();
			//
			// expect(second.transaction().transaction(uuid).timestamp().isValid()).toBeTrue();
			// expect(second.transaction().transaction(uuid).timestamp().toUNIX()).toBe(transactionData.timestamp);
			//
			// expect(second.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
			// expect(second.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
			// expect(second.transaction().isAwaitingFinalSignature(uuid)).toBeFalse();
			//
			// expect(second.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[0])).toBeFalse();
			// expect(second.transaction().isAwaitingSignatureByPublicKey(uuid, publicKeys[1])).toBeFalse();
			//
			// expect(second.transaction().canBeSigned(uuid)).toBeFalse();
			// expect(second.transaction().canBeBroadcasted(uuid)).toBeTrue();
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
