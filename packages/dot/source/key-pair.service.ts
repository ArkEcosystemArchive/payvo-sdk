import { IoC, Services } from "@payvo/sdk";
import { u8aToHex } from "@polkadot/util";
import { mnemonicToMiniSecret, naclBoxPairFromSecret } from "@polkadot/util-crypto";

export class KeyPairService extends Services.AbstractKeyPairService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.KeyPairDataTransferObject> {
		const { publicKey, secretKey } = naclBoxPairFromSecret(mnemonicToMiniSecret(mnemonic));

		return { publicKey: u8aToHex(publicKey), privateKey: u8aToHex(secretKey) };
	}
}
