/* istanbul ignore file */

import { BigNumber, NumberLike } from "@payvo/sdk-helpers";

import { ConfigRepository } from "./coins.js";
import { SignedTransactionData } from "./contracts.js";
import { NotImplemented } from "./exceptions.js";
import { HttpClient } from "./http.js";
import { inject, injectable } from "./ioc.js";
import { BindingType } from "./service-provider.contract.js";
import { BigNumberService } from "./big-number.service.js";
import { ClientService } from "./client.contract.js";
import { DataTransferObjectService } from "./data-transfer-object.contract.js";
import {
    DelegateRegistrationInput,
    DelegateResignationInput,
    HtlcClaimInput,
    HtlcLockInput,
    HtlcRefundInput,
    IpfsInput,
    MultiPaymentInput,
    MultiSignatureInput,
    SecondSignatureInput,
    TransactionService as Contract,
    TransferInput,
    UnlockTokenInput,
    VoteInput,
} from "./transaction.contract.js";

@injectable()
export class AbstractTransactionService implements Contract {
    @inject(BindingType.ClientService)
    protected readonly clientService!: ClientService;

    @inject(BindingType.ConfigRepository)
    protected readonly configRepository!: ConfigRepository;

    @inject(BindingType.DataTransferObjectService)
    protected readonly dataTransferObjectService!: DataTransferObjectService;

    @inject(BindingType.HttpClient)
    protected readonly httpClient!: HttpClient;

    @inject(BindingType.BigNumberService)
    protected readonly bigNumberService!: BigNumberService;

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

    public async htlcLock(input: HtlcLockInput): Promise<SignedTransactionData> {
        throw new NotImplemented(this.constructor.name, this.htlcLock.name);
    }

    public async htlcClaim(input: HtlcClaimInput): Promise<SignedTransactionData> {
        throw new NotImplemented(this.constructor.name, this.htlcClaim.name);
    }

    public async htlcRefund(input: HtlcRefundInput): Promise<SignedTransactionData> {
        throw new NotImplemented(this.constructor.name, this.htlcRefund.name);
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
