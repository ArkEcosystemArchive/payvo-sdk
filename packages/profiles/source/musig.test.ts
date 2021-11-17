/* eslint-disable jest/expect-expect */
import "jest-extended";
import "reflect-metadata";

import { UUID } from "@payvo/sdk-cryptography";

import { identity } from "../test/fixtures/identity.js";
import { bootContainer } from "../test/mocking.js";
import { Profile } from "./profile.js";
import { Wallet } from "./wallet.js";
import { TransactionService } from "./wallet-transaction.service.js";
import { IProfile, IReadWriteWallet, ProfileSetting } from "./contracts.js";
import { BIP39 } from "@payvo/sdk-cryptography";

let profile: IProfile;
let wallet: IReadWriteWallet;
let subject: TransactionService;

jest.setTimeout(30000);

beforeAll(() => {
	bootContainer();
});

beforeEach(async () => {
	profile = new Profile({ id: "profile-id", name: "name", avatar: "avatar", data: "" });
	profile.settings().set(ProfileSetting.Name, "John Doe");

	wallet = await profile.walletFactory().fromMnemonicWithBIP39({
		coin: "ARK",
		network: "ark.devnet",
		mnemonic: identity.mnemonic,
	});

	subject = new TransactionService(wallet);
});

it.skip("should perform a transfer", async () => {
	const PA = BIP39.generate();
	const PB = BIP39.generate();
	const PC = BIP39.generate();

	const publicKeys = [
		(await wallet.coin().publicKey().fromMnemonic(PA)).publicKey,
		(await wallet.coin().publicKey().fromMnemonic(PB)).publicKey,
		(await wallet.coin().publicKey().fromMnemonic(PC)).publicKey,
	];

	wallet = await profile.walletFactory().fromAddress({
		coin: "ARK",
		network: "ark.devnet",
		address: "DAWdHfDFEvvu57cHjAhs5K5di33B2DdCu1",
	});
	await wallet.synchroniser().identity();

	const uuid = await wallet.transaction().signTransfer({
		signatory: await wallet.coin().signatory().multiSignature({ min: 2, publicKeys }),
		data: {
			amount: 1,
			to: "DAWdHfDFEvvu57cHjAhs5K5di33B2DdCu1",
		},
	});

	try {
		await wallet.coin().multiSignature().forgetById(uuid);
	} catch {
		// Does not exist.
	}

	// Broadcast the transaction to make it accessible for all participants.
	await wallet.transaction().broadcast(uuid);

	// Sync all of the transactions from the Multi-Signature Server and check the state of each.
	await wallet.transaction().sync();
	expect(wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
	expect(wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeTrue();
	expect(wallet.transaction().isAwaitingFinalSignature(uuid)).toBeFalse();

	// Add the second signature and re-broadcast the transaction.
	expect(wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
	expect(wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeTrue();
	expect(wallet.transaction().isAwaitingFinalSignature(uuid)).toBeFalse();
	await wallet.transaction().addSignature(uuid, await wallet.coin().signatory().mnemonic(PA));

	// Sync all of the transactions from the Multi-Signature Server and check the state of each.
	await wallet.transaction().sync();
	expect(wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
	expect(wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeTrue();
	expect(wallet.transaction().isAwaitingFinalSignature(uuid)).toBeFalse();

	// Add the third signature and re-broadcast the transaction.
	await wallet.transaction().addSignature(uuid, await wallet.coin().signatory().mnemonic(PB));

	// Sync all of the transactions from the Multi-Signature Server and check the state of each.
	await wallet.transaction().sync();
	expect(wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
	expect(wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
	expect(wallet.transaction().isAwaitingFinalSignature(uuid)).toBeFalse();

	// Add the final signature by signing the whole transaction with the signatures of all participants.
	await wallet.transaction().addSignature(uuid, await wallet.coin().signatory().mnemonic(PC));

	// Sync all of the transactions from the Multi-Signature Server and check the state of each.
	await wallet.transaction().sync();
	expect(wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
	expect(wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
	expect(wallet.transaction().isAwaitingFinalSignature(uuid)).toBeFalse();

	// Broadcast the multi signature.
	for (const signedID of Object.keys(wallet.transaction().signed())) {
		console.log(JSON.stringify(await wallet.transaction().broadcast(signedID), null, 4));
	}
});

it.skip("should perform a registration", async () => {
	const PA = BIP39.generate();
	const PB = BIP39.generate();
	const PC = BIP39.generate();

	const publicKeys = [
		(await wallet.coin().publicKey().fromMnemonic(PA)).publicKey,
		(await wallet.coin().publicKey().fromMnemonic(PB)).publicKey,
		(await wallet.coin().publicKey().fromMnemonic(PC)).publicKey,
	];

	wallet = await profile.walletFactory().fromMnemonicWithBIP39({
		coin: "ARK",
		network: "ark.devnet",
		mnemonic: PA,
	});
	await wallet.synchroniser().identity();

	const uuid = await wallet.transaction().signMultiSignature({
		nonce: wallet.nonce().plus(1).toString(),
		fee: 5,
		signatory: await wallet.coin().signatory().mnemonic(PA),
		data: {
			publicKeys,
			min: 2,
			senderPublicKey: wallet.publicKey(),
		},
	});

	try {
		await wallet.coin().multiSignature().forgetById(uuid);
	} catch {
		// Does not exist.
	}

	// Broadcast the transaction to make it accessible for all participants.
	await wallet.transaction().broadcast(uuid);

	// Sync all of the transactions from the Multi-Signature Server and check the state of each.
	await wallet.transaction().sync();
	expect(wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
	expect(wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeTrue();
	expect(wallet.transaction().isAwaitingFinalSignature(uuid)).toBeTrue();

	// Add the second signature and re-broadcast the transaction.
	expect(wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
	expect(wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeTrue();
	expect(wallet.transaction().isAwaitingFinalSignature(uuid)).toBeTrue();
	await wallet.transaction().addSignature(uuid, await wallet.coin().signatory().mnemonic(PB));

	// Sync all of the transactions from the Multi-Signature Server and check the state of each.
	await wallet.transaction().sync();
	expect(wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
	expect(wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
	expect(wallet.transaction().isAwaitingFinalSignature(uuid)).toBeTrue();

	// Add the third signature and re-broadcast the transaction.
	await wallet.transaction().addSignature(uuid, await wallet.coin().signatory().mnemonic(PC));

	// Sync all of the transactions from the Multi-Signature Server and check the state of each.
	await wallet.transaction().sync();
	expect(wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
	expect(wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
	expect(wallet.transaction().isAwaitingFinalSignature(uuid)).toBeTrue();

	// Add the final signature by signing the whole transaction with the signatures of all participants.
	await wallet.transaction().addSignature(uuid, await wallet.coin().signatory().mnemonic(PA));

	// Sync all of the transactions from the Multi-Signature Server and check the state of each.
	await wallet.transaction().sync();
	expect(wallet.transaction().isAwaitingOurSignature(uuid)).toBeFalse();
	expect(wallet.transaction().isAwaitingOtherSignatures(uuid)).toBeFalse();
	expect(wallet.transaction().isAwaitingFinalSignature(uuid)).toBeFalse();

	// Broadcast the multi signature.
	for (const signedID of Object.keys(wallet.transaction().signed())) {
		console.log(JSON.stringify(await wallet.transaction().broadcast(signedID), null, 4));
	}
});
