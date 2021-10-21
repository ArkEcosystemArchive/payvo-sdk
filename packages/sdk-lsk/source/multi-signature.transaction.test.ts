import "jest-extended";

import { PendingMultiSignatureTransaction } from "./multi-signature.transaction";

const asset = {
	numberOfSignatures: 2,
	mandatoryKeys: [
		"5948cc0565a3e9320c7442cecb62acdc92b428a0da504c52afb3e84a025d221f",
		"a3c22fd67483ae07134c93224384dac7206c40b1b7a14186dd2d3f0dcc8234ff",
	],
	optionalKeys: [],
};

const wallet1 = "5948cc0565a3e9320c7442cecb62acdc92b428a0da504c52afb3e84a025d221f";
const wallet2 = "a3c22fd67483ae07134c93224384dac7206c40b1b7a14186dd2d3f0dcc8234ff";

const transfer1 = {
	moduleID: 2,
	assetID: 0,
	senderPublicKey: "5e93fd5cfe306ea2c34d7082a6c79692cf2f5c6e07aa6f9b4a11b4917d33f16b",
	nonce: "3n",
	fee: "207000n",
	signatures: [
		"64e1c880e844f970e46ebdcc7c9c89a80bf8618de82706f3873ee91fa666657de610a8899f1370664721cdcb08eb5ac1e12aa6e1611b85a12050711aca478604",
	],
	asset: { recipientAddress: "763c191b0a4d0575020ce1e6500375d6d0bdd45e", amount: "100000000n", data: "" },
	id: "73413ba3034d67f794b5c151c0a148b058ee476415c631e5f3d68d37c7b64db0",
	multiSignature: asset,
};

const transfer2 = {
	moduleID: 2,
	assetID: 0,
	senderPublicKey: "5e93fd5cfe306ea2c34d7082a6c79692cf2f5c6e07aa6f9b4a11b4917d33f16b",
	nonce: "3n",
	fee: "207000n",
	signatures: [
		"64e1c880e844f970e46ebdcc7c9c89a80bf8618de82706f3873ee91fa666657de610a8899f1370664721cdcb08eb5ac1e12aa6e1611b85a12050711aca478604",
		"284cbea6e9a5c639981c50c97e09ea882a1cd63e2da30a99fdb961d6b4f7a3cecebf97161a8b8e22d02506fa78b119358faea83b19580e0a23d283d6e7868702",
	],
	asset: { recipientAddress: "763c191b0a4d0575020ce1e6500375d6d0bdd45e", amount: "100000000n", data: "" },
	id: "3279be353158ae19d47191605c82b6e112980c888e98e75d6185c858359428e4",
	multiSignature: asset,
};

const register1 = {
	moduleID: 4,
	assetID: 0,
	senderPublicKey: "5948cc0565a3e9320c7442cecb62acdc92b428a0da504c52afb3e84a025d221f",
	nonce: "0n",
	fee: "314000n",
	signatures: [
		"fbedfba740b75c2c4ab3fee0422a0d65b0995b009d83e75c40bdb6f0653814dc9719a20c99af9ef4980eb8f7c67d4b3147023869e330003036ad2781227a5604",
	],
	asset: {
		numberOfSignatures: 2,
		mandatoryKeys: [
			"5948cc0565a3e9320c7442cecb62acdc92b428a0da504c52afb3e84a025d221f",
			"a3c22fd67483ae07134c93224384dac7206c40b1b7a14186dd2d3f0dcc8234ff",
		],
		optionalKeys: [],
	},
	id: "35def847945d415cfba09d208c92b1e8c0aa97d1bb090939f9137c6d4cdabe57",
	multiSignature: asset,
};

