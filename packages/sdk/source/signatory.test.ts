import { describe } from "@payvo/sdk-test";

import { ConfirmationMnemonicSignatory } from "./confirmation-mnemonic.signatory.js";
import { ConfirmationSecretSignatory } from "./confirmation-secret.signatory.js";
import { ConfirmationWIFSignatory } from "./confirmation-wif.signatory.js";
import { LedgerSignatory } from "./ledger.signatory.js";
import { MnemonicSignatory } from "./mnemonic.signatory.js";
import { MultiSignatureSignatory } from "./multi-signature.signatory.js";
import { PrivateKeySignatory } from "./private-key.signatory.js";
import { SecretSignatory } from "./secret.signatory.js";
import { Signatory } from "./signatory.js";
import { WIFSignatory } from "./wif.signatory.js";

describe("Signatory", ({ assert, it, nock, loader }) => {
	it("should determine if has a multi-signature asset", () => {
		let subject = new Signatory(
			new SecretSignatory({
				address: "",
				privateKey: "",
				publicKey: "",
				signingKey: "this is a top secret passphrase 1",
			}),
		);

		assert.boolean(subject.hasMultiSignature());

		subject = new Signatory(
			new SecretSignatory({
				address: "",
				privateKey: "",
				publicKey: "",
				signingKey: "this is a top secret passphrase 1",
			}),
			{
				min: 4,
				publicKeys: [
					"0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
					"023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
					"032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
					"0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
					"029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
					"034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
				],
			},
		);

		assert.is(subject.hasMultiSignature(), true);
	});

	it("should determine if the signatory acts with mnemonic", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				address: "",
				privateKey: "",
				publicKey: "",
				signingKey: "this is a top secret passphrase 1",
			}),
		);

		assert.boolean(subject.actsWithMnemonic());
	});

	it("should determine if the signatory acts with confirmation mnemonic", () => {
		const subject = new Signatory(
			new ConfirmationMnemonicSignatory({
				address: "",
				confirmKey: "this is a top secret passphrase 2",
				privateKey: "",
				publicKey: "",
				signingKey: "this is a top secret passphrase 1",
			}),
		);

		assert.boolean(subject.actsWithConfirmationMnemonic());
	});

	it("should determine if the signatory acts with wif", () => {
		const subject = new Signatory(
			new WIFSignatory({
				address: "",
				privateKey: "",
				publicKey: "",
				signingKey: "this is a top secret passphrase 1",
			}),
		);

		assert.boolean(subject.actsWithWIF());
	});

	it("should determine if the signatory acts with confirmation wif", () => {
		const subject = new Signatory(
			new ConfirmationWIFSignatory({
				address: "",
				confirmKey: "this is a top secret passphrase 2",
				privateKey: "",
				publicKey: "",
				signingKey: "this is a top secret passphrase 1",
			}),
		);

		assert.boolean(subject.actsWithConfirmationWIF());
	});

	it("should determine if the signatory acts with private key", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				address: "",
				signingKey: "this is a top secret passphrase 1",
			}),
		);

		assert.boolean(subject.actsWithPrivateKey());
	});

	it("should determine if the signatory acts with multi signature", () => {
		const subject = new Signatory(new LedgerSignatory({ signingKey: "path" }));

		assert.boolean(subject.actsWithMultiSignature());
	});

	it("should determine if the signatory acts with ledger", () => {
		const subject = new Signatory(new LedgerSignatory({ signingKey: "path" }));

		assert.boolean(subject.actsWithLedger());
	});

	it("should determine if the signatory acts with secret", () => {
		const subject = new Signatory(
			new SecretSignatory({
				address: "",
				privateKey: "",
				publicKey: "",
				signingKey: "this is a top secret passphrase 1",
			}),
		);

		assert.boolean(subject.actsWithSecret());
	});

	it("should determine if the signatory acts with confirmation secret", () => {
		const subject = new Signatory(
			new ConfirmationSecretSignatory({
				address: "",
				confirmKey: "this is a top secret passphrase 2",
				privateKey: "",
				publicKey: "",
				signingKey: "this is a top secret passphrase 1",
			}),
		);

		assert.boolean(subject.actsWithConfirmationSecret());
	});
});

