/* eslint-disable import/no-namespace */

import { HARDENED_OFFSET, HDKey, Versions } from "micro-bip32";

import { BIP39 } from "./bip39.js";
import { WIF } from "./wif.js";

interface Network {
	bip32: Versions;
	wif: number;
}

// @TODO: rename this. keeping it as BIP32Interface makes migration easier
class BIP32Interface {
	#hdkey: HDKey;
	#network?: Network;

	private constructor(hdkey: HDKey, network?: Network) {
		this.#hdkey = hdkey;
		this.#network = network;
	}

	public static fromMasterSeed(seed: Uint8Array, network?: Network): BIP32Interface {
		return new BIP32Interface(HDKey.fromMasterSeed(seed, network?.bip32), network);
	}

	public static fromExtendedKey(base58key: string, network?: Network): BIP32Interface {
		return new BIP32Interface(HDKey.fromExtendedKey(base58key, network?.bip32), network);
	}

	public derive(path: string | number): BIP32Interface {
		if (typeof path === "string") {
			this.#hdkey = this.#hdkey.derive(path);
		} else {
			this.#hdkey = this.#hdkey.deriveChild(path);
		}

		return this;
	}

	public derivePath(path: string): BIP32Interface {
		this.#hdkey = this.#hdkey.derive(path);

		return this;
	}

	public deriveChild(index: number): BIP32Interface {
		this.#hdkey = this.#hdkey.deriveChild(index);

		return this;
	}

	public deriveHardened(index: number): BIP32Interface {
		this.#hdkey = this.#hdkey.deriveChild(HARDENED_OFFSET + index);

		return this;
	}

	public neutered(): BIP32Interface {
		this.#hdkey = this.#hdkey.wipePrivateData();

		return this;
	}

	public get publicKey(): Buffer {
		return Buffer.from(this.#hdkey.publicKey!);
	}

	public get privateKey(): Buffer {
		return Buffer.from(this.#hdkey.privateKey!);
	}

	public get identifier(): Uint8Array {
		return this.#hdkey.identifier!;
	}

	public get fingerprint(): number {
		return this.#hdkey.fingerprint;
	}

	public get depth(): number {
		return this.#hdkey.depth;
	}

	public toBase58() {
		return this.#hdkey.privateExtendedKey;
	}

	public toWIF() {
		return WIF.encode({
			compressed: true,
			privateKey: this.privateKey.toString("hex"),
			version: this.#network?.wif!,
		});
	}
}

class BIP32 {
	public static fromMnemonic(mnemonic: string, network?: Network): BIP32Interface {
		mnemonic = BIP39.normalize(mnemonic);

		BIP39.validate(mnemonic);

		return BIP32Interface.fromMasterSeed(Buffer.from(BIP39.toSeed(mnemonic)), network);
	}

	public static fromSeed(seed: string, network?: Network): BIP32Interface {
		return BIP32Interface.fromMasterSeed(Buffer.from(seed, "hex"), network);
	}

	public static fromBase58(value: string, network?: Network): BIP32Interface {
		return BIP32Interface.fromExtendedKey(value, network);
	}
}

export { BIP32, BIP32Interface };
