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
		const { publicKey } = await this.#keyPairService.fromMnemonic(mnemonic);

		if (!publicKey) {
			throw new Error("Failed to derive the public key.");
		}

		return { publicKey };
	}
}
