import { Exceptions, IoC, Services } from "@payvo/sdk";

import { privateToPublic, sign, verify } from "./crypto.js";

@IoC.injectable()
export class MessageService extends Services.AbstractMessageService {
	public override async sign(input: Services.MessageInput): Promise<Services.SignedMessage> {
		return {
			message: input.message,
			signatory: privateToPublic(input.signatory.signingKey()),
			signature: sign(input.message, input.signatory.signingKey()),
		};
	}

	public override async verify(input: Services.SignedMessage): Promise<boolean> {
		return verify(input.signature, input.message, input.signatory);
	}
}