const register2 = {
	moduleID: 4,
	assetID: 0,
	senderPublicKey: "5948cc0565a3e9320c7442cecb62acdc92b428a0da504c52afb3e84a025d221f",
	nonce: "0n",
	fee: "314000n",
	signatures: [
		"fbedfba740b75c2c4ab3fee0422a0d65b0995b009d83e75c40bdb6f0653814dc9719a20c99af9ef4980eb8f7c67d4b3147023869e330003036ad2781227a5604",
		"",
		"d9ef77f025ad25ccb9871c1e931906345c621726f68fab057afaf5ecd85497ae2205178057c4f37ea1687a69f84140b74b159b086da560d6b8870a2a7fc90505",
	],
	asset: {
		numberOfSignatures: 2,
		mandatoryKeys: [
			"5948cc0565a3e9320c7442cecb62acdc92b428a0da504c52afb3e84a025d221f",
			"a3c22fd67483ae07134c93224384dac7206c40b1b7a14186dd2d3f0dcc8234ff",
		],
		optionalKeys: [],
	},
	id: "81acbd45deb9d54b5f55d15539e3a4e673a03c2194e41ebb0a735ad2d6095ecc",
	multiSignature: asset,
};

const register3 = {
	moduleID: 4,
	assetID: 0,
	senderPublicKey: "5948cc0565a3e9320c7442cecb62acdc92b428a0da504c52afb3e84a025d221f",
	nonce: "0n",
	fee: "314000n",
	signatures: [
		"fbedfba740b75c2c4ab3fee0422a0d65b0995b009d83e75c40bdb6f0653814dc9719a20c99af9ef4980eb8f7c67d4b3147023869e330003036ad2781227a5604",
		"fbedfba740b75c2c4ab3fee0422a0d65b0995b009d83e75c40bdb6f0653814dc9719a20c99af9ef4980eb8f7c67d4b3147023869e330003036ad2781227a5604",
		"d9ef77f025ad25ccb9871c1e931906345c621726f68fab057afaf5ecd85497ae2205178057c4f37ea1687a69f84140b74b159b086da560d6b8870a2a7fc90505",
	],
	asset: {
		numberOfSignatures: 2,
		mandatoryKeys: [
			"5948cc0565a3e9320c7442cecb62acdc92b428a0da504c52afb3e84a025d221f",
			"a3c22fd67483ae07134c93224384dac7206c40b1b7a14186dd2d3f0dcc8234ff",
		],
		optionalKeys: [],
	},
	id: "ab4ba63b5899464be5dd637eda085f64a6c8b42ce7eaeb2da1badb4305249f12",
	multiSignature: asset,
};

test("#isMultiSignature", () => {
	expect(new PendingMultiSignatureTransaction(transfer1).isMultiSignature()).toBeTrue();
	expect(new PendingMultiSignatureTransaction(register1).isMultiSignature()).toBeTrue();
});

test("#isMultiSignatureRegistration", () => {
	expect(new PendingMultiSignatureTransaction(transfer1).isMultiSignatureRegistration()).toBeFalse();
	expect(new PendingMultiSignatureTransaction(register1).isMultiSignatureRegistration()).toBeTrue();
});

test("#isMultiSignatureReady", () => {
	expect(new PendingMultiSignatureTransaction(transfer1).isMultiSignatureReady({ excludeFinal: false })).toBeFalse();
	expect(new PendingMultiSignatureTransaction(transfer2).isMultiSignatureReady({ excludeFinal: false })).toBeTrue();

	expect(new PendingMultiSignatureTransaction(register1).isMultiSignatureReady({ excludeFinal: false })).toBeFalse();
	expect(new PendingMultiSignatureTransaction(register1).isMultiSignatureReady({ excludeFinal: true })).toBeFalse();
	expect(new PendingMultiSignatureTransaction(register2).isMultiSignatureReady({ excludeFinal: false })).toBeFalse();
	expect(new PendingMultiSignatureTransaction(register2).isMultiSignatureReady({ excludeFinal: true })).toBeTrue();
	expect(new PendingMultiSignatureTransaction(register3).isMultiSignatureReady({ excludeFinal: false })).toBeTrue();
});