describe("MnemonicSignatory", ({ assert, it, nock, loader }) => {
	it("should have a signing key", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				address: "address",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.signingKey(), "signingKey");
	});

	it("should have a confirmation key", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				address: "address",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.throws(() => subject.confirmKey(), "cannot be called");
	});

	it("should have an address", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				address: "address",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.address(), "address");
	});

	it("should have a public key", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				address: "address",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.publicKey(), "publicKey");
	});

	it("should have a private key", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				address: "address",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.privateKey(), "privateKey");
	});

	it("have a multi signature", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				address: "address",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
			{
				min: 4,
				publicKeys: [
					"0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
					"023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
					"032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
					"0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
					"029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
					"034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
				],
			},
		);

		assert.object(subject.multiSignature());
	});

	it("should respect options", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				address: "address",
				options: {
					bip44: {
						account: 0,
					},
				},
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
			{
				min: 4,
				publicKeys: [
					"0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
					"023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
					"032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
					"0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
					"029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
					"034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
				],
			},
		);

		assert.equal(subject.options(), {
			bip44: {
				account: 0,
			},
		});
	});
});

describe("ConfirmationMnemonicSignatory", ({ assert, it, nock, loader }) => {
	it("should have a signing key", () => {
		const subject = new Signatory(
			new ConfirmationMnemonicSignatory({
				address: "address",
				confirmKey: "confirmKey",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.signingKey(), "signingKey");
	});

	it("should have a confirmation key", () => {
		const subject = new Signatory(
			new ConfirmationMnemonicSignatory({
				address: "address",
				confirmKey: "confirmKey",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.confirmKey(), "confirmKey");
	});

	it("should have an address", () => {
		const subject = new Signatory(
			new ConfirmationMnemonicSignatory({
				address: "address",
				confirmKey: "confirmKey",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.address(), "address");
	});

	it("should have a public key", () => {
		const subject = new Signatory(
			new ConfirmationMnemonicSignatory({
				address: "address",
				confirmKey: "confirmKey",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.publicKey(), "publicKey");
	});

	it("should have a private key", () => {
		const subject = new Signatory(
			new ConfirmationMnemonicSignatory({
				address: "address",
				confirmKey: "confirmKey",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.privateKey(), "privateKey");
	});

	it("have a multi signature", () => {
		const subject = new Signatory(
			new ConfirmationMnemonicSignatory({
				address: "address",
				confirmKey: "confirmKey",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
			{
				min: 4,
				publicKeys: [
					"0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
					"023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
					"032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
					"0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
					"029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
					"034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
				],
			},
		);

		assert.object(subject.multiSignature());
	});
});

describe("WIFSignatory", ({ assert, it, nock, loader }) => {
	it("should have a signing key", () => {
		const subject = new Signatory(
			new WIFSignatory({
				address: "address",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.signingKey(), "signingKey");
	});

	it("should have a confirmation key", () => {
		const subject = new Signatory(
			new WIFSignatory({
				address: "address",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.throws(() => subject.confirmKey(), "cannot be called");
	});

	it("should have an address", () => {
		const subject = new Signatory(
			new WIFSignatory({
				address: "address",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.address(), "address");
	});

	it("should have a public key", () => {
		const subject = new Signatory(
			new WIFSignatory({
				address: "address",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.publicKey(), "publicKey");
	});

	it("should have a private key", () => {
		const subject = new Signatory(
			new WIFSignatory({
				address: "address",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.privateKey(), "privateKey");
	});

	it("have a multi signature", () => {
		const subject = new Signatory(
			new WIFSignatory({
				address: "address",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
			{
				min: 4,
				publicKeys: [
					"0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
					"023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
					"032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
					"0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
					"029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
					"034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
				],
			},
		);

		assert.object(subject.multiSignature());
	});
});

describe("ConfirmationWIFSignatory", ({ assert, it, nock, loader }) => {
	it("should have a signing key", () => {
		const subject = new Signatory(
			new ConfirmationWIFSignatory({
				address: "address",
				confirmKey: "confirmKey",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.signingKey(), "signingKey");
	});

	it("should have a confirmation key", () => {
		const subject = new Signatory(
			new ConfirmationWIFSignatory({
				address: "address",
				confirmKey: "confirmKey",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.confirmKey(), "confirmKey");
	});

	it("should have an address", () => {
		const subject = new Signatory(
			new ConfirmationWIFSignatory({
				address: "address",
				confirmKey: "confirmKey",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.address(), "address");
	});

	it("should have a public key", () => {
		const subject = new Signatory(
			new ConfirmationWIFSignatory({
				address: "address",
				confirmKey: "confirmKey",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.publicKey(), "publicKey");
	});

	it("should have a private key", () => {
		const subject = new Signatory(
			new ConfirmationWIFSignatory({
				address: "address",
				confirmKey: "confirmKey",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.privateKey(), "privateKey");
	});

	it("have a multi signature", () => {
		const subject = new Signatory(
			new ConfirmationWIFSignatory({
				address: "address",
				confirmKey: "confirmKey",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
			{
				min: 4,
				publicKeys: [
					"0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
					"023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
					"032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
					"0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
					"029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
					"034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
				],
			},
		);

		assert.object(subject.multiSignature());
	});
});

describe("PrivateKeySignatory", ({ assert, it, nock, loader }) => {
	it("should have a signing key", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				address: "address",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.signingKey(), "signingKey");
	});

	it("should have a confirmation key", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				address: "address",
				signingKey: "signingKey",
			}),
		);

		assert.throws(() => subject.confirmKey(), "cannot be called");
	});

	it("should have an address", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				address: "address",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.address(), "address");
	});

	it("should have a public key", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				address: "address",
				signingKey: "signingKey",
			}),
		);

		assert.throws(() => subject.publicKey(), "cannot be called");
	});

	it("should have a private key", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				address: "address",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.privateKey(), "signingKey");
	});

	it("have a multi signature", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				address: "address",
				signingKey: "signingKey",
			}),
			{
				min: 4,
				publicKeys: [
					"0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
					"023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
					"032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
					"0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
					"029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
					"034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
				],
			},
		);

		assert.object(subject.multiSignature());
	});

	it("should respect options", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				address: "address",
				options: {
					bip44: {
						account: 0,
					},
				},
				signingKey: "signingKey",
			}),
			{
				min: 4,
				publicKeys: [
					"0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
					"023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
					"032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
					"0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
					"029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
					"034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
				],
			},
		);

		assert.equal(subject.options(), {
			bip44: {
				account: 0,
			},
		});
	});
});

describe("MultiSignatureSignatory", ({ assert, it, nock, loader }) => {
	it("should have a signing key", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		assert.throws(() => subject.signingKey(), "cannot be called");
	});

	it("should have an asset", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		assert.object(subject.asset());
	});

	it("should have a confirmation key", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		assert.throws(() => subject.confirmKey(), "cannot be called");
	});

	it("should have an address", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		assert.is(subject.address(), "identifier");
	});

	it("should have a public key", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		assert.throws(() => subject.publicKey(), "cannot be called");
	});

	it("should have a private key", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		assert.throws(() => subject.privateKey(), "cannot be called");
	});
});

describe("ConfirmationSecretSignatory", ({ assert, it, nock, loader }) => {
	it("should have a signing key", () => {
		const subject = new Signatory(
			new ConfirmationSecretSignatory({
				address: "address",
				confirmKey: "confirmKey",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.signingKey(), "signingKey");
	});

	it("should have a confirmation key", () => {
		const subject = new Signatory(
			new ConfirmationSecretSignatory({
				address: "address",
				confirmKey: "confirmKey",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.confirmKey(), "confirmKey");
	});

	it("should have an address", () => {
		const subject = new Signatory(
			new ConfirmationSecretSignatory({
				address: "address",
				confirmKey: "confirmKey",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.address(), "address");
	});

	it("should have a public key", () => {
		const subject = new Signatory(
			new ConfirmationSecretSignatory({
				address: "address",
				confirmKey: "confirmKey",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.publicKey(), "publicKey");
	});

	it("should have a private key", () => {
		const subject = new Signatory(
			new ConfirmationSecretSignatory({
				address: "address",
				confirmKey: "confirmKey",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
		);

		assert.is(subject.privateKey(), "privateKey");
	});

	it("have a multi signature", () => {
		const subject = new Signatory(
			new ConfirmationSecretSignatory({
				address: "address",
				confirmKey: "confirmKey",
				privateKey: "privateKey",
				publicKey: "publicKey",
				signingKey: "signingKey",
			}),
			{
				min: 4,
				publicKeys: [
					"0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
					"023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
					"032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
					"0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
					"029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
					"034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
				],
			},
		);

		assert.object(subject.multiSignature());
	});
});
