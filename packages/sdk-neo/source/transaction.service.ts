import { Contracts, Exceptions, IoC, Services } from "@payvo/sdk";
import { DateTime } from "@payvo/intl";
import { api, wallet } from "@cityofzion/neon-js";
import { UUID } from "@payvo/cryptography";

@IoC.injectable()
export class TransactionService extends Services.AbstractTransactionService {
	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		const signedTransaction = {
			account: new wallet.Account(input.signatory.signingKey()),
			intents: api.makeIntent(
				{ NEO: parseFloat(input.data.amount.toString()), GAS: parseFloat(input.fee!.toString()) },
				input.data.to,
			),
		};

		const signedData = { ...signedTransaction, timestamp: DateTime.make() };

		return this.dataTransferObjectService.signedTransaction(
			UUID.random(),
			signedData,
			JSON.stringify(signedTransaction),
		);
	}
}