describe("#needsSignatures", () => {
	it("should return false if it is not a multi signature transaction", () => {
		expect(
			new PendingMultiSignatureTransaction({ ...transfer1, signatures: undefined }).needsSignatures(),
		).toBeFalse();
	});

	it("should verify", () => {
		expect(new PendingMultiSignatureTransaction(transfer1).needsSignatures()).toBeTrue();
		expect(new PendingMultiSignatureTransaction(transfer2).needsSignatures()).toBeFalse();

		expect(new PendingMultiSignatureTransaction(register1).needsSignatures()).toBeTrue();
		expect(new PendingMultiSignatureTransaction(register2).needsSignatures()).toBeTrue();
		expect(new PendingMultiSignatureTransaction(register3).needsSignatures()).toBeFalse();
	});
});

test("#needsAllSignatures", () => {
	expect(new PendingMultiSignatureTransaction(transfer1).needsAllSignatures()).toBeTrue();
	expect(new PendingMultiSignatureTransaction(transfer2).needsAllSignatures()).toBeFalse();

	expect(new PendingMultiSignatureTransaction(register1).needsAllSignatures()).toBeTrue();
	expect(new PendingMultiSignatureTransaction(register2).needsAllSignatures()).toBeTrue();
	expect(new PendingMultiSignatureTransaction(register3).needsAllSignatures()).toBeFalse();
});

describe("#needsWalletSignature", () => {
	it("should return false if it is not a multi signature transaction", () => {
		expect(
			new PendingMultiSignatureTransaction({ ...transfer1, signatures: undefined }).needsWalletSignature(wallet1),
		).toBeFalse();
	});

	it("should return false if it does not need any signatures and the final signature", () => {
		expect(new PendingMultiSignatureTransaction(transfer2).needsWalletSignature(wallet1)).toBeFalse();
		expect(new PendingMultiSignatureTransaction(transfer2).needsWalletSignature(wallet2)).toBeFalse();
	});

	it("should return true if it is a multi signature registration and it is not ready", () => {
		expect(new PendingMultiSignatureTransaction(register1).needsWalletSignature(wallet1)).toBeTrue();
		expect(new PendingMultiSignatureTransaction(register1).needsWalletSignature(wallet2)).toBeTrue();
		expect(new PendingMultiSignatureTransaction(register2).needsWalletSignature(wallet1)).toBeTrue();
		expect(new PendingMultiSignatureTransaction(register2).needsWalletSignature(wallet2)).toBeFalse();
		expect(new PendingMultiSignatureTransaction(register3).needsWalletSignature(wallet1)).toBeFalse();
		expect(new PendingMultiSignatureTransaction(register3).needsWalletSignature(wallet2)).toBeFalse();
	});

	it("should return false if the public key is not a participant", () => {
		expect(new PendingMultiSignatureTransaction(register1).needsWalletSignature("unknown")).toBeFalse();
	});
});

describe("#needsFinalSignature", () => {
	it("should return false if it is not a multi signature transaction", () => {
		expect(
			new PendingMultiSignatureTransaction({ ...transfer1, signatures: undefined }).needsFinalSignature(),
		).toBeFalse();
	});

	it("should verify", () => {
		expect(new PendingMultiSignatureTransaction(transfer1).needsFinalSignature()).toBeFalse();
		expect(new PendingMultiSignatureTransaction(transfer2).needsFinalSignature()).toBeFalse();

		expect(new PendingMultiSignatureTransaction(register1).needsFinalSignature()).toBeTrue();
		expect(new PendingMultiSignatureTransaction(register2).needsFinalSignature()).toBeTrue();
		expect(new PendingMultiSignatureTransaction(register3).needsFinalSignature()).toBeFalse();
	});
});

test("#remainingSignatureCount", () => {
	expect(new PendingMultiSignatureTransaction(transfer1).remainingSignatureCount()).toBe(1);
	expect(new PendingMultiSignatureTransaction(transfer2).remainingSignatureCount()).toBe(0);

	expect(new PendingMultiSignatureTransaction(register1).remainingSignatureCount()).toBe(2);
	expect(new PendingMultiSignatureTransaction(register2).remainingSignatureCount()).toBe(1);
	expect(new PendingMultiSignatureTransaction(register3).remainingSignatureCount()).toBe(0);
});
