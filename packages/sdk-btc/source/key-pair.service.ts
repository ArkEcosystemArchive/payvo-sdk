import { Exceptions, IoC, Services } from "@payvo/sdk";
import { BIP32 } from "@payvo/cryptography";
import * as bitcoin from "bitcoinjs-lib";

@IoC.injectable()
export class KeyPairService extends Services.AbstractKeyPairService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.KeyPairDataTransferObject> {
		return this.#normalize(
			bitcoin.ECPair.fromPrivateKey(
				BIP32.fromMnemonic(mnemonic, this.configRepository.get("network.constants")).privateKey!,
			),
		);
	}

	public override async fromPrivateKey(privateKey: string): Promise<Services.KeyPairDataTransferObject> {
		return this.#normalize(bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey, "hex")));
	}

	public override async fromWIF(wif: string): Promise<Services.KeyPairDataTransferObject> {
		return this.#normalize(bitcoin.ECPair.fromWIF(wif));
	}

	#normalize(keyPair: bitcoin.ECPair.ECPairInterface): Services.KeyPairDataTransferObject {
		return {
			publicKey: keyPair.publicKey.toString("hex"),
			privateKey: keyPair.privateKey!.toString("hex"),
		};
	}
}
