import { Contracts, Exceptions, IoC, Services } from "@payvo/sdk";
import { BN } from "@zilliqa-js/util";
import { Zilliqa } from "@zilliqa-js/zilliqa";

import { BindingType } from "./constants.js";

export class ClientService extends Services.AbstractClientService {
	readonly #zilliqa: Zilliqa;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#zilliqa = container.get(BindingType.Zilliqa);
	}

	public override async transaction(
		id: string,
		input?: Services.TransactionDetailInput,
	): Promise<Contracts.ConfirmedTransactionData> {
		const transaction = await this.#zilliqa.blockchain.getTransaction(id);
		const receipt = transaction.getReceipt();

		return this.dataTransferObjectService.transaction({
			id: transaction.hash,
			sender: transaction.senderAddress,
			recipient: transaction.payload.toAddr,
			amount: transaction.payload.amount,
			gasUsed: receipt?.cumulative_gas || 0,
			gasPrice: transaction.payload.gasPrice,
			isConfirmed: transaction.isConfirmed(),
			isSent: transaction.isPending(),
		});
	}

	public override async wallet(id: Services.WalletIdentifier): Promise<Contracts.WalletData> {
		const response = await this.#zilliqa.blockchain.getBalance(id.value);

		if (response.error) {
			throw new Exceptions.Exception(`Received an error: ${JSON.stringify(response.error)}`);
		}

		if (response?.result === undefined) {
			throw new Exceptions.Exception(`Received an invalid response: ${JSON.stringify(response)}`);
		}

		return this.dataTransferObjectService.wallet({
			address: id.value,
			balance: response.result.balance,
			nonce: response.result.nonce,
		});
	}

	public override async broadcast(
		transactions: Contracts.SignedTransactionData[],
	): Promise<Services.BroadcastResponse> {
		const minGasPrice = (await this.#zilliqa.blockchain.getMinimumGasPrice()).result;

		const response: Services.BroadcastResponse = {
			accepted: [],
			rejected: [],
			errors: {},
		};

		for (const transaction of transactions) {
			const id = transaction.id();

			try {
				this.#checkGasPrice(transaction.fee().toString(), minGasPrice);

				const broadcastData = transaction.toBroadcast();
				const hash = await this.#zilliqa.blockchain.createTransactionRaw(broadcastData);

				const txParams = JSON.parse(broadcastData);
				const tx = this.#zilliqa.transactions.new({ ...txParams });
				await tx.confirm(hash);

				if (tx.isConfirmed()) {
					response.accepted.push(id);
				} else {
					response.rejected.push(id);
					const receipt = tx.getReceipt();
					if (receipt?.errors) {
						response.errors[id] = receipt.errors;
					}
				}
			} catch (error) {
				response.rejected.push(id);
				response.errors[id] = (error as any).message;
			}
		}

		return response;
	}

	#checkGasPrice(gasPrice: string, minGasPrice = "0") {
		const isGasSufficient = new BN(gasPrice).gte(new BN(minGasPrice));
		if (!isGasSufficient) {
			throw new Exceptions.Exception(`Insufficient gas: ${gasPrice}, needed: ${minGasPrice}`);
		}
	}
}
