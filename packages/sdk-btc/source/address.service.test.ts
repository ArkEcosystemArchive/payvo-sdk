import "jest-extended";

import { IoC } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { BindingType } from "./constants";
import { AddressService } from "./address.service";
import { AddressFactory } from "./address.factory";

let subject: AddressService;

beforeEach(async () => {
	subject = createService(AddressService, undefined, async (container: IoC.Container) => {
		container.singleton(BindingType.AddressFactory, AddressFactory);
	});
});

// These tests are based on the values from https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/test/integration/addresses.spec.ts
describe("Address", () => {
	describe("#fromMnemonic", () => {
		it("should generate an output from a mnemonic (BIP44)", async () => {
			const result = await subject.fromMnemonic(identity.mnemonic, { bip44: { account: 0 } });

			expect(result.type).toBe("bip44");
			expect(result.address).toBe("1PLDRLacEkAaaiWnfojVDb5hWpwXvKJrRa");
			expect(result.path).toBe("m/44'/0'/0'/0/0");
		});

		it("should generate an output from a mnemonic (BIP49)", async () => {
			const result = await subject.fromMnemonic(identity.mnemonic, { bip49: { account: 0 } });

			expect(result.type).toBe("bip49");
			expect(result.address).toBe("3GU5e9mPrLgPemhawVHHrDt6bjZZ6M9CPc");
			expect(result.path).toBe("m/49'/0'/0'/0/0");
		});

		it("should generate an output from a mnemonic (BIP84)", async () => {
			const result = await subject.fromMnemonic(identity.mnemonic, { bip84: { account: 0 } });

			expect(result.type).toBe("bip84");
			expect(result.address).toBe("bc1qpeeu3vjrm9dn2y42sl926374y5cvdhfn5k7kxm");
			expect(result.path).toBe("m/84'/0'/0'/0/0");
		});
	});

	describe("#fromPublicKey", () => {
		it('can import an address via WIF', async () => {
			const result = await subject.fromPublicKey("0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", { bip44: { account: 0 } });

			expect(result.type).toBe("bip44");
			expect(result.address).toBe("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH");
		});

		it('can generate a SegWit address (via P2SH)', async () => {
			const result = await subject.fromPublicKey("0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", { bip49: { account: 0 } });

			expect(result.type).toBe("bip49");
			expect(result.address).toBe("3JvL6Ymt8MVWiCNHC7oWU6nLeHNJKLZGLN");
		});

		it('can generate a SegWit address', async () => {
			const result = await subject.fromPublicKey("0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", { bip84: { account: 0 } });

			expect(result.type).toBe("bip84");
			expect(result.address).toBe("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4");
		});
	});

	describe("#fromPrivateKey", () => {
		it('can import an address via WIF', async () => {
			const result = await subject.fromPrivateKey("0000000000000000000000000000000000000000000000000000000000000001", { bip44: { account: 0 } });

			expect(result.type).toBe("bip44");
			expect(result.address).toBe("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH");
		});

		it('can generate a SegWit address (via P2SH)', async () => {
			const result = await subject.fromPrivateKey("0000000000000000000000000000000000000000000000000000000000000001", { bip49: { account: 0 } });

			expect(result.type).toBe("bip49");
			expect(result.address).toBe("3JvL6Ymt8MVWiCNHC7oWU6nLeHNJKLZGLN");
		});

		it('can generate a SegWit address', async () => {
			const result = await subject.fromPrivateKey("0000000000000000000000000000000000000000000000000000000000000001", { bip84: { account: 0 } });

			expect(result.type).toBe("bip84");
			expect(result.address).toBe("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4");
		});
	});

	describe('#fromMultiSignature', () => {
		it('can generate a P2SH, pay-to-multisig (2-of-3) address', async () => {
			const result = await subject.fromMultiSignature(2, [
				"026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01",
				"02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9",
				"03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9",
			], { bip44: { account: 0 } });

			expect(result.type).toBe("bip44");
			expect(result.address).toBe("36NUkt6FWUi3LAWBqWRdDmdTWbt91Yvfu7");
		});

		it('can generate a P2SH(P2WSH(...)), pay-to-multisig (2-of-2) address', async () => {
			const result = await subject.fromMultiSignature(2, [
				'026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
				'02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
			], { bip49: { account: 0 } });

			expect(result.type).toBe("bip49");
			expect(result.address).toBe("3P4mrxQfmExfhxqjLnR2Ah4WES5EB1KBrN");
		});

		it('can generate a P2WSH (SegWit), pay-to-multisig (3-of-4) address', async () => {
			const result = await subject.fromMultiSignature(3, [
				'026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
				'02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
				'023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
				'03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
			], { bip84: { account: 0 } });

			expect(result.type).toBe("bip84");
			expect(result.address).toBe("bc1q75f6dv4q8ug7zhujrsp5t0hzf33lllnr3fe7e2pra3v24mzl8rrqtp3qul");
		});
	});

	describe("#fromWIF", () => {
		it('can import an address via WIF', async () => {
			const result = await subject.fromWIF("KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn", { bip44: { account: 0 } });

			expect(result.type).toBe("bip44");
			expect(result.address).toBe("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH");
		});

		it('can generate a SegWit address (via P2SH)', async () => {
			const result = await subject.fromWIF("KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn", { bip49: { account: 0 } });

			expect(result.type).toBe("bip49");
			expect(result.address).toBe("3JvL6Ymt8MVWiCNHC7oWU6nLeHNJKLZGLN");
		});

		it('can generate a SegWit address', async () => {
			const result = await subject.fromWIF("KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn", { bip84: { account: 0 } });

			expect(result.type).toBe("bip84");
			expect(result.address).toBe("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4");
		});
	});
});
