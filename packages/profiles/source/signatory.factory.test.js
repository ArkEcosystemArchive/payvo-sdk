import { assert, describe, Mockery, test } from "@payvo/sdk-test";
import { Signatories } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { bootContainer } from "../test/mocking";
import { Profile } from "./profile";
import { SignatoryFactory } from "./signatory.factory";

let profile;
let wallet;

let subject;

const mnemonic = identity.mnemonic;

test.before(() => {
	bootContainer();

	profile = new Profile({ avatar: "avatar", data: "", id: "profile-id", name: "name" });
});

test.before.each(async () => {
	wallet = await profile.walletFactory().fromMnemonicWithBIP39({
		coin: "ARK",
		mnemonic,
		network: "ark.devnet",
	});

	subject = new SignatoryFactory(wallet);
});

test("returns signatory when mnemonic is provided", async () => {
	assert.instance(await subject.make({ mnemonic }), Signatories.Signatory);
});

test("returns signatory when mnemonic and 2nd mnemonic are provided", async () => {
	assert.instance(await subject.make({ mnemonic, secondMnemonic: "second mnemonic" }), Signatories.Signatory);
});

test("when encryption password is provided it returns signatory when wallet acts with mnemonic", async () => {
	Mockery.stub(wallet, "isSecondSignature").mockReturnValueOnce(false);
	wallet.signingKey().set(mnemonic, "password");

	assert.instance(await subject.make({ encryptionPassword: "password" }), Signatories.Signatory);
});

test("when encryption password is provided it returns signatory when wallet and acts with mnemonic and has 2nd signature", async () => {
	Mockery.stub(wallet, "isSecondSignature").mockReturnValueOnce(true);
	wallet.signingKey().set(mnemonic, "password");
	wallet.confirmKey().set("second mnemonic", "password");

	assert.instance(await subject.make({ encryptionPassword: "password" }), Signatories.Signatory);
});

test("when encryption password is provided it returns signatory when wallet acts with secret", async () => {
	const wallet = await profile.walletFactory().fromSecret({
		coin: "ARK",
		network: "ark.devnet",
		password: "password",
		secret: "secret",
	});

	Mockery.stub(wallet, "isSecondSignature").mockReturnValueOnce(false);

	subject = new SignatoryFactory(wallet);

	assert.instance(await subject.make({ encryptionPassword: "password" }), Signatories.Signatory);
});

test("when encryption password is provided it returns signatory when wallet acts with secret and has 2nd signature", async () => {
	const wallet = await profile.walletFactory().fromSecret({
		coin: "ARK",
		network: "ark.devnet",
		password: "password",
		secret: "secret",
	});

	Mockery.stub(wallet, "isSecondSignature").mockReturnValueOnce(true);

	wallet.confirmKey().set("second secret", "password");

	subject = new SignatoryFactory(wallet);

	assert.instance(await subject.make({ encryptionPassword: "password" }), Signatories.Signatory);
});

test("returns signatory when wallet is multi-signature", async () => {
	Mockery.stub(wallet, "isMultiSignature").mockReturnValueOnce(true);
	Mockery.stub(wallet.multiSignature(), "all").mockReturnValueOnce({
		min: 1,
		publicKeys: [wallet.publicKey()],
	});

	assert.instance(await subject.make({}), Signatories.Signatory);
});

test("returns signatory when wallet is Ledger", async () => {
	Mockery.stub(wallet, "isMultiSignature").mockReturnValueOnce(false);
	Mockery.stub(wallet, "isLedger").mockReturnValueOnce(true);
	Mockery.stub(wallet.data(), "get").mockReturnValueOnce("m/44'/111'/0'/0/0");

	assert.instance(await subject.make({}), Signatories.Signatory);
});

test("throw error when wallet is Ledger but no derivation path exists", async () => {
	Mockery.stub(wallet, "isMultiSignature").mockReturnValueOnce(false);
	Mockery.stub(wallet, "isLedger").mockReturnValueOnce(true);

	assert.throws(() => subject.make({}), "[derivationPath] must be string.");
});

test("returns signatory when wif is provided", async () => {
	Mockery.stub(wallet, "isMultiSignature").mockReturnValueOnce(false);

	const { wif } = await wallet.wifService().fromMnemonic(mnemonic);

	assert.instance(await subject.make({ wif }), Signatories.Signatory);
});

test("returns signatory when private key is provided", async () => {
	Mockery.stub(wallet, "isMultiSignature").mockReturnValueOnce(false);

	const { privateKey } = await wallet.privateKeyService().fromMnemonic(mnemonic);

	assert.instance(await subject.make({ privateKey }), Signatories.Signatory);
});

test("returns signatory when secret is provided", async () => {
	wallet = await profile.walletFactory().fromSecret({
		coin: "ARK",
		network: "ark.devnet",
		secret: "secret",
	});

	Mockery.stub(wallet, "isMultiSignature").mockReturnValueOnce(false);

	subject = new SignatoryFactory(wallet);

	assert.instance(await subject.make({ secret: "secret" }), Signatories.Signatory);
});

test("returns signatory when secret and 2nd secret are provided", async () => {
	wallet = await profile.walletFactory().fromSecret({
		coin: "ARK",
		network: "ark.devnet",
		secret: "secret",
	});

	Mockery.stub(wallet, "isMultiSignature").mockReturnValueOnce(false);
	Mockery.stub(wallet, "isSecondSignature").mockReturnValueOnce(true);

	subject = new SignatoryFactory(wallet);

	assert.instance(await subject.make({ secret: "secret", secondSecret: "second secret" }), Signatories.Signatory);
});

test("throws error when no signing key is provided", () => {
	Mockery.stub(wallet, "isMultiSignature").mockReturnValueOnce(false);

	assert.throws(() => subject.make({}), "No signing key provided.");
});

test.run();
