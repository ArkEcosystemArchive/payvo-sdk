import { Contracts, Helpers, Services } from "@payvo/sdk";
import { UUID } from "@payvo/sdk-cryptography";
import { LCDClient, MnemonicKey, MsgSend } from "@terra-money/terra.js";

import { useClient } from "./helpers.js";

export class TransactionService extends Services.AbstractTransactionService {
	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		const amount = this.toSatoshi(input.data.amount).toString();

		const transaction = await this.#useClient()
			.wallet(new MnemonicKey({ mnemonic: input.signatory.signingKey() }))
			.createAndSignTx({
				msgs: [new MsgSend(input.signatory.address(), input.data.to, { uluna: amount })],
				memo: input.data.memo,
			});

		return this.dataTransferObjectService.signedTransaction(
			UUID.random(),
			transaction.toData(),
			transaction.toData(),
		);
	}

	#useClient(): LCDClient {
		return useClient(
			`${this.hostSelector(this.configRepository).host}/api`,
			this.configRepository.get("network.meta.networkId"),
		);
	}
}
