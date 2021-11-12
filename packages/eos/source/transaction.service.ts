import { Coins, Contracts, Exceptions, Helpers, IoC, Services } from "@payvo/sdk";
import { DateTime } from "@payvo/sdk-intl";
import { createHash } from "crypto";
import { Api, JsonRpc } from "eosjs";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig";
import fetch from "cross-fetch";
import { TextDecoder, TextEncoder } from "util";

@IoC.injectable()
export class TransactionService extends Services.AbstractTransactionService {
	#networkId!: string;
	#peer!: string;
	#ticker!: string;

	@IoC.postConstruct()
	private onPostConstruct(): void {
		this.#networkId = this.configRepository.get<string>("network.meta.networkId");
		this.#peer = Helpers.randomHostFromConfig(this.configRepository);
		this.#ticker = this.configRepository.get<string>(Coins.ConfigKey.CurrencyTicker);
	}

	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		if (input.signatory.signingKey() === undefined) {
			throw new Exceptions.MissingArgument(this.constructor.name, this.transfer.name, "input.signatory");
		}

		const { client, signatureProvider } = this.#getClient(input.signatory.signingKey());

		const transfer: any = await client.transact(
			{
				actions: [
					{
						account: "eosio.token",
						name: "transfer",
						authorization: [
							{
								actor: input.signatory.address(),
								permission: "active",
							},
						],
						data: {
							from: input.signatory.address(),
							to: input.data.to,
							quantity: `${input.data.amount} ${this.#ticker}`,
							memo: input.data.memo,
						},
					},
				],
			},
			{
				blocksBehind: 3,
				expireSeconds: 30,
				broadcast: false,
				sign: false,
				requiredKeys: await signatureProvider.getAvailableKeys(),
			},
		);

		// transfer.chainId = this.#networkId;

		const signatures = transfer.signatures || null;
		const transaction = await signatureProvider.sign(transfer);

		if (signatures) {
			transaction.signatures = transaction.signatures.concat(signatures);
		}

		return this.dataTransferObjectService.signedTransaction(
			createHash("sha256").update(transaction.serializedTransaction).digest("hex"),
			{ ...transaction, timestamp: DateTime.make() },
			transaction,
		);
	}

	#getClient(privateKey: string) {
		const signatureProvider: JsSignatureProvider = new JsSignatureProvider([privateKey]);

		return {
			client: new Api({
				rpc: new JsonRpc(this.#peer, { fetch }),
				signatureProvider,
				// @ts-ignore - this started to error out of nowhere when building
				textEncoder: new TextEncoder(),
				// @ts-ignore - this started to error out of nowhere when building
				textDecoder: new TextDecoder(),
			}),
			signatureProvider,
		};
	}
}
