import "jest-extended";

import { ConfirmationMnemonicSignatory } from "./confirmation-mnemonic";
import { ConfirmationWIFSignatory } from "./confirmation-wif";
import { LedgerSignatory } from "./ledger";
import { MnemonicSignatory } from "./mnemonic";
import { MultiSignatureSignatory } from "./multi-signature";
import { PrivateKeySignatory } from "./private-key";
import { SecretSignatory } from "./secret";
import { Signatory } from "./signatory";
import { WIFSignatory } from "./wif";

describe("MnemonicSignatory", () => {
	test("#signingKey", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.signingKey()).toMatchInlineSnapshot(`"signingKey"`);
	});

	test("#confirmKey", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.confirmKey()).toThrow(/cannot be called/);
	});

	test("#address", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.address()).toMatchInlineSnapshot(`"address"`);
	});

	test("#publicKey", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.publicKey()).toMatchInlineSnapshot(`"publicKey"`);
	});

	test("#privateKey", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.privateKey()).toMatchInlineSnapshot(`"privateKey"`);
	});

	test("#multiSignature", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
			{
				publicKeys: [
					"0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
					"023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
					"032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
					"0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
					"029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
					"034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
				],
				min: 4,
			},
		);

		expect(subject.multiSignature()).toMatchInlineSnapshot(`
		Object {
		  "min": 4,
		  "publicKeys": Array [
		    "0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
		    "023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
		    "032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
		    "0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
		    "029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
		    "034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
		  ],
		}
	`);
	});

	test("#options", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
				options: {
					bip44: {
						account: 0,
					},
				},
			}),
			{
				publicKeys: [
					"0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
					"023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
					"032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
					"0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
					"029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
					"034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
				],
				min: 4,
			},
		);

		expect(subject.options()).toMatchInlineSnapshot(`
		Object {
		  "bip44": Object {
		    "account": 0,
		  },
		}
	`);
	});
});

describe("ConfirmationMnemonicSignatory", () => {
	test("#signingKey", () => {
		const subject = new Signatory(
			new ConfirmationMnemonicSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.signingKey()).toMatchInlineSnapshot(`"signingKey"`);
	});

	test("#confirmKey", () => {
		const subject = new Signatory(
			new ConfirmationMnemonicSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.confirmKey()).toMatchInlineSnapshot(`"confirmKey"`);
	});

	test("#address", () => {
		const subject = new Signatory(
			new ConfirmationMnemonicSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.address()).toMatchInlineSnapshot(`"address"`);
	});

	test("#publicKey", () => {
		const subject = new Signatory(
			new ConfirmationMnemonicSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.publicKey()).toMatchInlineSnapshot(`"publicKey"`);
	});

	test("#privateKey", () => {
		const subject = new Signatory(
			new ConfirmationMnemonicSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.privateKey()).toMatchInlineSnapshot(`"privateKey"`);
	});

	test("#multiSignature", () => {
		const subject = new Signatory(
			new ConfirmationMnemonicSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
			{
				publicKeys: [
					"0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
					"023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
					"032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
					"0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
					"029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
					"034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
				],
				min: 4,
			},
		);

		expect(subject.multiSignature()).toMatchInlineSnapshot(`
		Object {
		  "min": 4,
		  "publicKeys": Array [
		    "0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
		    "023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
		    "032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
		    "0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
		    "029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
		    "034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
		  ],
		}
	`);
	});
});

