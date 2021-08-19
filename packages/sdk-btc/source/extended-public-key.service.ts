import { BIP32 } from "@payvo/cryptography";
import { IoC, Services } from "@payvo/sdk";

@IoC.injectable()
export class ExtendedPublicKeyService extends Services.AbstractExtendedPublicKeyService {
	public override async fromMnemonic(mnemonic: string, options?: Services.IdentityOptions): Promise<string> {
	  return BIP32.fromMnemonic(mnemonic).neutered().toBase58();
	}
}
