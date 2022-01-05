import { IoC, Services } from "@payvo/sdk";

export class PublicKeyService extends Services.AbstractPublicKeyService {
	readonly #keyPairService: Services.KeyPairService;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#keyPairService = container.get(IoC.BindingType.KeyPairService);
	}

	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PublicKeyDataTransferObject> {
		return {
			publicKey: (await this.#keyPairService.fromMnemonic(mnemonic, options)).publicKey,
		};
	}
}
