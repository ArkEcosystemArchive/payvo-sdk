import { Coins, Contracts, Exceptions, IoC, Signatories } from "@payvo/sdk";

import { MultiSignatureTransaction } from "./multi-signature.contract.js";
import * as bitcoin from "bitcoinjs-lib";
import { sign } from "bitcoinjs-message";
import { getNetworkConfig } from "./config.js";
import { BIP32 } from "@payvo/sdk-cryptography";
import { isMultiSignatureRegistration } from "./multi-signature.domain.js";
import { signWith } from "./helpers.js";

export class MultiSignatureSigner {
	readonly #configRepository: Coins.ConfigRepository;
	readonly #network: bitcoin.networks.Network;

	public constructor(container: IoC.IContainer) {
		this.#configRepository = container.get(IoC.BindingType.ConfigRepository);
		this.#network = getNetworkConfig(this.#configRepository);
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
