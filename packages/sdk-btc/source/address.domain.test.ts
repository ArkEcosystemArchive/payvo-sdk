import "jest-extended";
import * as bitcoin from "bitcoinjs-lib";
import { BIP32 } from "@payvo/cryptography";
import {
	createLegacyMusigAddress,
	createNativeSegwitMusigAddress,
	createP2SHSegwitMusigAddress,
	defaultLegacyMusigAccountKey,
	defaultNativeSegwitMusigAccountKey,
	defaultP2SHSegwitMusigAccountKey,
	rootToAccountKeys,
} from "./address.domain";

const network = bitcoin.networks.testnet;

// const mnemonic1 = "tell rubber raise grow immune cabbage proof bus distance ship kidney great";
// const mnemonic2 = "digital bright lava credit olive buzz awful crunch note salute deer gossip";
// const mnemonic3 = "copy pulse nation multiply body long theme breeze profit juice wife hole";
const mnemonic1 = "hard produce blood mosquito provide feed open enough access motor chimney swamp";
const mnemonic2 = "build tuition fuel distance often swallow birth embark nest barely drink beach";
const mnemonic3 = "mandate pull cat east limit enemy cabin possible success force mountain hood";

const key1 = BIP32.fromMnemonic(mnemonic1, network);
// Master pub key Vpub5mtyU6Hx9xrx63Y3W4aGW1LuQkmwrq9xsQNgX7tDAM8DTHhE7vXMZ7Hue2FR8SMAGDW57fy76HFmN1jnckSmeX2cDMWVA1KViot6bLgJZuN

const key2 = BIP32.fromMnemonic(mnemonic2, network);
// Master pub key Vpub5mYgzMb93fDtChZ2xmY7g3aEgHFjdgQE6P596AiL5zENEcVjDCciGfWmhZJngn6gVmBRh6E1Vp7aZYY7wQkMRTQSKhauGwYAUEdiGbS35D1

const key3 = BIP32.fromMnemonic(mnemonic3, network);
// Master pub key Vpub5mSSLBPFi3acdjk5giwrmA7gXPAJsiLXXKibgjXYycH1gp95t2Pqv3U8dT9kEGxvAdfiN5DGmozDmZ7sJyDuMgfxt4h4KujF7MWt5tQH8py

