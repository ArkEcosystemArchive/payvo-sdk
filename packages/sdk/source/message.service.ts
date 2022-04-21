/* istanbul ignore file */

import { ConfigRepository } from "./coins.js";
import { IContainer } from "./container.contracts.js";
import { NotImplemented } from "./exceptions.js";
import { MessageInput, MessageService, SignedMessage } from "./message.contract.js";
import { NetworkHostSelector } from "./network.models.js";
import { BindingType } from "./service-provider.contract.js";

export class AbstractMessageService implements MessageService {
	protected readonly configRepository: ConfigRepository;
	protected readonly hostSelector: NetworkHostSelector;

	public constructor(container: IContainer) {
		this.configRepository = container.get(BindingType.ConfigRepository);
		this.hostSelector = container.get(BindingType.NetworkHostSelector);
	}

	public async sign(input: MessageInput): Promise<SignedMessage> {
		throw new NotImplemented(this.constructor.name, this.sign.name);
	}

	public async verify(input: SignedMessage): Promise<boolean> {
		throw new NotImplemented(this.constructor.name, this.verify.name);
	}
}
