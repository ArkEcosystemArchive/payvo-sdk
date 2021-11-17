import { Coins, IoC, Services } from "@payvo/sdk";
import { convertBuffer } from "@payvo/sdk-helpers";
import Bitcoin from "@ledgerhq/hw-app-btc";
import { getAppAndVersion } from "@ledgerhq/hw-app-btc/lib/getAppAndVersion";
import * as bitcoin from "bitcoinjs-lib";
import createXpub from "create-xpub";

import { getNetworkID } from "./config";
import { maxLevel } from "./helpers";
import { Bip44Address } from "./contracts";

@IoC.injectable()
export class LedgerService extends Services.AbstractLedgerService {
	@IoC.inject(IoC.BindingType.ConfigRepository)
	private readonly configRepository!: Coins.ConfigRepository;

	#ledger: Services.LedgerTransport;
	#transport!: Bitcoin;

	public override async connect(): Promise<void> {
		this.#ledger = await this.ledgerTransportFactory();
		// @ts-ignore
		this.#transport = new Bitcoin(this.#ledger);
	}

	@IoC.preDestroy()
	public override async disconnect(): Promise<void> {
		await this.#transport.transport.close();
	}

	public override async getVersion(): Promise<string> {
		const { version } = await getAppAndVersion(this.#ledger);

		return version;
	}

	public override async getPublicKey(path: string): Promise<string> {
		const { publicKey } = await this.#transport.getWalletPublicKey(path);

		return publicKey;
	}

	public override async getExtendedPublicKey(path: string): Promise<string> {
		const networkId = getNetworkID(this.configRepository);

		const walletPublicKey = await this.#transport.getWalletPublicKey(path, { verify: false });

		return createXpub({
			networkVersion: networkId === "testnet" ? createXpub.testnet : createXpub.mainnet,
			depth: maxLevel(path),
			childNumber: 2147483648,
			chainCode: walletPublicKey.chainCode,
			publicKey: walletPublicKey.publicKey,
		});
	}

	public override async signMessage(path: string, payload: Buffer): Promise<string> {
		const signature = await this.#transport.signMessageNew(path, convertBuffer(payload));

		return JSON.stringify(signature);
	}

	public async createTransaction(
		network: bitcoin.networks.Network,
		inputs: any[],
		outputs: any[],
		changeAddress: Bip44Address,
	): Promise<bitcoin.Transaction> {
		const outputScriptHex = await this.#getOutputScript(network, outputs);
		const isSegwit = inputs.some((input) => input.path.match(/49|84'/) !== null);
		const isBip84 = inputs.some((input) => input.path.match(/84'/) !== null);
		const additionals: string[] = isBip84 ? ["bech32"] : [];

		const transactionHex = await this.#transport.createPaymentTransactionNew({
			inputs: inputs.map((input) => {
				const inLedgerTx = this.#splitTransaction(bitcoin.Transaction.fromHex(input.txRaw));
				return [inLedgerTx, input.vout as number, undefined, undefined];
			}),
			associatedKeysets: inputs.map((input) => input.path),
			changePath: changeAddress.path,
			additionals,
			outputScriptHex,
			sigHashType: bitcoin.Transaction.SIGHASH_ALL, // 1
			segwit: isSegwit,
		});
		return bitcoin.Transaction.fromHex(transactionHex);
	}

	async #getOutputScript(network: bitcoin.networks.Network, outputs: any[]): Promise<string> {
		const psbt = new bitcoin.Psbt({ network: network });
		outputs.forEach((output) =>
			psbt.addOutput({
				address: output.address,
				value: output.value,
			}),
		);
		// @ts-ignore
		const newTx: bitcoin.Transaction = psbt.__CACHE.__TX;
		const outLedgerTx = this.#splitTransaction(newTx);

		return convertBuffer(this.#transport.serializeTransactionOutputs(outLedgerTx));
	}

	#splitTransaction(tx: bitcoin.Transaction) {
		return this.#transport.splitTransaction(tx.toHex(), tx.hasWitnesses());
	}
}
