import Bitcoin from "@ledgerhq/hw-app-btc";
import { IoC, Services } from "@payvo/sdk";
import { convertBuffer } from "@payvo/sdk-helpers";
import * as bitcoin from "bitcoinjs-lib";
import createXpub from "create-xpub";
import invariant from "invariant";

import { getNetworkConfig, getNetworkID } from "./config.js";
import { Bip44Address } from "./contracts.js";
import { maxLevel } from "./helpers.js";

export class LedgerService extends Services.AbstractLedgerService {
	readonly #network: bitcoin.networks.Network;
	#ledger: Services.LedgerTransport;
	#transport!: Bitcoin;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#network = getNetworkConfig(this.configRepository);
	}

	public override async connect(): Promise<void> {
		this.#ledger = await this.ledgerTransportFactory();
		this.#transport = new Bitcoin(this.#ledger);
	}

	public override async disconnect(): Promise<void> {
		if (this.#ledger) {
			await this.#ledger.close();
		}
	}

	public override async getVersion(): Promise<string> {
		const r = await this.#ledger.send(0xb0, 0x01, 0x00, 0x00);
		let i = 0;
		const format = r[i++];
		invariant(format === 1, "getAppAndVersion: format not supported");
		const nameLength = r[i++];
		r.slice(i, (i += nameLength)).toString("ascii");
		const versionLength = r[i++];
		return r.slice(i, (i += versionLength)).toString("ascii");
	}

	public override async getPublicKey(path: string): Promise<string> {
		const { publicKey } = await this.#transport.getWalletPublicKey(path);

		return publicKey;
	}

	public override async getExtendedPublicKey(path: string): Promise<string> {
		const networkId = getNetworkID(this.configRepository);

		const walletPublicKey = await this.#transport.getWalletPublicKey(path, { verify: false });

		return createXpub({
			chainCode: walletPublicKey.chainCode,
			childNumber: 2_147_483_648,
			depth: maxLevel(path),
			networkVersion: networkId === "testnet" ? createXpub.testnet : createXpub.mainnet,
			publicKey: walletPublicKey.publicKey,
		});
	}

	public override async signMessage(path: string, payload: Buffer): Promise<string> {
		const signature = await this.#transport.signMessageNew(path, convertBuffer(payload));

		return JSON.stringify(signature);
	}

	public async createTransaction(
		inputs: any[],
		outputs: any[],
		changeAddress: Bip44Address,
	): Promise<bitcoin.Transaction> {
		const outputScriptHex = await this.#getOutputScript(outputs);
		const isSegwit = inputs.some((input) => input.path.match(/49|84'/) !== null);
		const isBip84 = inputs.some((input) => input.path.match(/84'/) !== null);
		const additionals: string[] = isBip84 ? ["bech32"] : [];

		const transactionHex = await this.#transport.createPaymentTransactionNew({
			additionals,
			associatedKeysets: inputs.map((input) => input.path),
			changePath: changeAddress.path,
			inputs: inputs.map((input) => {
				const inLedgerTx = this.#splitTransaction(bitcoin.Transaction.fromHex(input.txRaw));
				return [inLedgerTx, input.vout as number, undefined, undefined];
			}),
			outputScriptHex,
			// 1
segwit: isSegwit,
			sigHashType: bitcoin.Transaction.SIGHASH_ALL,
		});
		return bitcoin.Transaction.fromHex(transactionHex);
	}

	async #getOutputScript(outputs: any[]): Promise<string> {
		const psbt = new bitcoin.Psbt({ network: this.#network });
		for (const output of outputs)
			{psbt.addOutput({
				address: output.address,
				value: output.value,
			})
		;}
		// @ts-ignore
		const newTx: bitcoin.Transaction = psbt.__CACHE.__TX;
		const outLedgerTx = this.#splitTransaction(newTx);

		return convertBuffer(this.#transport.serializeTransactionOutputs(outLedgerTx));
	}

	#splitTransaction(tx: bitcoin.Transaction) {
		return this.#transport.splitTransaction(tx.toHex(), tx.hasWitnesses());
	}
}
