import { Coins, IoC, Services } from "@payvo/sdk";
import { BIP44, Hash } from "@payvo/sdk-cryptography";
import baseX from "base-x";
import { deriveAddress, deriveKeypair } from "ripple-keypairs";

export class AddressService extends Services.AbstractAddressService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		// @TODO: return path
		return this.fromPublicKey(
			BIP44.deriveChild(mnemonic, {
				coinType: this.configRepository.get(Coins.ConfigKey.Slip44),
				index: options?.bip44?.addressIndex,
			}).publicKey.toString("hex"),
		);
	}

	public override async fromPublicKey(
		publicKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return { type: "rfc6979", address: deriveAddress(publicKey) };
	}

	public override async fromSecret(secret: string): Promise<Services.AddressDataTransferObject> {
		return { type: "rfc6979", address: deriveAddress(deriveKeypair(secret).publicKey) };
	}

	public override async validate(address: string): Promise<boolean> {
		const ALLOWED_CHARS = "rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz";
		const regexp = new RegExp("^r[" + ALLOWED_CHARS + "]{27,35}$");

		if (regexp.test(address)) {
			const bytes: Buffer = baseX(ALLOWED_CHARS).decode(address);
			const checksumComputed: string = this.#sha256Checksum(bytes.slice(0, -4).toString("hex"));
			const checksumExpected: string = bytes.slice(-4).toString("hex");

			return checksumComputed === checksumExpected;
		}

		return false;
	}

	#sha256Checksum(payload) {
		return Hash.sha256(Hash.sha256(Buffer.from(payload, "hex")))
			.toString("hex")
			.substr(0, 8);
	}
}
