import { Mnemonic } from "@elrondnetwork/erdjs/out/index.js";
import { getPublicKey, sign, verify } from "@noble/ed25519";
import { Services } from "@payvo/sdk";
import { Uint8 } from "@payvo/sdk-helpers";

export class MessageService extends Services.AbstractMessageService {
	public override async sign(input: Services.MessageInput): Promise<Services.SignedMessage> {
		const privateKey = Mnemonic.fromString(input.signatory.signingKey()).deriveKey(0).hex();

		return {
			message: input.message,
			signatory: Uint8.from(await getPublicKey(privateKey)),
			signature: Uint8.from(await sign(Buffer.from(input.message, "utf8").toString("hex"), privateKey)),
		};
	}

	public override async verify(input: Services.SignedMessage): Promise<boolean> {
		return verify(input.signature, Buffer.from(input.message, "utf8").toString("hex"), input.signatory);
	}
}
