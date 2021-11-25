import { IoC, Services } from "@payvo/sdk";
import { Buffoon } from "@payvo/sdk-cryptography";
import { secp256k1 } from "bcrypto";

import { HashAlgorithms } from "./hash.js";

@IoC.injectable()
export class MessageService extends Services.AbstractMessageService {
	@IoC.inject(IoC.BindingType.KeyPairService)
	protected readonly keyPairService!: Services.KeyPairService;

	public override async sign(input: Services.MessageInput): Promise<Services.SignedMessage> {
		const { publicKey, privateKey } = await this.keyPairService.fromMnemonic(input.signatory.signingKey());

		return {
			message: input.message,
			signatory: publicKey,
			signature: secp256k1
				.sign(HashAlgorithms.sha256(input.message), Buffoon.fromHex(privateKey))
				.toString("hex"),
		};
	}

	public override async verify(input: Services.SignedMessage): Promise<boolean> {
		return secp256k1.verify(
			HashAlgorithms.sha256(input.message),
			Buffoon.fromHex(input.signature),
			Buffoon.fromHex(input.signatory),
		);
	}
}
