import { Contracts, Exceptions, IoC, Services } from "@payvo/sdk";
import { DateTime } from "@payvo/sdk-intl";
import { BN, Long, units } from "@zilliqa-js/util";
import { Zilliqa } from "@zilliqa-js/zilliqa";

import { convertZilToQa, getZilliqaVersion } from "./zilliqa.js";

export class TransactionService extends Services.AbstractTransactionService {
	readonly #zilliqa: Zilliqa;
	readonly #version: number;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#zilliqa = new Zilliqa(this.hostSelector(this.configRepository).host);
		this.#version = getZilliqaVersion(this.configRepository);
	}

	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		if (!input.data.to) {
			throw new Exceptions.MissingArgument(this.constructor.name, this.transfer.name, "data.to");
		}

		if (input.fee === undefined) {
			throw new Exceptions.MissingArgument(this.constructor.name, this.transfer.name, "fee");
		}

		if (input.feeLimit === undefined) {
			throw new Exceptions.MissingArgument(this.constructor.name, this.transfer.name, "feeLimit");
		}

		if (input.nonce === undefined) {
			throw new Exceptions.MissingArgument(this.constructor.name, this.transfer.name, "nonce");
		}

		if (input.signatory.signingKey() === undefined) {
			throw new Exceptions.MissingArgument(this.constructor.name, this.transfer.name, "signatory");
		}

		const address = this.#zilliqa.wallet.addByMnemonic(input.signatory.signingKey());
		const { publicKey, bech32Address } = this.#zilliqa.wallet.accounts[address];

		if (bech32Address !== input.signatory.address()) {
			throw new Exceptions.Exception(
				`Sender address (${input.signatory.address()}) must match signer address (${bech32Address})`,
			);
		}

		const amount = convertZilToQa(input.data.amount);
		const fee = units.toQa(input.fee, units.Units.Li).toString();
		const signedData = {
			address,
			amount,
			fee,
			recipient: input.data.to,
			timestamp: DateTime.make(),
		};

		const transaction = this.#zilliqa.transactions.new({
			amount: new BN(convertZilToQa(input.data.amount)),
			data: input.data.memo,
			gasLimit: Long.fromNumber(input.feeLimit),
			gasPrice: new BN(units.toQa(input.fee, units.Units.Li)),
			nonce: new BN(input.nonce).toNumber(),
			pubKey: publicKey,
			toAddr: input.data.to,
			version: this.#version,
		});

		const signedTransaction = await this.#zilliqa.wallet.signWith(transaction, address, true);
		const broadcastData = JSON.stringify({ ...signedTransaction.payload, version: this.#version });

		return this.dataTransferObjectService.signedTransaction(signedTransaction.hash, signedData, broadcastData);
	}
}
