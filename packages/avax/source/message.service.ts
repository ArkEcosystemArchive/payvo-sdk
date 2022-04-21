import { Services } from "@payvo/sdk";
import { Hash } from "@payvo/sdk-cryptography";
import { BinTools, Buffer } from "avalanche";
import { KeyPair } from "avalanche/dist/apis/avm/index.js";
import { getPreferredHRP } from "avalanche/dist/utils/index.js";

import { cb58Decode as callback58Decode, cb58Encode as callback58Encode, keyPairFromMnemonic } from "./helpers.js";

export class MessageService extends Services.AbstractMessageService {
	public override async sign(input: Services.MessageInput): Promise<Services.SignedMessage> {
		const { child } = keyPairFromMnemonic(this.configRepository, this.hostSelector, input.signatory.signingKey());

		return {
			message: input.message,
			signatory: child.getAddressString(),
			signature: callback58Encode(child.sign(this.#digestMessage(input.message))),
		};
	}

	public override async verify(input: Services.SignedMessage): Promise<boolean> {
		const bintools = BinTools.getInstance();

		const hrp = getPreferredHRP(Number.parseInt(this.configRepository.get("network.meta.networkId")));
		const keypair = new KeyPair(hrp, "X");
		const signedBuff = callback58Decode(input.signature);
		const pubKey = keypair.recover(this.#digestMessage(input.message), signedBuff);

		return bintools.addressToString(hrp, "X", keypair.addressFromPublicKey(pubKey)) === input.signatory;
	}

	#digestMessage(messageString: string): Buffer {
		const mBuf = Buffer.from(messageString, "utf8");
		const messageSize = Buffer.alloc(4);
		messageSize.writeUInt32BE(mBuf.length, 0);

		return Buffer.from(Hash.sha256(`\u001AAvalanche Signed Message:\n${messageSize}${messageString}`));
	}
}
