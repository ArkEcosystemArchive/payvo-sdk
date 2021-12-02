import { Coins, Exceptions, Helpers, IoC, Services } from "@payvo/sdk";
import { Buffer } from "buffer";
import TronWeb from "tronweb";

export class MessageService extends Services.AbstractMessageService {
	@IoC.inject(IoC.BindingType.ConfigRepository)
	private readonly configRepository!: Coins.ConfigRepository;

	@IoC.inject(IoC.BindingType.AddressService)
	private readonly addressService!: Services.AddressService;

	@IoC.inject(IoC.BindingType.KeyPairService)
	private readonly keyPairService!: Services.KeyPairService;

	#connection!: TronWeb;

	@IoC.postConstruct()
	private onPostConstruct(): void {
		this.#connection = new TronWeb({
			fullHost: Helpers.randomHostFromConfig(this.configRepository),
		});
	}

	public override async sign(input: Services.MessageInput): Promise<Services.SignedMessage> {
		const keys: Services.KeyPairDataTransferObject = await this.keyPairService.fromMnemonic(
			input.signatory.signingKey(),
		);
		const { address } = await this.addressService.fromMnemonic(input.signatory.signingKey());

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
