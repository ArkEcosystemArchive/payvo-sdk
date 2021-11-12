import { Exceptions, IoC, Services } from "@payvo/sdk";
import Neon from "@cityofzion/neon-js";

// @ts-ignore
const neon = Neon.default;

@IoC.injectable()
export class MessageService extends Services.AbstractMessageService {
	public override async sign(input: Services.MessageInput): Promise<Services.SignedMessage> {
		const account = neon.create.account(input.signatory.signingKey());
		const signature = neon.sign.message(input.message, account.privateKey);

		return { message: input.message, signatory: account.publicKey, signature };
	}

	public override async verify(input: Services.SignedMessage): Promise<boolean> {
		return neon.verify.message(input.message, input.signature, input.signatory);
	}
}
