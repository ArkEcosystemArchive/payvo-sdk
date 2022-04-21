import { Coins, Contracts, Exceptions, Helpers, IoC, Services } from "@payvo/sdk";
import { Hash } from "@payvo/sdk-cryptography";
import { DateTime } from "@payvo/sdk-intl";
import fetch from "cross-fetch";
import { Api, JsonRpc } from "eosjs";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig";
import { TextDecoder, TextEncoder } from "util";

export class TransactionService extends Services.AbstractTransactionService {
	#peer!: string;
	#ticker!: string;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#peer = this.hostSelector(this.configRepository).host;
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
						authorization: [
							{
								actor: input.signatory.address(),
								permission: "active",
							},
						],
						data: {
							from: input.signatory.address(),
							memo: input.data.memo,
							quantity: `${input.data.amount} ${this.#ticker}`,
							to: input.data.to,
						},
						name: "transfer",
					},
				],
			},
			{
				blocksBehind: 3,
				broadcast: false,
				expireSeconds: 30,
				requiredKeys: await signatureProvider.getAvailableKeys(),
				sign: false,
			},
		);

		// transfer.chainId = this.#networkId;

		const signatures = transfer.signatures || null;
		const transaction = await signatureProvider.sign(transfer);

		if (signatures) {
			transaction.signatures = transaction.signatures.concat(signatures);
		}

		return this.dataTransferObjectService.signedTransaction(
			Hash.sha256(Buffer.from(transaction.serializedTransaction)).toString("hex"),
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
				textDecoder: new TextDecoder(),

				// @ts-ignore - this started to error out of nowhere when building
				textEncoder: new TextEncoder(),
			}),
			signatureProvider,
		};
	}
}
