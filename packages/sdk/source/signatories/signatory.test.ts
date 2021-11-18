import { ConfirmationMnemonicSignatory } from "./confirmation-mnemonic.js";
import { ConfirmationSecretSignatory } from "./confirmation-secret.js";
import { ConfirmationWIFSignatory } from "./confirmation-wif.js";
import { LedgerSignatory } from "./ledger.js";
import { MnemonicSignatory } from "./mnemonic.js";
import { MultiSignatureSignatory } from "./multi-signature.js";
import { PrivateKeySignatory } from "./private-key.js";
import { SecretSignatory } from "./secret.js";
import { Signatory } from "./signatory.js";
import { WIFSignatory } from "./wif.js";

describe("MnemonicSignatory", () => {
    test("#signingKey", () => {
        const subject = new Signatory(
            new MnemonicSignatory({
                address: "address",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.signingKey()).toMatchInlineSnapshot(`"signingKey"`);
    });

    test("#confirmKey", () => {
        const subject = new Signatory(
            new MnemonicSignatory({
                address: "address",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(() => subject.confirmKey()).toThrow(/cannot be called/);
    });

    test("#address", () => {
        const subject = new Signatory(
            new MnemonicSignatory({
                address: "address",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.address()).toMatchInlineSnapshot(`"address"`);
    });

    test("#publicKey", () => {
        const subject = new Signatory(
            new MnemonicSignatory({
                address: "address",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.publicKey()).toMatchInlineSnapshot(`"publicKey"`);
    });

    test("#privateKey", () => {
        const subject = new Signatory(
            new MnemonicSignatory({
                address: "address",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.privateKey()).toMatchInlineSnapshot(`"privateKey"`);
    });

    test("#multiSignature", () => {
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

        assert.is(subject.multiSignature()).toMatchInlineSnapshot(`
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

        assert.is(subject.options()).toMatchInlineSnapshot(`
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
                address: "address",
                confirmKey: "confirmKey",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.signingKey()).toMatchInlineSnapshot(`"signingKey"`);
    });

    test("#confirmKey", () => {
        const subject = new Signatory(
            new ConfirmationMnemonicSignatory({
                address: "address",
                confirmKey: "confirmKey",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.confirmKey()).toMatchInlineSnapshot(`"confirmKey"`);
    });

    test("#address", () => {
        const subject = new Signatory(
            new ConfirmationMnemonicSignatory({
                address: "address",
                confirmKey: "confirmKey",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.address()).toMatchInlineSnapshot(`"address"`);
    });

    test("#publicKey", () => {
        const subject = new Signatory(
            new ConfirmationMnemonicSignatory({
                address: "address",
                confirmKey: "confirmKey",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.publicKey()).toMatchInlineSnapshot(`"publicKey"`);
    });

    test("#privateKey", () => {
        const subject = new Signatory(
            new ConfirmationMnemonicSignatory({
                address: "address",
                confirmKey: "confirmKey",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.privateKey()).toMatchInlineSnapshot(`"privateKey"`);
    });

    test("#multiSignature", () => {
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

        assert.is(subject.multiSignature()).toMatchInlineSnapshot(`
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
                address: "address",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.signingKey()).toMatchInlineSnapshot(`"signingKey"`);
    });

    test("#confirmKey", () => {
        const subject = new Signatory(
            new WIFSignatory({
                address: "address",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(() => subject.confirmKey()).toThrow(/cannot be called/);
    });

    test("#address", () => {
        const subject = new Signatory(
            new WIFSignatory({
                address: "address",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.address()).toMatchInlineSnapshot(`"address"`);
    });

    test("#publicKey", () => {
        const subject = new Signatory(
            new WIFSignatory({
                address: "address",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.publicKey()).toMatchInlineSnapshot(`"publicKey"`);
    });

    test("#privateKey", () => {
        const subject = new Signatory(
            new WIFSignatory({
                address: "address",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.privateKey()).toMatchInlineSnapshot(`"privateKey"`);
    });

    test("#multiSignature", () => {
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

        assert.is(subject.multiSignature()).toMatchInlineSnapshot(`
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
                address: "address",
                confirmKey: "confirmKey",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.signingKey()).toMatchInlineSnapshot(`"signingKey"`);
    });

    test("#confirmKey", () => {
        const subject = new Signatory(
            new ConfirmationWIFSignatory({
                address: "address",
                confirmKey: "confirmKey",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.confirmKey()).toMatchInlineSnapshot(`"confirmKey"`);
    });

    test("#address", () => {
        const subject = new Signatory(
            new ConfirmationWIFSignatory({
                address: "address",
                confirmKey: "confirmKey",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.address()).toMatchInlineSnapshot(`"address"`);
    });

    test("#publicKey", () => {
        const subject = new Signatory(
            new ConfirmationWIFSignatory({
                address: "address",
                confirmKey: "confirmKey",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.publicKey()).toMatchInlineSnapshot(`"publicKey"`);
    });

    test("#privateKey", () => {
        const subject = new Signatory(
            new ConfirmationWIFSignatory({
                address: "address",
                confirmKey: "confirmKey",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.privateKey()).toMatchInlineSnapshot(`"privateKey"`);
    });

    test("#multiSignature", () => {
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

        assert.is(subject.multiSignature()).toMatchInlineSnapshot(`
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
                address: "address",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.signingKey()).toMatchInlineSnapshot(`"signingKey"`);
    });

    test("#confirmKey", () => {
        const subject = new Signatory(
            new PrivateKeySignatory({
                address: "address",
                signingKey: "signingKey",
            }),
        );

        assert.is(() => subject.confirmKey()).toThrow(/cannot be called/);
    });

    test("#address", () => {
        const subject = new Signatory(
            new PrivateKeySignatory({
                address: "address",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.address()).toMatchInlineSnapshot(`"address"`);
    });

    test("#publicKey", () => {
        const subject = new Signatory(
            new PrivateKeySignatory({
                address: "address",
                signingKey: "signingKey",
            }),
        );

        assert.is(() => subject.publicKey()).toThrow(/cannot be called/);
    });

    test("#privateKey", () => {
        const subject = new Signatory(
            new PrivateKeySignatory({
                address: "address",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.privateKey()).toMatchInlineSnapshot(`"signingKey"`);
    });

    test("#multiSignature", () => {
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

        assert.is(subject.multiSignature()).toMatchInlineSnapshot(`
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

        assert.is(subject.options()).toMatchInlineSnapshot(`
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

        assert.is(() => subject.signingKey()).toThrow(/cannot be called/);
    });

    test("#asset", () => {
        const subject = new Signatory(
            new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
        );

        assert.is(subject.asset()).toMatchInlineSnapshot(`
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

        assert.is(() => subject.confirmKey()).toThrow(/cannot be called/);
    });

    test("#address", () => {
        const subject = new Signatory(
            new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
        );

        assert.is(subject.address()).toMatchInlineSnapshot(`"identifier"`);
    });

    test("#publicKey", () => {
        const subject = new Signatory(
            new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
        );

        assert.is(() => subject.publicKey()).toThrow(/cannot be called/);
    });

    test("#privateKey", () => {
        const subject = new Signatory(
            new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
        );

        assert.is(() => subject.privateKey()).toThrow(/cannot be called/);
    });
});

describe("ConfirmationSecretSignatory", () => {
    test("#signingKey", () => {
        const subject = new Signatory(
            new ConfirmationSecretSignatory({
                address: "address",
                confirmKey: "confirmKey",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.signingKey()).toMatchInlineSnapshot(`"signingKey"`);
    });

    test("#confirmKey", () => {
        const subject = new Signatory(
            new ConfirmationSecretSignatory({
                address: "address",
                confirmKey: "confirmKey",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.confirmKey()).toMatchInlineSnapshot(`"confirmKey"`);
    });

    test("#address", () => {
        const subject = new Signatory(
            new ConfirmationSecretSignatory({
                address: "address",
                confirmKey: "confirmKey",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.address()).toMatchInlineSnapshot(`"address"`);
    });

    test("#publicKey", () => {
        const subject = new Signatory(
            new ConfirmationSecretSignatory({
                address: "address",
                confirmKey: "confirmKey",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.publicKey()).toMatchInlineSnapshot(`"publicKey"`);
    });

    test("#privateKey", () => {
        const subject = new Signatory(
            new ConfirmationSecretSignatory({
                address: "address",
                confirmKey: "confirmKey",
                privateKey: "privateKey",
                publicKey: "publicKey",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.privateKey()).toMatchInlineSnapshot(`"privateKey"`);
    });

    test("#multiSignature", () => {
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

        assert.is(subject.multiSignature()).toMatchInlineSnapshot(`
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
        new SecretSignatory({
            address: "",
            privateKey: "",
            publicKey: "",
            signingKey: "this is a top secret passphrase 1",
        }),
    );

    assert.is(subject.hasMultiSignature()), "boolean");

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

test("#actsWithMnemonic", () => {
    const subject = new Signatory(
        new MnemonicSignatory({
            address: "",
            privateKey: "",
            publicKey: "",
            signingKey: "this is a top secret passphrase 1",
        }),
    );

    assert.is(subject.actsWithMnemonic()), "boolean");
});

test("#actsWithConfirmationMnemonic", () => {
    const subject = new Signatory(
        new ConfirmationMnemonicSignatory({
            address: "",
            confirmKey: "this is a top secret passphrase 2",
            privateKey: "",
            publicKey: "",
            signingKey: "this is a top secret passphrase 1",
        }),
    );

    assert.is(subject.actsWithConfirmationMnemonic()), "boolean");
});

test("#actsWithWIF", () => {
    const subject = new Signatory(
        new WIFSignatory({
            address: "",
            privateKey: "",
            publicKey: "",
            signingKey: "this is a top secret passphrase 1",
        }),
    );

    assert.is(subject.actsWithWIF()), "boolean");
});

test("#actsWithConfirmationWIF", () => {
    const subject = new Signatory(
        new ConfirmationWIFSignatory({
            address: "",
            confirmKey: "this is a top secret passphrase 2",
            privateKey: "",
            publicKey: "",
            signingKey: "this is a top secret passphrase 1",
        }),
    );

    assert.is(subject.actsWithConfirmationWIF()), "boolean");
});

test("#actsWithPrivateKey", () => {
    const subject = new Signatory(
        new PrivateKeySignatory({
            address: "",
            signingKey: "this is a top secret passphrase 1",
        }),
    );

    assert.is(subject.actsWithPrivateKey()), "boolean");
});

test("#actsWithMultiSignature", () => {
    const subject = new Signatory(new LedgerSignatory({ signingKey: "path" }));

    assert.is(subject.actsWithMultiSignature()), "boolean");
});

test("#actsWithLedger", () => {
    const subject = new Signatory(new LedgerSignatory({ signingKey: "path" }));

    assert.is(subject.actsWithLedger()), "boolean");
});

test("#actsWithSecret", () => {
    const subject = new Signatory(
        new SecretSignatory({
            address: "",
            privateKey: "",
            publicKey: "",
            signingKey: "this is a top secret passphrase 1",
        }),
    );

    assert.is(subject.actsWithSecret()), "boolean");
});

test("#actsWithConfirmationSecret", () => {
    const subject = new Signatory(
        new ConfirmationSecretSignatory({
            address: "",
            confirmKey: "this is a top secret passphrase 2",
            privateKey: "",
            publicKey: "",
            signingKey: "this is a top secret passphrase 1",
        }),
    );

    assert.is(subject.actsWithConfirmationSecret()), "boolean");
});
