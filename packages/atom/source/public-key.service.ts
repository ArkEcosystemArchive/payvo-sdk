import { IoC, Services } from "@payvo/sdk";

@IoC.injectable()
export class PublicKeyService extends Services.AbstractPublicKeyService {
	@IoC.inject(IoC.BindingType.KeyPairService)
	protected readonly keyPairService!: Services.KeyPairService;

	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PublicKeyDataTransferObject> {
		const { publicKey } = await this.keyPairService.fromMnemonic(mnemonic);

		if (!publicKey) {
			throw new Error("Failed to derive the public key.");
		}

		return { publicKey };
	}
}
