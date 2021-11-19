import { assert, describe, test } from "@payvo/sdk-test";
import { ConfirmationMnemonicSignatory } from "./confirmation-mnemonic.signatory";
import { ConfirmationSecretSignatory } from "./confirmation-secret.signatory";
import { ConfirmationWIFSignatory } from "./confirmation-wif.signatory";
import { LedgerSignatory } from "./ledger.signatory";
import { MnemonicSignatory } from "./mnemonic.signatory";
import { MultiSignatureSignatory } from "./multi-signature.signatory";
import { PrivateKeySignatory } from "./private-key.signatory";
import { SecretSignatory } from "./secret.signatory";
import { Signatory } from "./signatory";
import { WIFSignatory } from "./wif.signatory";

describe("MnemonicSignatory", (test) => {
    test("#signingKey", () => {
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

    test("#confirmKey", () => {
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

    test("#address", () => {
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

    test("#publicKey", () => {
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

    test("#privateKey", () => {
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

        assert.object(subject.multiSignature());
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

        assert.equal(subject.options(),
		 {
		  "bip44":  {
		    "account": 0,
		  },
		});
    });
});

describe("ConfirmationMnemonicSignatory", (test) => {
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

        assert.is(subject.signingKey(), "signingKey");
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

        assert.is(subject.confirmKey(), "confirmKey");
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

        assert.is(subject.address(), "address");
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

        assert.is(subject.publicKey(), "publicKey");
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

        assert.is(subject.privateKey(), "privateKey");
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

        assert.object(subject.multiSignature());
    });
});

describe("WIFSignatory", (test) => {
    test("#signingKey", () => {
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

    test("#confirmKey", () => {
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

    test("#address", () => {
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

    test("#publicKey", () => {
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

    test("#privateKey", () => {
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

        assert.object(subject.multiSignature());
    });
});

describe("ConfirmationWIFSignatory", (test) => {
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

        assert.is(subject.signingKey(), "signingKey");
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

        assert.is(subject.confirmKey(), "confirmKey");
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

        assert.is(subject.address(), "address");
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

        assert.is(subject.publicKey(), "publicKey");
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

        assert.is(subject.privateKey(), "privateKey");
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

        assert.object(subject.multiSignature());
    });
});

describe("PrivateKeySignatory", (test) => {
    test("#signingKey", () => {
        const subject = new Signatory(
            new PrivateKeySignatory({
                address: "address",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.signingKey(), "signingKey");
    });

    test("#confirmKey", () => {
        const subject = new Signatory(
            new PrivateKeySignatory({
                address: "address",
                signingKey: "signingKey",
            }),
        );

        assert.throws(() => subject.confirmKey(), "cannot be called");
    });

    test("#address", () => {
        const subject = new Signatory(
            new PrivateKeySignatory({
                address: "address",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.address(), "address");
    });

    test("#publicKey", () => {
        const subject = new Signatory(
            new PrivateKeySignatory({
                address: "address",
                signingKey: "signingKey",
            }),
        );

        assert.throws(() => subject.publicKey(), "cannot be called");
    });

    test("#privateKey", () => {
        const subject = new Signatory(
            new PrivateKeySignatory({
                address: "address",
                signingKey: "signingKey",
            }),
        );

        assert.is(subject.privateKey(), "signingKey");
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

        assert.object(subject.multiSignature());
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

        assert.equal(subject.options(),
		 {
		  "bip44":  {
		    "account": 0,
		  },
		});
    });
});

describe("MultiSignatureSignatory", (test) => {
    test("#signingKey", () => {
        const subject = new Signatory(
            new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
        );

        assert.throws(() => subject.signingKey(), "cannot be called");
    });

    test("#asset", () => {
        const subject = new Signatory(
            new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
        );

        assert.object(subject.asset());
    });

    test("#confirmKey", () => {
        const subject = new Signatory(
            new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
        );

        assert.throws(() => subject.confirmKey(), "cannot be called");
    });

    test("#address", () => {
        const subject = new Signatory(
            new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
        );

        assert.is(subject.address(), "identifier");
    });

    test("#publicKey", () => {
        const subject = new Signatory(
            new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
        );

        assert.throws(() => subject.publicKey(), "cannot be called");
    });

    test("#privateKey", () => {
        const subject = new Signatory(
            new MultiSignatureSignatory({ min: 5, publicKeys: ["identifier"] }, "identifier"),
        );

        assert.throws(() => subject.privateKey(), "cannot be called");
    });
});

describe("ConfirmationSecretSignatory", (test) => {
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

        assert.is(subject.signingKey(), "signingKey");
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

        assert.is(subject.confirmKey(), "confirmKey");
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

        assert.is(subject.address(), "address");
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

        assert.is(subject.publicKey(), "publicKey");
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

        assert.is(subject.privateKey(), "privateKey");
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

        assert.object(subject.multiSignature());
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

test("#actsWithMnemonic", () => {
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

    assert.boolean(subject.actsWithConfirmationMnemonic());
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

    assert.boolean(subject.actsWithWIF());
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

    assert.boolean(subject.actsWithConfirmationWIF());
});

test("#actsWithPrivateKey", () => {
    const subject = new Signatory(
        new PrivateKeySignatory({
            address: "",
            signingKey: "this is a top secret passphrase 1",
        }),
    );

    assert.boolean(subject.actsWithPrivateKey());
});

test("#actsWithMultiSignature", () => {
    const subject = new Signatory(new LedgerSignatory({ signingKey: "path" }));

    assert.boolean(subject.actsWithMultiSignature());
});

test("#actsWithLedger", () => {
    const subject = new Signatory(new LedgerSignatory({ signingKey: "path" }));

    assert.boolean(subject.actsWithLedger());
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

    assert.boolean(subject.actsWithSecret());
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

    assert.boolean(subject.actsWithConfirmationSecret());
});

test.run();