describe("multi signature", () => {
	it("should create a legacy multisig wallet like Electrum", async () => {
		const accountKeys = rootToAccountKeys([key1, key2, key3], defaultLegacyMusigAccountKey);

		expect(
			createLegacyMusigAddress(
				2,
				accountKeys.map((pk) => pk.derive(0).derive(0).publicKey),
				network,
			).address,
		).toBe("2Mzq2GgWGQShdNr7H2hCxvC6pGrqzb64R3k");
		expect(
			createLegacyMusigAddress(
				2,
				accountKeys.map((pk) => pk.derive(0).derive(1).publicKey),
				network,
			).address,
		).toBe("2NAga16irQ8iaMEU3db3k7ZTmg7eaGSpzvy");
		expect(
			createLegacyMusigAddress(
				2,
				accountKeys.map((pk) => pk.derive(0).derive(2).publicKey),
				network,
			).address,
		).toBe("2MzLoh1jz3QJ8DARk99NuQvy2Mfg954J4HE");

		expect(
			createLegacyMusigAddress(
				2,
				accountKeys.map((pk) => pk.derive(1).derive(0).publicKey),
				network,
			).address,
		).toBe("2N5ETorn5JyFdWYYnAb9PVC3Hz1bgMjWQPU");
		expect(
			createLegacyMusigAddress(
				2,
				accountKeys.map((pk) => pk.derive(1).derive(1).publicKey),
				network,
			).address,
		).toBe("2N5WAJtL3hhc9TwNJp6JjSNeUhg16o4D9T3");
		expect(
			createLegacyMusigAddress(
				2,
				accountKeys.map((pk) => pk.derive(1).derive(2).publicKey),
				network,
			).address,
		).toBe("2MufXVhLZfhQSBgVaghCMdHvPZjWxCZBnSx");
	});

	it("should create a p2sh-segwit (p2wsh-p2sh) multisig wallet like Electrum", async () => {
		const accountKeys = rootToAccountKeys([key1, key2, key3], defaultP2SHSegwitMusigAccountKey);

		expect(
			createP2SHSegwitMusigAddress(
				2,
				accountKeys.map((pk) => pk.derive(0).derive(0).publicKey),
				network,
			).address,
		).toBe("2Mv8e5hWoFh9X8YdU4e4qCAv7m4wBCz2ytT");
		expect(
			createP2SHSegwitMusigAddress(
				2,
				accountKeys.map((pk) => pk.derive(0).derive(1).publicKey),
				network,
			).address,
		).toBe("2MtQ9HwWz8wvax9YNLo3S35tcGWZMYTWW1B");
		expect(
			createP2SHSegwitMusigAddress(
				2,
				accountKeys.map((pk) => pk.derive(0).derive(2).publicKey),
				network,
			).address,
		).toBe("2N9kwKrsHVgnTuTiTSqVoXoxk4nUGKSscey");
		expect(
			createP2SHSegwitMusigAddress(
				2,
				accountKeys.map((pk) => pk.derive(1).derive(0).publicKey),
				network,
			).address,
		).toBe("2N3WVdraaxhMKizN2EQ4p6QaZupBXs6dnBp");
		expect(
			createP2SHSegwitMusigAddress(
				2,
				accountKeys.map((pk) => pk.derive(1).derive(1).publicKey),
				network,
			).address,
		).toBe("2N9iWAxKvU7PF4nKqFX1j57f1rxFXoaVW8Q");
		expect(
			createP2SHSegwitMusigAddress(
				2,
				accountKeys.map((pk) => pk.derive(1).derive(2).publicKey),
				network,
			).address,
		).toBe("2N1WTeWAJmMmsRL4VFnTEtL6jphUEPTJSvB");
	});

	it("should create a native segwit (p2wsh) multisig wallet like Electrum", async () => {
		const accountKeys = rootToAccountKeys([key1, key2, key3], defaultNativeSegwitMusigAccountKey);

		expect(
			createNativeSegwitMusigAddress(
				2,
				accountKeys.map((pk) => pk.derive(0).derive(0).publicKey),
				network,
			).address,
		).toBe("tb1qzdtkhgwyqnufeuc3tq88d74plcagcryzmfwclyadxgj90kwvhpps0gu965");
		expect(
			createNativeSegwitMusigAddress(
				2,
				accountKeys.map((pk) => pk.derive(0).derive(1).publicKey),
				network,
			).address,
		).toBe("tb1qq57mp9ygm7d6ps9mzgelzwj806dfszw4paqzmuds8n24q9eacspq4t20kv");
		expect(
			createNativeSegwitMusigAddress(
				2,
				accountKeys.map((pk) => pk.derive(0).derive(2).publicKey),
				network,
			).address,
		).toBe("tb1qu74mke55g3645qz2phgvej24k4qpmq33mkywyn5yyqknh7lcag5qapfmxv");

		expect(
			createNativeSegwitMusigAddress(
				2,
				accountKeys.map((pk) => pk.derive(1).derive(0).publicKey),
				network,
			).address,
		).toBe("tb1qsyz35zpeueuwmcjap75flg93mny2gn7v3urnnwe4k05rcnvnp4cqq7hew2");
		expect(
			createNativeSegwitMusigAddress(
				2,
				accountKeys.map((pk) => pk.derive(1).derive(1).publicKey),
				network,
			).address,
		).toBe("tb1q9dpf5gjwgwmdftn22tfmq4cmw3qt825nf3xgd4wkdg3ktw6z2shsa5wauj");
		expect(
			createNativeSegwitMusigAddress(
				2,
				accountKeys.map((pk) => pk.derive(1).derive(2).publicKey),
				network,
			).address,
		).toBe("tb1qlj3qkv9c5j5gfqgfnqjl0nkwuvw8ktq9u3ahg0du4jnde852nrcstf4cka");
	});
});
