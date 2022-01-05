/* istanbul ignore file */

import { BroadcastResponse } from "./client.contract.js";
import { SignedTransactionData } from "./contracts.js";
import { RawTransactionData } from "./dto.js";
import { NotImplemented } from "./exceptions.js";
import { MultiSignatureService, MultiSignatureTransaction } from "./multi-signature.contract.js";
import { Signatory } from "./signatories.js";

export class AbstractMultiSignatureService implements MultiSignatureService {
	public async allWithPendingState(publicKey: string): Promise<MultiSignatureTransaction[]> {
		throw new NotImplemented(this.constructor.name, this.allWithPendingState.name);
	}

	public async allWithReadyState(publicKey: string): Promise<MultiSignatureTransaction[]> {
		throw new NotImplemented(this.constructor.name, this.allWithReadyState.name);
	}

	public async findById(id: string): Promise<MultiSignatureTransaction> {
		throw new NotImplemented(this.constructor.name, this.findById.name);
	}

	public async forgetById(id: string): Promise<void> {
		throw new NotImplemented(this.constructor.name, this.forgetById.name);
	}

	public async broadcast(transaction: MultiSignatureTransaction): Promise<BroadcastResponse> {
		throw new NotImplemented(this.constructor.name, this.broadcast.name);
	}

	public isMultiSignatureReady(transaction: SignedTransactionData, excludeFinal?: boolean): boolean {
		throw new NotImplemented(this.constructor.name, this.isMultiSignatureReady.name);
	}

	public needsSignatures(transaction: SignedTransactionData): boolean {
		throw new NotImplemented(this.constructor.name, this.needsSignatures.name);
	}

	public needsAllSignatures(transaction: SignedTransactionData): boolean {
		throw new NotImplemented(this.constructor.name, this.needsAllSignatures.name);
	}

	public needsWalletSignature(transaction: SignedTransactionData, publicKey: string): boolean {
		throw new NotImplemented(this.constructor.name, this.needsWalletSignature.name);
	}

	public needsFinalSignature(transaction: SignedTransactionData): boolean {
		throw new NotImplemented(this.constructor.name, this.needsFinalSignature.name);
	}

	public remainingSignatureCount(transaction: SignedTransactionData): number {
		throw new NotImplemented(this.constructor.name, this.remainingSignatureCount.name);
	}

	public async addSignature(transaction: RawTransactionData, signatory: Signatory): Promise<SignedTransactionData> {
		throw new NotImplemented(this.constructor.name, this.addSignature.name);
	}
}