describe("WIFSignatory", () => {
	test("#signingKey", () => {
		const subject = new Signatory(
			new WIFSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.signingKey()).toMatchInlineSnapshot(`"signingKey"`);
	});

	test("#confirmKey", () => {
		const subject = new Signatory(
			new WIFSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.confirmKey()).toThrow(/cannot be called/);
	});

	test("#address", () => {
		const subject = new Signatory(
			new WIFSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.address()).toMatchInlineSnapshot(`"address"`);
	});

	test("#publicKey", () => {
		const subject = new Signatory(
			new WIFSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.publicKey()).toMatchInlineSnapshot(`"publicKey"`);
	});

	test("#privateKey", () => {
		const subject = new Signatory(
			new WIFSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.privateKey()).toMatchInlineSnapshot(`"privateKey"`);
	});

	test("#multiSignature", () => {
		const subject = new Signatory(
			new WIFSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
			{
				publicKeys: [
					"0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
					"023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
					"032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
					"0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
					"029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
					"034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
				],
				min: 4,
			},
		);

		expect(subject.multiSignature()).toMatchInlineSnapshot(`
		Object {
		  "min": 4,
		  "publicKeys": Array [
		    "0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
		    "023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
		    "032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
		    "0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
		    "029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
		    "034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
		  ],
		}
	`);
	});
});

describe("ConfirmationWIFSignatory", () => {
	test("#signingKey", () => {
		const subject = new Signatory(
			new ConfirmationWIFSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.signingKey()).toMatchInlineSnapshot(`"signingKey"`);
	});

	test("#confirmKey", () => {
		const subject = new Signatory(
			new ConfirmationWIFSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.confirmKey()).toMatchInlineSnapshot(`"confirmKey"`);
	});

	test("#address", () => {
		const subject = new Signatory(
			new ConfirmationWIFSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.address()).toMatchInlineSnapshot(`"address"`);
	});

	test("#publicKey", () => {
		const subject = new Signatory(
			new ConfirmationWIFSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.publicKey()).toMatchInlineSnapshot(`"publicKey"`);
	});

	test("#privateKey", () => {
		const subject = new Signatory(
			new ConfirmationWIFSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.privateKey()).toMatchInlineSnapshot(`"privateKey"`);
	});

	test("#multiSignature", () => {
		const subject = new Signatory(
			new ConfirmationWIFSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
			{
				publicKeys: [
					"0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
					"023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
					"032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
					"0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
					"029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
					"034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
				],
				min: 4,
			},
		);

		expect(subject.multiSignature()).toMatchInlineSnapshot(`
		Object {
		  "min": 4,
		  "publicKeys": Array [
		    "0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
		    "023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
		    "032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
		    "0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
		    "029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
		    "034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
		  ],
		}
	`);
	});
});

describe("PrivateKeySignatory", () => {
	test("#signingKey", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				signingKey: "signingKey",
				address: "address",
			}),
		);

		expect(subject.signingKey()).toMatchInlineSnapshot(`"signingKey"`);
	});

	test("#confirmKey", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				signingKey: "signingKey",
				address: "address",
			}),
		);

		expect(() => subject.confirmKey()).toThrow(/cannot be called/);
	});

	test("#address", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				signingKey: "signingKey",
				address: "address",
			}),
		);

		expect(subject.address()).toMatchInlineSnapshot(`"address"`);
	});

	test("#publicKey", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				signingKey: "signingKey",
				address: "address",
			}),
		);

		expect(() => subject.publicKey()).toThrow(/cannot be called/);
	});

	test("#privateKey", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				signingKey: "signingKey",
				address: "address",
			}),
		);

		expect(subject.privateKey()).toMatchInlineSnapshot(`"signingKey"`);
	});

	test("#multiSignature", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				signingKey: "signingKey",
				address: "address",
			}),
			{
				publicKeys: [
					"0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
					"023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
					"032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
					"0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
					"029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
					"034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
				],
				min: 4,
			},
		);

		expect(subject.multiSignature()).toMatchInlineSnapshot(`
		Object {
		  "min": 4,
		  "publicKeys": Array [
		    "0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
		    "023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
		    "032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
		    "0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
		    "029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
		    "034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
		  ],
		}
	`);
	});

	test("#options", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				signingKey: "signingKey",
				address: "address",
				options: {
					bip44: {
						account: 0,
					},
				},
			}),
			{
				publicKeys: [
					"0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
					"023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
					"032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
					"0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
					"029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
					"034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
				],
				min: 4,
			},
		);

		expect(subject.options()).toMatchInlineSnapshot(`
		Object {
		  "bip44": Object {
		    "account": 0,
		  },
		}
	`);
	});
});

