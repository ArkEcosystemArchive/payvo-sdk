import { Exceptions, IoC, Services } from "@payvo/sdk";
import { signMessageWithPassphrase, verifyMessageWithPublicKey } from "@liskhq/lisk-cryptography";

@IoC.injectable()
export class MessageService extends Services.AbstractMessageService {
	public override async sign(input: Services.MessageInput): Promise<Services.SignedMessage> {
		const { message, publicKey, signature } = signMessageWithPassphrase(
			input.message,
			input.signatory.signingKey(),
		);

		return { message, signatory: publicKey.toString("hex"), signature: signature.toString("hex") };
	}

	public override async verify(input: Services.SignedMessage): Promise<boolean> {
		return verifyMessageWithPublicKey({
			message: input.message,
			publicKey: Buffer.from(input.signatory, "hex"),
			signature: Buffer.from(input.signature, "hex"),
		});
	}
}
