import { Coins, Contracts, Exceptions, IoC, Services, Signatories } from "@payvo/sdk";

import { MultiSignatureTransaction } from "./multi-signature.contract.js";
import { PendingMultiSignatureTransaction } from "./multi-signature.transaction";
import * as bitcoin from "bitcoinjs-lib";
import { sign } from "bitcoinjs-message";
import { getNetworkConfig } from "./config.js";
import { BIP32 } from "@payvo/sdk-cryptography";
import { isMultiSignatureRegistration, toExtPubKey } from "./multi-signature.domain";
import { signWith } from "./helpers.js";

export class MultiSignatureSigner {
	@IoC.inject(IoC.BindingType.LedgerService)
	private readonly ledgerService!: Services.LedgerService;

	@IoC.inject(IoC.BindingType.ConfigRepository)
	private readonly configRepository!: Coins.ConfigRepository;

	#network!: bitcoin.networks.Network;

	@IoC.postConstruct()
	private onPostConstruct(): void {
		this.#network = getNetworkConfig(this.configRepository);
	}

	public async addSignature(
		transaction: Contracts.RawTransactionData,
		signatory: Signatories.Signatory,
	): Promise<MultiSignatureTransaction> {
		let signedTransaction: Contracts.RawTransactionData = { ...transaction };

		if (signatory.actsWithLedger()) {
			throw new Exceptions.NotImplemented(this.constructor.name, "signing with ledger");
		} else {
			const rootKey = BIP32.fromMnemonic(signatory.signingKey(), this.#network);
			const accountKey = rootKey.derivePath(signatory.publicKey()); // TODO publicKey actually has the path
			if (isMultiSignatureRegistration(transaction)) {
				const messageToSign = `${transaction.id}${transaction.senderPublicKey}`;
				const signature = sign(messageToSign, accountKey.privateKey!, true).toString("base64");
				signedTransaction.signatures.push(signature);
			} else {
				const toSign = bitcoin.Psbt.fromBase64(transaction.psbt, { network: this.#network });
				const signed = signWith(toSign, rootKey, signatory.publicKey());

				signedTransaction.psbt = signed.toBase64();
			}
		}

		return signedTransaction;
	}

	async #signWithLedger(
		transaction: MultiSignatureTransaction,
		signatory: Signatories.Signatory,
		excludeMultiSignature = false,
	): Promise<string> {
		// TODO figure out how to sigh Psbt with Ledger
		// See this for ideas: https://stackoverflow.com/questions/59082832/how-to-sign-bitcoin-psbt-with-ledger
		// although it will need a lot of changes, as it is it will requestion 2 confirmations for each utxo being spent.
		// We need to find a way to sign them all at once.
		throw new Exceptions.NotImplemented(this.constructor.name, "signing with ledger");
	}
}
