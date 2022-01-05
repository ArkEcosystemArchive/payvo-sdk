import { Coins, Services } from "@payvo/sdk";
import { Base58, BIP44, Hash } from "@payvo/sdk-cryptography";
import TronWeb from "tronweb";

export class AddressService extends Services.AbstractAddressService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		const { child, path } = BIP44.deriveChildWithPath(mnemonic, {
			coinType: this.configRepository.get(Coins.ConfigKey.Slip44),
			index: options?.bip44?.addressIndex,
		});

		return {
			address: TronWeb.address.fromPrivateKey(child.privateKey!.toString("hex")),
			path,
			type: "bip44",
		};
	}

	public override async validate(address: string): Promise<boolean> {
		try {
			const decoded: Buffer = Buffer.from(Base58.decode(address));
			const offset: number = decoded.length - 4;
			const expected: Buffer = decoded.slice(offset);
			const actual: Buffer = Hash.sha256(Hash.sha256(Buffer.from(decoded.slice(0, offset)))).slice(0, 4);

			if (actual.compare(expected) !== 0) {
				return false;
			}

			const result: Buffer = decoded.slice(0, offset);

			if (result && result.length !== 21) {
				return false;
			}

			if (this.configRepository.get("network.id") === "trx.mainnet") {
				return result[0] === 0x41;
			}

			return result[0] === 0xa0;
		} catch {
			return false;
		}
	}
}
