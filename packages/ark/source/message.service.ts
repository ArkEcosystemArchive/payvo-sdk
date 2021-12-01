import { Hash as ARK } from "./crypto/crypto/hash.js";
import { Hash } from "@payvo/sdk-cryptography";
import { IoC, Services } from "@payvo/sdk";

@IoC.injectable()
export class MessageService extends Services.AbstractMessageService {
	public override async sign(input: Services.MessageInput): Promise<Services.SignedMessage> {
		return {
			message: input.message,
			signatory: input.signatory.publicKey(),
			signature: ARK.signSchnorr(Hash.sha256(input.message), {
				publicKey: input.signatory.publicKey(),
				privateKey: input.signatory.privateKey(),
				compressed: false,
			}),
		};
	}

	public override async verify(input: Services.SignedMessage): Promise<boolean> {
		return ARK.verifySchnorr(Hash.sha256(input.message), input.signature, input.signatory);
	}
}
