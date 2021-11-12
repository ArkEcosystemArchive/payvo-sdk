import { IoC, Services } from "@payvo/sdk";
import { BIP32 } from "@payvo/sdk-cryptography";
import { ECPair, ECPairInterface } from "ecpair";

@IoC.injectable()
export class KeyPairService extends Services.AbstractKeyPairService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.KeyPairDataTransferObject> {
		return this.#normalize(
			ECPair.fromPrivateKey(
				BIP32.fromMnemonic(mnemonic, this.configRepository.get("network.constants")).privateKey!,
			),
		);
	}

	public override async fromPrivateKey(privateKey: string): Promise<Services.KeyPairDataTransferObject> {
		return this.#normalize(ECPair.fromPrivateKey(Buffer.from(privateKey, "hex")));
	}

	public override async fromWIF(wif: string): Promise<Services.KeyPairDataTransferObject> {
		return this.#normalize(ECPair.fromWIF(wif));
	}

	#normalize(keyPair: ECPairInterface): Services.KeyPairDataTransferObject {
		return {
			publicKey: keyPair.publicKey.toString("hex"),
			privateKey: keyPair.privateKey!.toString("hex"),
		};
	}
}