describe("MultiSignatureSignatory", () => {
	test("#signingKey", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		expect(() => subject.signingKey()).toThrow(/cannot be called/);
	});

	test("#asset", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		expect(subject.asset()).toMatchInlineSnapshot(`
		Object {
		  "min": 5,
		  "publicKeys": Array [
		    "identifier",
		  ],
		}
	`);
	});

	test("#confirmKey", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		expect(() => subject.confirmKey()).toThrow(/cannot be called/);
	});

	test("#address", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		expect(subject.address()).toMatchInlineSnapshot(`"identifier"`);
	});

	test("#publicKey", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		expect(() => subject.publicKey()).toThrow(/cannot be called/);
	});

	test("#privateKey", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		expect(() => subject.privateKey()).toThrow(/cannot be called/);
	});
});

test("#hasMultiSignature", () => {
	let subject = new Signatory(
		new SecretSignatory({
			signingKey: "this is a top secret passphrase 1",
			address: "",
			publicKey: "",
			privateKey: "",
		}),
	);

	expect(subject.hasMultiSignature()).toBeBoolean();

	subject = new Signatory(
		new SecretSignatory({
			signingKey: "this is a top secret passphrase 1",
			address: "",
			publicKey: "",
			privateKey: "",
		}),
		{
			publicKeys: [
				"0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
				"023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
				"032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
				"0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
				"029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
				"034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
			],
			min: 4,
		},
	);

	expect(subject.hasMultiSignature()).toBeTrue();
});

test("#actsWithMnemonic", () => {
	const subject = new Signatory(
		new SecretSignatory({
			signingKey: "this is a top secret passphrase 1",
			address: "",
			publicKey: "",
			privateKey: "",
		}),
	);

	expect(subject.actsWithMnemonic()).toBeBoolean();
});

test("#actsWithConfirmationMnemonic", () => {
	const subject = new Signatory(
		new SecretSignatory({
			signingKey: "this is a top secret passphrase 1",
			address: "",
			publicKey: "",
			privateKey: "",
		}),
	);

	expect(subject.actsWithConfirmationMnemonic()).toBeBoolean();
});

test("#actsWithWIF", () => {
	const subject = new Signatory(
		new SecretSignatory({
			signingKey: "this is a top secret passphrase 1",
			address: "",
			publicKey: "",
			privateKey: "",
		}),
	);

	expect(subject.actsWithWIF()).toBeBoolean();
});

test("#actsWithConfirmationWIF", () => {
	const subject = new Signatory(
		new SecretSignatory({
			signingKey: "this is a top secret passphrase 1",
			address: "",
			publicKey: "",
			privateKey: "",
		}),
	);

	expect(subject.actsWithConfirmationWIF()).toBeBoolean();
});

test("#actsWithPrivateKey", () => {
	const subject = new Signatory(
		new SecretSignatory({
			signingKey: "this is a top secret passphrase 1",
			address: "",
			publicKey: "",
			privateKey: "",
		}),
	);

	expect(subject.actsWithPrivateKey()).toBeBoolean();
});

test("#actsWithMultiSignature", () => {
	const subject = new Signatory(new LedgerSignatory({ signingKey: "path" }));

	expect(subject.actsWithMultiSignature()).toBeBoolean();
});

test("#actsWithLedger", () => {
	const subject = new Signatory(new LedgerSignatory({ signingKey: "path" }));

	expect(subject.actsWithLedger()).toBeBoolean();
});

test("#actsWithSecret", () => {
	const subject = new Signatory(
		new SecretSignatory({
			signingKey: "this is a top secret passphrase 1",
			address: "",
			publicKey: "",
			privateKey: "",
		}),
	);

	expect(subject.actsWithSecret()).toBeBoolean();
});
