import { Exceptions, IoC, Services } from "@payvo/sdk";
import { ECPair } from "bitcoinjs-lib";
import { sign, verify } from "bitcoinjs-message";

@IoC.injectable()
export class MessageService extends Services.AbstractMessageService {
	@IoC.inject(IoC.BindingType.AddressService)
	private readonly addressService!: Services.AddressService;

	public override async sign(input: Services.MessageInput): Promise<Services.SignedMessage> {
		const { compressed, privateKey } = ECPair.fromWIF(input.signatory.signingKey());

		if (!privateKey) {
			throw new Error(`Failed to derive private key for [${input.signatory.signingKey()}].`);
		}

		const { address } = await this.addressService.fromWIF(input.signatory.signingKey(), input.signatory.options());

		return {
			message: input.message,
			signatory: address,
			signature: sign(input.message, privateKey, compressed).toString("base64"),
		};
	}

	public override async verify(input: Services.SignedMessage): Promise<boolean> {
		return verify(input.message, input.signatory, input.signature);
	}
}
