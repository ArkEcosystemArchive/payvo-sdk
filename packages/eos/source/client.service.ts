import { Contracts, Exceptions, IoC, Services } from "@payvo/sdk";
import fetch from "cross-fetch";
import { Api, JsonRpc } from "eosjs";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig";
import { TextDecoder, TextEncoder } from "util";

export class ClientService extends Services.AbstractClientService {
	#rpc!: JsonRpc;
	#api!: Api;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#rpc = new JsonRpc(this.hostSelector(this.configRepository).host, { fetch });

		this.#api = new Api({
			rpc: this.#rpc,
			signatureProvider: new JsSignatureProvider([]),
			// @ts-ignore - this started to error out of nowhere when building
			textDecoder: new TextDecoder(),
			// @ts-ignore - this started to error out of nowhere when building
			textEncoder: new TextEncoder(),
		});
	}

	// https://developers.eos.io/manuals/eosjs/latest/how-to-guides/how-to-get-transaction-information

	// https://developers.eos.io/manuals/eosjs/latest/how-to-guides/how-to-get-table-information

	public override async wallet(id: Services.WalletIdentifier): Promise<Contracts.WalletData> {
		return this.dataTransferObjectService.wallet(await this.#rpc.get_account(id.value));
	}

	// https://developers.eos.io/manuals/eosjs/latest/how-to-guides/how-to-transfer-an-eosio-token
	public override async broadcast(
		transactions: Contracts.SignedTransactionData[],
	): Promise<Services.BroadcastResponse> {
		const result = await this.#api.transact(
			{
				actions: [
					{
						account: "eosio.token",
						authorization: [
							{
								actor: "bdfkbzietxos",
								permission: "active",
							},
						],
						data: {
							from: "bdfkbzietxos",
							memo: "Hello World",
							quantity: "0.0001 TNT",
							to: "zqcetsxfxzca",
						},
						name: "transfer",
					},
				],
			},
			{
				blocksBehind: 3,
				expireSeconds: 30,
			},
		);

		throw new Exceptions.NotImplemented(this.constructor.name, this.broadcast.name);
	}
}
