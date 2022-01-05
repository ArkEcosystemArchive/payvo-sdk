import { IoC, Services } from "@payvo/sdk";
import { getPublicKey, sign, verify } from "@noble/ed25519";

export class MessageService extends Services.AbstractMessageService {
	readonly #keyPairService: Services.KeyPairService;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#keyPairService = container.get(IoC.BindingType.KeyPairService);
	}

	public override async sign(input: Services.MessageInput): Promise<Services.SignedMessage> {
		const { privateKey } = await this.#keyPairService.fromMnemonic(input.signatory.signingKey());

		if (privateKey === undefined) {
			throw new Error("Failed to retrieve the private key for the signatory wallet.");
		}

		return {
			message: input.message,
			signatory: await getPublicKey(privateKey),
			signature: await sign(Buffer.from(input.message, "utf8").toString("hex"), privateKey),
		};
	}

	public override async verify(input: Services.SignedMessage): Promise<boolean> {
		return verify(input.signature, Buffer.from(input.message, "utf8").toString("hex"), input.signatory);
	}
}
