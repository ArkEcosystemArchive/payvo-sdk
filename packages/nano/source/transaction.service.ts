import { Contracts, IoC, Services } from "@payvo/sdk";
import { DateTime } from "@payvo/sdk-intl";
import { computeWork } from "nanocurrency";
import { block, tools } from "nanocurrency-web";

import { NanoClient } from "./rpc.js";

export class TransactionService extends Services.AbstractTransactionService {
	#client!: NanoClient;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#client = new NanoClient(this.configRepository, this.httpClient, this.hostSelector);
	}

	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		const { balance, representative, frontier } = await this.#client.accountInfo(input.signatory.address(), {
			representative: true,
		});

		const data = {
			walletBalanceRaw: balance,
			fromAddress: input.signatory.address(),
			toAddress: input.data.to,
			representativeAddress: representative,
			frontier,
			amountRaw: tools.convert(input.data.amount.toString(), "NANO", "RAW"),
			work: (await computeWork(frontier))!,
		};
		const signedData = { ...data, timestamp: DateTime.make() };
		const broadcastData = block.send(data, input.signatory.privateKey());

		return this.dataTransferObjectService.signedTransaction(broadcastData.signature, signedData, broadcastData);
	}
}
