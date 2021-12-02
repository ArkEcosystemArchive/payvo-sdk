/* istanbul ignore file */

import { NotImplemented } from "./exceptions.js";

import { MessageInput, MessageService, SignedMessage } from "./message.contract.js";

export class AbstractMessageService implements MessageService {
    public async sign(input: MessageInput): Promise<SignedMessage> {
        throw new NotImplemented(this.constructor.name, this.sign.name);
    }

    public async verify(input: SignedMessage): Promise<boolean> {
        throw new NotImplemented(this.constructor.name, this.verify.name);
    }
}
