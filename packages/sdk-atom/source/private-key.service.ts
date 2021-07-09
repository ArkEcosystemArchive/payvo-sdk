import { Coins, Exceptions, IoC, Services } from "@payvo/sdk";

@IoC.injectable()
export class PrivateKeyService extends Services.AbstractPrivateKeyService {
	@IoC.inject(IoC.BindingType.KeyPairService)
	protected readonly keyPairService!: Services.KeyPairService;

	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PrivateKeyDataTransferObject> {
		try {
			const { privateKey } = await this.keyPairService.fromMnemonic(mnemonic);

			if (!privateKey) {
				throw new Error("Failed to derive the private key.");
			}

			return { privateKey };
		} catch (error) {
			throw new Exceptions.CryptoException(error);
		}
	}
}
