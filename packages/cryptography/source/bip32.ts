/* eslint-disable import/no-namespace */

import { BIP32Interface, fromBase58, fromPrivateKey, fromPublicKey, fromSeed } from "./bip32/crypto.js";
import { BIP39 } from "./bip39.js";

interface Network {
	bip32: {
		private: number;
		public: number;
	};
	wif: number;
}

class BIP32 {
	public static fromMnemonic(mnemonic: string, network?: Network): BIP32Interface {
		mnemonic = BIP39.normalize(mnemonic);

		BIP39.validate(mnemonic);

		return fromSeed(Buffer.from(BIP39.toSeed(mnemonic)), network);
	}

	public static fromSeed(seed: string, network?: Network): BIP32Interface {
		return fromSeed(Buffer.from(seed, "hex"), network);
	}

	public static fromBase58(value: string, network?: Network): BIP32Interface {
		return fromBase58(value, network);
	}

	public static fromPublicKey(publicKey: string, chainCode: string, network?: Network): BIP32Interface {
		return fromPublicKey(Buffer.from(publicKey, "hex"), Buffer.from(chainCode, "hex"), network);
	}

	public static fromPrivateKey(privateKey: string, chainCode: string, network?: Network): BIP32Interface {
		return fromPrivateKey(Buffer.from(privateKey, "hex"), Buffer.from(chainCode, "hex"), network);
	}
}

export { BIP32, BIP32Interface };
