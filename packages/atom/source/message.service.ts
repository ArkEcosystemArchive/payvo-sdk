import { IoC, Services } from "@payvo/sdk";
import { Buffoon, Hash, secp256k1 } from "@payvo/sdk-cryptography";

export class MessageService extends Services.AbstractMessageService {
	readonly #keyPairService: Services.KeyPairService;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#keyPairService = container.get(IoC.BindingType.KeyPairService);
	}

	public override async sign(input: Services.MessageInput): Promise<Services.SignedMessage> {
		const { publicKey, privateKey } = await this.#keyPairService.fromMnemonic(input.signatory.signingKey());

		return {
			message: input.message,
			signatory: publicKey,
			signature: secp256k1.sign(Hash.sha256(input.message), Buffoon.fromHex(privateKey)).toString("hex"),
		};
	}

	public override async verify(input: Services.SignedMessage): Promise<boolean> {
		return secp256k1.verify(
			Hash.sha256(input.message),
			Buffoon.fromHex(input.signature),
			Buffoon.fromHex(input.signatory),
		);
	}
}
