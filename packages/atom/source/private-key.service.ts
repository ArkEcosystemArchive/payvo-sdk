import { IoC, Services } from "@payvo/sdk";

export class PrivateKeyService extends Services.AbstractPrivateKeyService {
	readonly #keyPairService: Services.KeyPairService;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#keyPairService = container.get(IoC.BindingType.KeyPairService);
	}

	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PrivateKeyDataTransferObject> {
		const { privateKey } = await this.#keyPairService.fromMnemonic(mnemonic);

		if (!privateKey) {
			throw new Error("Failed to derive the private key.");
		}

		return { privateKey };
	}
}
