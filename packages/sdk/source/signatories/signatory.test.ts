import "jest-extended";

import { LedgerSignatory } from "./ledger";
import { MnemonicSignatory } from "./mnemonic";
import { MultiMnemonicSignatory } from "./multi-mnemonic";
import { MultiSignatureSignatory } from "./multi-signature";
import { PrivateKeySignatory } from "./private-key";
import { PrivateMultiSignatureSignatory } from "./private-multi-signature";
import { SecondaryMnemonicSignatory } from "./secondary-mnemonic";
import { SecondaryWIFSignatory } from "./secondary-wif";
import { SenderPublicKeySignatory } from "./sender-public-key";
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

	test("#signingKeys", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.signingKeys()).toThrow(/cannot be called/);
	});

	test("#signingList", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.signingList()).toThrow(/cannot be called/);
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

	test("#identifier", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.identifier()).toThrow(/cannot be called/);
	});

	test("#identifiers", () => {
		const subject = new Signatory(
			new MnemonicSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.identifiers()).toThrow(/cannot be called/);
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
});

describe("MultiMnemonicSignatory", () => {
	test("#signingKey", () => {
		const subject = new Signatory(new MultiMnemonicSignatory(["signingKey"], ["identifier"]));

		expect(() => subject.signingKey()).toThrow(/cannot be called/);
	});

	test("#signingKeys", () => {
		const subject = new Signatory(new MultiMnemonicSignatory(["signingKey"], ["identifier"]));

		expect(subject.signingKeys()).toMatchInlineSnapshot(`
		Array [
		  "signingKey",
		]
	`);
	});

	test("#signingList", () => {
		const subject = new Signatory(new MultiMnemonicSignatory(["signingKey"], ["identifier"]));

		expect(() => subject.signingList()).toThrow(/cannot be called/);
	});

	test("#confirmKey", () => {
		const subject = new Signatory(new MultiMnemonicSignatory(["signingKey"], ["identifier"]));

		expect(() => subject.confirmKey()).toThrow(/cannot be called/);
	});

	test("#identifier", () => {
		const subject = new Signatory(new MultiMnemonicSignatory(["signingKey"], ["identifier"]));

		expect(() => subject.identifier()).toThrow(/cannot be called/);
	});

	test("#identifiers", () => {
		const subject = new Signatory(new MultiMnemonicSignatory(["signingKey"], ["identifier"]));

		expect(subject.identifiers()).toMatchInlineSnapshot(`
		Array [
		  "identifier",
		]
	`);
	});

	test("#address", () => {
		const subject = new Signatory(new MultiMnemonicSignatory(["signingKey"], ["identifier"]));

		expect(() => subject.address()).toThrow(/cannot be called/);
	});

	test("#publicKey", () => {
		const subject = new Signatory(new MultiMnemonicSignatory(["signingKey"], ["identifier"]));

		expect(() => subject.publicKey()).toThrow(/cannot be called/);
	});

	test("#privateKey", () => {
		const subject = new Signatory(new MultiMnemonicSignatory(["signingKey"], ["identifier"]));

		expect(() => subject.privateKey()).toThrow(/cannot be called/);
	});

	test("#multiSignature", () => {
		const subject = new Signatory(new MultiMnemonicSignatory(["signingKey"], ["identifier"]), {
			publicKeys: [
				"0271e4ffe50f2955fe32f9e05fb29a23f7dfcce77fa4c8a76328c7ab735033f851",
				"023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
				"032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
				"0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
				"029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
				"034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
			],
			min: 4,
		});

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

describe("SecondaryMnemonicSignatory", () => {
	test("#signingKey", () => {
		const subject = new Signatory(
			new SecondaryMnemonicSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.signingKey()).toMatchInlineSnapshot(`"signingKey"`);
	});

	test("#signingKeys", () => {
		const subject = new Signatory(
			new SecondaryMnemonicSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.signingKeys()).toThrow(/cannot be called/);
	});

	test("#signingList", () => {
		const subject = new Signatory(
			new SecondaryMnemonicSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.signingList()).toThrow(/cannot be called/);
	});

	test("#confirmKey", () => {
		const subject = new Signatory(
			new SecondaryMnemonicSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.confirmKey()).toMatchInlineSnapshot(`"confirmKey"`);
	});

	test("#identifier", () => {
		const subject = new Signatory(
			new SecondaryMnemonicSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.identifier()).toThrow(/cannot be called/);
	});

	test("#identifiers", () => {
		const subject = new Signatory(
			new SecondaryMnemonicSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.identifiers()).toThrow(/cannot be called/);
	});

	test("#address", () => {
		const subject = new Signatory(
			new SecondaryMnemonicSignatory({
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
			new SecondaryMnemonicSignatory({
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
			new SecondaryMnemonicSignatory({
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
			new SecondaryMnemonicSignatory({
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

	test("#signingKeys", () => {
		const subject = new Signatory(
			new WIFSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.signingKeys()).toThrow(/cannot be called/);
	});

	test("#signingList", () => {
		const subject = new Signatory(
			new WIFSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.signingList()).toThrow(/cannot be called/);
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

	test("#identifier", () => {
		const subject = new Signatory(
			new WIFSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.identifier()).toThrow(/cannot be called/);
	});

	test("#identifiers", () => {
		const subject = new Signatory(
			new WIFSignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.identifiers()).toThrow(/cannot be called/);
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

describe("SecondaryWIFSignatory", () => {
	test("#signingKey", () => {
		const subject = new Signatory(
			new SecondaryWIFSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.signingKey()).toMatchInlineSnapshot(`"signingKey"`);
	});

	test("#signingKeys", () => {
		const subject = new Signatory(
			new SecondaryWIFSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.signingKeys()).toThrow(/cannot be called/);
	});

	test("#signingList", () => {
		const subject = new Signatory(
			new SecondaryWIFSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.signingList()).toThrow(/cannot be called/);
	});

	test("#confirmKey", () => {
		const subject = new Signatory(
			new SecondaryWIFSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(subject.confirmKey()).toMatchInlineSnapshot(`"confirmKey"`);
	});

	test("#identifier", () => {
		const subject = new Signatory(
			new SecondaryWIFSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.identifier()).toThrow(/cannot be called/);
	});

	test("#identifiers", () => {
		const subject = new Signatory(
			new SecondaryWIFSignatory({
				signingKey: "signingKey",
				confirmKey: "confirmKey",
				address: "address",
				publicKey: "publicKey",
				privateKey: "privateKey",
			}),
		);

		expect(() => subject.identifiers()).toThrow(/cannot be called/);
	});

	test("#address", () => {
		const subject = new Signatory(
			new SecondaryWIFSignatory({
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
			new SecondaryWIFSignatory({
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
			new SecondaryWIFSignatory({
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
			new SecondaryWIFSignatory({
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

	test("#signingKeys", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				signingKey: "signingKey",
				address: "address",
			}),
		);

		expect(() => subject.signingKeys()).toThrow(/cannot be called/);
	});

	test("#signingList", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				signingKey: "signingKey",
				address: "address",
			}),
		);

		expect(() => subject.signingList()).toThrow(/cannot be called/);
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

	test("#identifier", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				signingKey: "signingKey",
				address: "address",
			}),
		);

		expect(() => subject.identifier()).toThrow(/cannot be called/);
	});

	test("#identifiers", () => {
		const subject = new Signatory(
			new PrivateKeySignatory({
				signingKey: "signingKey",
				address: "address",
			}),
		);

		expect(() => subject.identifiers()).toThrow(/cannot be called/);
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
});

describe("SenderPublicKeySignatory", () => {
	test("#signingKey", () => {
		const subject = new Signatory(
			new SenderPublicKeySignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
			}),
		);

		expect(subject.signingKey()).toMatchInlineSnapshot(`"signingKey"`);
	});

	test("#signingKeys", () => {
		const subject = new Signatory(
			new SenderPublicKeySignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
			}),
		);

		expect(() => subject.signingKeys()).toThrow(/cannot be called/);
	});

	test("#signingList", () => {
		const subject = new Signatory(
			new SenderPublicKeySignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
			}),
		);

		expect(() => subject.signingList()).toThrow(/cannot be called/);
	});

	test("#confirmKey", () => {
		const subject = new Signatory(
			new SenderPublicKeySignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
			}),
		);

		expect(() => subject.confirmKey()).toThrow(/cannot be called/);
	});

	test("#identifier", () => {
		const subject = new Signatory(
			new SenderPublicKeySignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
			}),
		);

		expect(() => subject.identifier()).toThrow(/cannot be called/);
	});

	test("#identifiers", () => {
		const subject = new Signatory(
			new SenderPublicKeySignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
			}),
		);

		expect(() => subject.identifiers()).toThrow(/cannot be called/);
	});

	test("#address", () => {
		const subject = new Signatory(
			new SenderPublicKeySignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
			}),
		);

		expect(subject.address()).toMatchInlineSnapshot(`"address"`);
	});

	test("#publicKey", () => {
		const subject = new Signatory(
			new SenderPublicKeySignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
			}),
		);

		expect(subject.publicKey()).toMatchInlineSnapshot(`"publicKey"`);
	});

	test("#privateKey", () => {
		const subject = new Signatory(
			new SenderPublicKeySignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
			}),
		);

		expect(() => subject.privateKey()).toThrow(/cannot be called/);
	});

	test("#multiSignature", () => {
		const subject = new Signatory(
			new SenderPublicKeySignatory({
				signingKey: "signingKey",
				address: "address",
				publicKey: "publicKey",
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

describe("MultiSignatureSignatory", () => {
	test("#signingKey", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		expect(() => subject.signingKey()).toThrow(/cannot be called/);
	});

	test("#signingKeys", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		expect(() => subject.signingKeys()).toThrow(/cannot be called/);
	});

	test("#signingList", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		expect(subject.signingList()).toMatchInlineSnapshot(`
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

	test("#identifier", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		expect(subject.identifier()).toMatchInlineSnapshot(`"identifier"`);
	});

	test("#identifiers", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		expect(() => subject.identifiers()).toThrow(/cannot be called/);
	});

	test("#address", () => {
		const subject = new Signatory(
			new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
		);

		expect(() => subject.address()).toThrow(/cannot be called/);
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

describe("PrivateMultiSignatureSignatory", () => {
	test("#signingKey", () => {
		const subject = new Signatory(
			new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
				"this is a top secret passphrase 1",
				"this is a top secret passphrase 2",
			]),
		);

		expect(subject.signingKey()).toMatchInlineSnapshot(`"this is a top secret passphrase 1"`);
	});

	test("#signingKeys", () => {
		const subject = new Signatory(
			new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
				"this is a top secret passphrase 1",
				"this is a top secret passphrase 2",
			]),
		);

		expect(subject.signingKeys()).toMatchInlineSnapshot(`
		Array [
		  "this is a top secret passphrase 1",
		  "this is a top secret passphrase 2",
		]
	`);
	});

	test("#signingList", () => {
		const subject = new Signatory(
			new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
				"this is a top secret passphrase 1",
				"this is a top secret passphrase 2",
			]),
		);

		expect(() => subject.confirmKey()).toThrow(/cannot be called/);
	});

	test("#confirmKey", () => {
		const subject = new Signatory(
			new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
				"this is a top secret passphrase 1",
				"this is a top secret passphrase 2",
			]),
		);

		expect(() => subject.confirmKey()).toThrow(/cannot be called/);
	});

	test("#identifier", () => {
		const subject = new Signatory(
			new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
				"this is a top secret passphrase 1",
				"this is a top secret passphrase 2",
			]),
		);

		expect(() => subject.identifier()).toThrow(/cannot be called/);
	});

	test("#identifiers", () => {
		const subject = new Signatory(
			new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
				"this is a top secret passphrase 1",
				"this is a top secret passphrase 2",
			]),
		);

		expect(() => subject.identifiers()).toThrow(/cannot be called/);
	});

	test("#address", () => {
		const subject = new Signatory(
			new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
				"this is a top secret passphrase 1",
				"this is a top secret passphrase 2",
			]),
		);

		expect(() => subject.address()).toThrow(/cannot be called/);
	});

	test("#publicKey", () => {
		const subject = new Signatory(
			new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
				"this is a top secret passphrase 1",
				"this is a top secret passphrase 2",
			]),
		);

		expect(() => subject.publicKey()).toThrow(/cannot be called/);
	});

	test("#privateKey", () => {
		const subject = new Signatory(
			new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
				"this is a top secret passphrase 1",
				"this is a top secret passphrase 2",
			]),
		);

		expect(() => subject.privateKey()).toThrow(/cannot be called/);
	});

	test("#multiSignature", () => {
		const subject = new Signatory(
			new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
				"this is a top secret passphrase 1",
				"this is a top secret passphrase 2",
			]),
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

test("#hasMultiSignature", () => {
	let subject = new Signatory(
		new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
			"this is a top secret passphrase 1",
			"this is a top secret passphrase 2",
		]),
	);

	expect(subject.hasMultiSignature()).toBeBoolean();

	subject = new Signatory(
		new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
			"this is a top secret passphrase 1",
			"this is a top secret passphrase 2",
		]),
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
		new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
			"this is a top secret passphrase 1",
			"this is a top secret passphrase 2",
		]),
	);

	expect(subject.actsWithMnemonic()).toBeBoolean();
});

test("#actsWithMultiMnemonic", () => {
	const subject = new Signatory(
		new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
			"this is a top secret passphrase 1",
			"this is a top secret passphrase 2",
		]),
	);

	expect(subject.actsWithMultiMnemonic()).toBeBoolean();
});

test("#actsWithSecondaryMnemonic", () => {
	const subject = new Signatory(
		new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
			"this is a top secret passphrase 1",
			"this is a top secret passphrase 2",
		]),
	);

	expect(subject.actsWithSecondaryMnemonic()).toBeBoolean();
});

test("#actsWithWif", () => {
	const subject = new Signatory(
		new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
			"this is a top secret passphrase 1",
			"this is a top secret passphrase 2",
		]),
	);

	expect(subject.actsWithWif()).toBeBoolean();
});

test("#actsWithSecondaryWif", () => {
	const subject = new Signatory(
		new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
			"this is a top secret passphrase 1",
			"this is a top secret passphrase 2",
		]),
	);

	expect(subject.actsWithSecondaryWif()).toBeBoolean();
});

test("#actsWithPrivateKey", () => {
	const subject = new Signatory(
		new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
			"this is a top secret passphrase 1",
			"this is a top secret passphrase 2",
		]),
	);

	expect(subject.actsWithPrivateKey()).toBeBoolean();
});

test("#actsWithSenderPublicKey", () => {
	const subject = new Signatory(
		new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
			"this is a top secret passphrase 1",
			"this is a top secret passphrase 2",
		]),
	);

	expect(subject.actsWithSenderPublicKey()).toBeBoolean();
});

test("#actsWithMultiSignature", () => {
	const subject = new Signatory(
		new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
			"this is a top secret passphrase 1",
			"this is a top secret passphrase 2",
		]),
	);

	expect(subject.actsWithMultiSignature()).toBeBoolean();
});

test("#actsWithPrivateMultiSignature", () => {
	const subject = new Signatory(
		new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
			"this is a top secret passphrase 1",
			"this is a top secret passphrase 2",
		]),
	);

	expect(subject.actsWithPrivateMultiSignature()).toBeBoolean();
});

test("#actsWithLedger", () => {
	const subject = new Signatory(new LedgerSignatory("path"));

	expect(subject.actsWithLedger()).toBeBoolean();
});

test("#actsWithSecret", () => {
	const subject = new Signatory(
		new PrivateMultiSignatureSignatory("this is a top secret passphrase 1", [
			"this is a top secret passphrase 1",
			"this is a top secret passphrase 2",
		]),
	);

	expect(subject.actsWithSecret()).toBeBoolean();
});
