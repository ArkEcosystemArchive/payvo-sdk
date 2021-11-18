import { Signatories } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity.js";
import { bootContainer } from "../test/mocking.js";
import { IProfile, IReadWriteWallet, ISignatoryFactory } from "./contracts.js";
import { Profile } from "./profile.js";
import { SignatoryFactory } from "./signatory.factory";

let profile: IProfile;
let wallet: IReadWriteWallet;

let subject: ISignatoryFactory;

const mnemonic = identity.mnemonic;

describe("SignatoryFactory", () => {
	beforeAll(() => {
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

	it("returns signatory when mnemonic is provided", async () => {
		await assert.is(subject.make({ mnemonic })).resolves.toBeInstanceOf(Signatories.Signatory);
	});

	it("returns signatory when mnemonic and 2nd mnemonic are provided", async () => {
		await assert
			.is(subject.make({ mnemonic, secondMnemonic: "second mnemonic" }))
			.resolves.toBeInstanceOf(Signatories.Signatory);
	});

	describe("when encryption password is provided", () => {
		it("returns signatory when wallet acts with mnemonic", async () => {
			jest.spyOn(wallet, "isSecondSignature").mockReturnValueOnce(false);
			wallet.signingKey().set(mnemonic, "password");

			await assert
				.is(subject.make({ encryptionPassword: "password" }))
				.resolves.toBeInstanceOf(Signatories.Signatory);
		});

		it("returns signatory when wallet and acts with mnemonic and has 2nd signature", async () => {
			jest.spyOn(wallet, "isSecondSignature").mockReturnValueOnce(true);
			wallet.signingKey().set(mnemonic, "password");
			wallet.confirmKey().set("second mnemonic", "password");

			await assert
				.is(subject.make({ encryptionPassword: "password" }))
				.resolves.toBeInstanceOf(Signatories.Signatory);
		});

		it("returns signatory when wallet acts with secret", async () => {
			const wallet = await profile.walletFactory().fromSecret({
				coin: "ARK",
				network: "ark.devnet",
				password: "password",
				secret: "secret",
			});

			jest.spyOn(wallet, "isSecondSignature").mockReturnValueOnce(false);

			subject = new SignatoryFactory(wallet);

			await assert
				.is(subject.make({ encryptionPassword: "password" }))
				.resolves.toBeInstanceOf(Signatories.Signatory);
		});

		it("returns signatory when wallet acts with secret and has 2nd signature", async () => {
			const wallet = await profile.walletFactory().fromSecret({
				coin: "ARK",
				network: "ark.devnet",
				password: "password",
				secret: "secret",
			});

			jest.spyOn(wallet, "isSecondSignature").mockReturnValueOnce(true);

			wallet.confirmKey().set("second secret", "password");

			subject = new SignatoryFactory(wallet);

			await assert
				.is(subject.make({ encryptionPassword: "password" }))
				.resolves.toBeInstanceOf(Signatories.Signatory);
		});
	});

	it("returns signatory when wallet is multi-signature", async () => {
		jest.spyOn(wallet, "isMultiSignature").mockReturnValueOnce(true);
		jest.spyOn(wallet.multiSignature(), "all").mockReturnValueOnce({
			min: 1,
			publicKeys: [wallet.publicKey()!],
		});

		await assert.is(subject.make({})).resolves.toBeInstanceOf(Signatories.Signatory);
	});

	it("returns signatory when wallet is Ledger", async () => {
		jest.spyOn(wallet, "isMultiSignature").mockReturnValueOnce(false);
		jest.spyOn(wallet, "isLedger").mockReturnValueOnce(true);
		jest.spyOn(wallet.data(), "get").mockReturnValueOnce("m/44'/111'/0'/0/0");

		await assert.is(subject.make({})).resolves.toBeInstanceOf(Signatories.Signatory);
	});

	it("throw error when wallet is Ledger but no derivation path exists", async () => {
		jest.spyOn(wallet, "isMultiSignature").mockReturnValueOnce(false);
		jest.spyOn(wallet, "isLedger").mockReturnValueOnce(true);

		assert.is(() => subject.make({})).toThrow("[derivationPath] must be string.");
	});

	it("returns signatory when wif is provided", async () => {
		jest.spyOn(wallet, "isMultiSignature").mockReturnValueOnce(false);

		const { wif } = await wallet.wifService().fromMnemonic(mnemonic);

		await assert.is(subject.make({ wif })).resolves.toBeInstanceOf(Signatories.Signatory);
	});

	it("returns signatory when private key is provided", async () => {
		jest.spyOn(wallet, "isMultiSignature").mockReturnValueOnce(false);

		const { privateKey } = await wallet.privateKeyService().fromMnemonic(mnemonic);

		await assert.is(subject.make({ privateKey })).resolves.toBeInstanceOf(Signatories.Signatory);
	});

	it("returns signatory when secret is provided", async () => {
		wallet = await profile.walletFactory().fromSecret({
			coin: "ARK",
			network: "ark.devnet",
			secret: "secret",
		});

		jest.spyOn(wallet, "isMultiSignature").mockReturnValueOnce(false);

		subject = new SignatoryFactory(wallet);

		await assert.is(subject.make({ secret: "secret" })).resolves.toBeInstanceOf(Signatories.Signatory);
	});

	it("returns signatory when secret and 2nd secret are provided", async () => {
		wallet = await profile.walletFactory().fromSecret({
			coin: "ARK",
			network: "ark.devnet",
			secret: "secret",
		});

		jest.spyOn(wallet, "isMultiSignature").mockReturnValueOnce(false);
		jest.spyOn(wallet, "isSecondSignature").mockReturnValueOnce(true);

		subject = new SignatoryFactory(wallet);

		await assert
			.is(subject.make({ secret: "secret", secondSecret: "second secret" }))
			.resolves.toBeInstanceOf(Signatories.Signatory);
	});

	it("throws error when no signing key is provided", () => {
		jest.spyOn(wallet, "isMultiSignature").mockReturnValueOnce(false);

		assert.is(() => subject.make({})).toThrow("No signing key provided.");
	});
});
