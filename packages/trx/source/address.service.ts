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
			type: "bip44",
			address: TronWeb.address.fromPrivateKey(child.privateKey!.toString("hex")),
			path,
		};
	}

	public override async validate(address: string): Promise<boolean> {
		try {
			const result: Buffer = this.#decodeBase58Address(address);

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

	#decodeBase58Address(base58Sting): Buffer {
		const address: Buffer = Base58.decode(base58Sting);
		const offset: number = address.length - 4;
		const expected: Buffer = address.slice(offset);
		const actual: Buffer = Hash.sha256(Hash.sha256(Buffer.from(address.slice(0, offset)))).slice(0, 4);

		if (
			expected[0] === actual[0] &&
			expected[1] === actual[1] &&
			expected[2] === actual[2] &&
			expected[3] === actual[3]
		) {
			return address.slice(0, offset);
		}

		throw new Error("Failed to decode base58 string.");
	}
}
