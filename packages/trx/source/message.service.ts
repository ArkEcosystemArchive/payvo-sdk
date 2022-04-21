import { Buffer } from "buffer";
import { Coins, Helpers, IoC, Services } from "@payvo/sdk";
import TronWeb from "tronweb";

export class MessageService extends Services.AbstractMessageService {
	readonly #configRepository: Coins.ConfigRepository;
	readonly #addressService: Services.AddressService;
	readonly #keyPairService: Services.KeyPairService;
	readonly #connection: TronWeb;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#configRepository = container.get(IoC.BindingType.ConfigRepository);
		this.#addressService = container.get(IoC.BindingType.AddressService);
		this.#keyPairService = container.get(IoC.BindingType.KeyPairService);

		this.#connection = new TronWeb({
			fullHost: this.hostSelector(this.#configRepository).host,
		});
	}

	public override async sign(input: Services.MessageInput): Promise<Services.SignedMessage> {
		const keys: Services.KeyPairDataTransferObject = await this.#keyPairService.fromMnemonic(
			input.signatory.signingKey(),
		);
		const { address } = await this.#addressService.fromMnemonic(input.signatory.signingKey());

		if (keys.privateKey === undefined) {
			throw new Error("Failed to retrieve the private key for the signatory wallet.");
		}

		const messageAsHex = Buffer.from(input.message).toString("hex");
		const signature = await this.#connection.trx.sign(messageAsHex, keys.privateKey);

		return {
			message: input.message,
			signatory: address,
			signature: signature,
		};
	}

	public override async verify(input: Services.SignedMessage): Promise<boolean> {
		const messageAsHex = Buffer.from(input.message).toString("hex");
		return this.#connection.trx.verifyMessage(messageAsHex, input.signature, input.signatory);
	}
}
