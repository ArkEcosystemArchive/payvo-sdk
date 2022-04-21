/* istanbul ignore file */

import { BigNumber, NumberLike } from "@payvo/sdk-helpers";

import { BigNumberService } from "./big-number.service.js";
import { ClientService } from "./client.contract.js";
import { ConfigRepository } from "./coins.js";
import { IContainer } from "./container.contracts.js";
import { SignedTransactionData } from "./contracts.js";
import { DataTransferObjectService } from "./data-transfer-object.contract.js";
import { NotImplemented } from "./exceptions.js";
import { HttpClient } from "./http.js";
import { NetworkHostSelector } from "./network.models.js";
import { BindingType } from "./service-provider.contract.js";
import {
	DelegateRegistrationInput,
	DelegateResignationInput,
	IpfsInput,
	MultiPaymentInput,
	MultiSignatureInput,
	SecondSignatureInput,
	TransactionService as Contract,
	TransferInput,
	UnlockTokenInput,
	VoteInput,
} from "./transaction.contract.js";

export class AbstractTransactionService implements Contract {
	protected readonly bigNumberService: BigNumberService;
	protected readonly clientService: ClientService;
	protected readonly configRepository: ConfigRepository;
	protected readonly dataTransferObjectService: DataTransferObjectService;
	protected readonly httpClient: HttpClient;
	protected readonly hostSelector: NetworkHostSelector;

	public constructor(container: IContainer) {
		this.bigNumberService = container.get(BindingType.BigNumberService);
		this.clientService = container.get(BindingType.ClientService);
		this.configRepository = container.get(BindingType.ConfigRepository);
		this.dataTransferObjectService = container.get(BindingType.DataTransferObjectService);
		this.httpClient = container.get(BindingType.HttpClient);
		this.hostSelector = container.get(BindingType.NetworkHostSelector);
	}

	public async transfer(input: TransferInput): Promise<SignedTransactionData> {
		throw new NotImplemented(this.constructor.name, this.transfer.name);
	}

	public async secondSignature(input: SecondSignatureInput): Promise<SignedTransactionData> {
		throw new NotImplemented(this.constructor.name, this.secondSignature.name);
	}

	public async delegateRegistration(input: DelegateRegistrationInput): Promise<SignedTransactionData> {
		throw new NotImplemented(this.constructor.name, this.delegateRegistration.name);
	}

	public async vote(input: VoteInput): Promise<SignedTransactionData> {
		throw new NotImplemented(this.constructor.name, this.vote.name);
	}

	public async multiSignature(input: MultiSignatureInput): Promise<SignedTransactionData> {
		throw new NotImplemented(this.constructor.name, this.multiSignature.name);
	}

	public async ipfs(input: IpfsInput): Promise<SignedTransactionData> {
		throw new NotImplemented(this.constructor.name, this.ipfs.name);
	}

	public async multiPayment(input: MultiPaymentInput): Promise<SignedTransactionData> {
		throw new NotImplemented(this.constructor.name, this.multiPayment.name);
	}

	public async delegateResignation(input: DelegateResignationInput): Promise<SignedTransactionData> {
		throw new NotImplemented(this.constructor.name, this.delegateResignation.name);
	}

	public async unlockToken(input: UnlockTokenInput): Promise<SignedTransactionData> {
		throw new NotImplemented(this.constructor.name, this.unlockToken.name);
	}

	public async estimateExpiration(value?: string): Promise<string | undefined> {
		return undefined;
	}

	protected toSatoshi(value: NumberLike): BigNumber {
		return this.bigNumberService.make(value).toSatoshi();
	}
}
