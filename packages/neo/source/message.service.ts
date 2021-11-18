import { IoC, Services } from "@payvo/sdk";
import Neon from "@cityofzion/neon-js";

@IoC.injectable()
export class MessageService extends Services.AbstractMessageService {
	public override async sign(input: Services.MessageInput): Promise<Services.SignedMessage> {
		const account = Neon.create.account(input.signatory.signingKey());
		const signature = Neon.sign.message(input.message, account.privateKey);

		return { message: input.message, signatory: account.publicKey, signature };
	}

	public override async verify(input: Services.SignedMessage): Promise<boolean> {
		return Neon.verify.message(input.message, input.signature, input.signatory);
	}
}
