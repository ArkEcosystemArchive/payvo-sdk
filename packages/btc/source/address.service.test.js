import { IoC } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { BindingType } from "./constants";
import { AddressService } from "./address.service";
import { AddressFactory } from "./address.factory";

let subject;

test.before.each(async () => {
    subject = await createService(AddressService, undefined, async (container) => {
        container.singleton(BindingType.AddressFactory, AddressFactory);
    });
});

// These tests are based on the values from https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/test/integration/addresses.spec.ts
describe("Address", () => {
    describe("#fromMnemonic", () => {
        test("should generate an output from a mnemonic (BIP44)", async () => {
            const result = await subject.fromMnemonic(identity.mnemonic, { bip44: { account: 0 } });

            assert.is(result.type, "bip44");
            assert.is(result.address, "1PLDRLacEkAaaiWnfojVDb5hWpwXvKJrRa");
            assert.is(result.path, "m/44'/0'/0'/0/0");
        });

        test("should generate an output from a mnemonic (BIP49)", async () => {
            const result = await subject.fromMnemonic(identity.mnemonic, { bip49: { account: 0 } });

            assert.is(result.type, "bip49");
            assert.is(result.address, "3GU5e9mPrLgPemhawVHHrDt6bjZZ6M9CPc");
            assert.is(result.path, "m/49'/0'/0'/0/0");
        });

        test("should generate an output from a mnemonic (BIP84)", async () => {
            const result = await subject.fromMnemonic(identity.mnemonic, { bip84: { account: 0 } });

            assert.is(result.type, "bip84");
            assert.is(result.address, "bc1qpeeu3vjrm9dn2y42sl926374y5cvdhfn5k7kxm");
            assert.is(result.path, "m/84'/0'/0'/0/0");
        });
    });

    describe("#fromPublicKey", () => {
        test("should import an address (via P2PKH)", async () => {
            const result = await subject.fromPublicKey(
                "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
                { bip44: { account: 0 } },
            );

            assert.is(result.type, "bip44");
            assert.is(result.address, "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH");
        });

        test("should fail to generate address if ext pub key is not depth 3", async () => {
            await assert.is(
                subject.fromPublicKey(
                    "xpub6ENuDU6ouVBjsS46mpqzNzaJXs5iuNnhgKb9LWCgCwtK74fnATHwVJvsYYbH7bFUzZSh9PGA4Q9G5465WxHHRNys1hejSwbDZaw9ro5vDtD",
                ),
            ).rejects.toThrow();
        });

        test("should generate a SegWit address (via P2SH)", async () => {
            const result = await subject.fromPublicKey(
                "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
                { bip49: { account: 0 } },
            );

            assert.is(result.type, "bip49");
            assert.is(result.address, "3JvL6Ymt8MVWiCNHC7oWU6nLeHNJKLZGLN");
        });

        test("should generate a native SegWit address (via P2WPKH)", async () => {
            const result = await subject.fromPublicKey(
                "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
                { bip84: { account: 0 } },
            );

            assert.is(result.type, "bip84");
            assert.is(result.address, "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4");
        });

        test("should generate an address from an extended public key for livenet", async () => {
            const result = await subject.fromPublicKey(
                "xpub6Bk8X5Y1FN7pSecqoqkHe8F8gNaqMVApCrmMxZnRvSw4JpgqeM5T83Ze6uD4XEMiCSwZiwysnny8uQj5F6XAPF9FNKYNHTMoAu97bDXNtRe",
                { bip44: { account: 0 } },
            );

            assert.is(result.type, "bip44");
            assert.is(result.address, "12KRAVpawWmzWNnv9WbqqKRHuhs7nFiQro");
        });

        test("should generate a Native SegWit address from an extended public key for tesnet", async () => {
            subject = await createService(AddressService, "btc.testnet", async (container) => {
                container.singleton(BindingType.AddressFactory, AddressFactory);
            });
            const result = await subject.fromPublicKey(
                "tpubDDVP3DS6MLMUwxsGKzPLjcwY38BmKpZT3USFmjWycwi441G3Mi6j7FhiHLpv2TzQLaAQ1iAun9Q1inpWB37pWEWPc5sZZNfLKoeRtR1ZANL",
                { bip84: { account: 0 } },
            );

            assert.is(result.type, "bip84");
            assert.is(result.address, "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn");
        });

        test("should generate a Native SegWit address from an extended public key for livenet", async () => {
            const result = await subject.fromPublicKey(
                "xpub6Bk8X5Y1FN7pSecqoqkHe8F8gNaqMVApCrmMxZnRvSw4JpgqeM5T83Ze6uD4XEMiCSwZiwysnny8uQj5F6XAPF9FNKYNHTMoAu97bDXNtRe",
                { bip84: { account: 0 } },
            );

            assert.is(result.type, "bip84");
            assert.is(result.address, "bc1qpeeu3vjrm9dn2y42sl926374y5cvdhfn5k7kxm");
        });

        test("should generate a Native SegWit address from an extended public key for testnet", async () => {
            subject = await createService(AddressService, "btc.testnet", async (container) => {
                container.singleton(BindingType.AddressFactory, AddressFactory);
            });

            const result = await subject.fromPublicKey(
                "tpubDC9zgMaiUXPoSRkpk8gvDuzwHobq6GUw5D1nzWdeBWrEXYZUxaQGDLwtXvVFsmvdNUVernGA2JWFbJsj4se5Vemx8WK6w9bzmxj4K36ivox",
                { bip84: { account: 0 } },
            );

            assert.is(result.type, "bip84");
            assert.is(result.address, "tb1qdyxry6tza2sflfzlr8w6m65873thva724yjlmw");
        });
    });

    describe("#fromPrivateKey", () => {
        test("should import an address via WIF", async () => {
            const result = await subject.fromPrivateKey(
                "0000000000000000000000000000000000000000000000000000000000000001",
                { bip44: { account: 0 } },
            );

            assert.is(result.type, "bip44");
            assert.is(result.address, "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH");
        });

        test("should generate a SegWit address (via P2SH)", async () => {
            const result = await subject.fromPrivateKey(
                "0000000000000000000000000000000000000000000000000000000000000001",
                { bip49: { account: 0 } },
            );

            assert.is(result.type, "bip49");
            assert.is(result.address, "3JvL6Ymt8MVWiCNHC7oWU6nLeHNJKLZGLN");
        });

        test("should generate a SegWit address", async () => {
            const result = await subject.fromPrivateKey(
                "0000000000000000000000000000000000000000000000000000000000000001",
                { bip84: { account: 0 } },
            );

            assert.is(result.type, "bip84");
            assert.is(result.address, "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4");
        });
    });

    describe("#fromMultiSignature", () => {
        test("should generate a P2SH, pay-to-multisig (2-of-3) address", async () => {
            const result = await subject.fromMultiSignature(
                {
                    min: 2,
                    publicKeys: [
                        "026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01",
                        "02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9",
                        "03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9",
                    ],
                },

                { bip44: { account: 0 } },
            );

            assert.is(result.type, "bip44");
            assert.is(result.address, "36NUkt6FWUi3LAWBqWRdDmdTWbt91Yvfu7");
        });

        test("should generate a P2SH(P2WSH(...)), pay-to-multisig (2-of-2) address", async () => {
            const result = await subject.fromMultiSignature(
                {
                    min: 2,
                    publicKeys: [
                        "026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01",
                        "02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9",
                    ],
                },
                { bip49: { account: 0 } },
            );

            assert.is(result.type, "bip49");
            assert.is(result.address, "3P4mrxQfmExfhxqjLnR2Ah4WES5EB1KBrN");
        });

        test("should generate a P2WSH (SegWit), pay-to-multisig (3-of-4) address", async () => {
            const result = await subject.fromMultiSignature(
                {
                    min: 3,
                    publicKeys: [
                        "026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01",
                        "02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9",
                        "023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59",
                        "03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9",
                    ],
                },
                { bip84: { account: 0 } },
            );

            assert.is(result.type, "bip84");
            assert.is(result.address, "bc1q75f6dv4q8ug7zhujrsp5t0hzf33lllnr3fe7e2pra3v24mzl8rrqtp3qul");
        });
    });

    describe("#fromWIF", () => {
        test("should import an address via WIF", async () => {
            const result = await subject.fromWIF("KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn", {
                bip44: { account: 0 },
            });

            assert.is(result.type, "bip44");
            assert.is(result.address, "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH");
        });

        test("should generate a SegWit address (via P2SH)", async () => {
            const result = await subject.fromWIF("KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn", {
                bip49: { account: 0 },
            });

            assert.is(result.type, "bip49");
            assert.is(result.address, "3JvL6Ymt8MVWiCNHC7oWU6nLeHNJKLZGLN");
        });

        test("should generate a SegWit address", async () => {
            const result = await subject.fromWIF("KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn", {
                bip84: { account: 0 },
            });

            assert.is(result.type, "bip84");
            assert.is(result.address, "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4");
        });
    });

    test("should validate an address", async () => {
        assert.true(await subject.validate(identity.address)));
    await assert.is(subject.validate(identity.addressBIP44)).resolves, true);
await assert.is(subject.validate(identity.addressBIP49)).resolves, true);
await assert.is(subject.validate(identity.addressBIP84)).resolves, true);
await assert.is(subject.validate("AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX")).resolves, false);
await assert.is(subject.validate("ABC")).resolves, false);
await assert.is(subject.validate("")).resolves, false);
await assert.is(subject.validate(undefined!)).resolves, false);
await assert.is(subject.validate(null!)).resolves, false);
await assert.is(subject.validate({} as unknown as string)).resolves, false);
    });
});
