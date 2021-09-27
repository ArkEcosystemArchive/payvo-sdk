import { Coins, IoC, Services } from "@payvo/sdk";
import Bitcoin from "@ledgerhq/hw-app-btc";
import * as bitcoin from "bitcoinjs-lib";
import { getAppAndVersion } from "@ledgerhq/hw-app-btc/lib/getAppAndVersion";
import { serializeTransactionOutputs } from "@ledgerhq/hw-app-btc/lib/serializeTransaction";
import { getNetworkID } from "./config";
import createXpub from "create-xpub";
import { maxLevel } from "./helpers";
import { Bip44Address } from "./contracts";

@IoC.injectable()
export class LedgerService extends Services.AbstractLedgerService {
	@IoC.inject(IoC.BindingType.ConfigRepository)
	private readonly configRepository!: Coins.ConfigRepository;

	#ledger: Services.LedgerTransport;
	#transport!: Bitcoin;

	public override async connect(transport: Services.LedgerTransport): Promise<void> {
		try {
			this.#ledger = await transport.create();
		} catch (error) {
			if (transport.constructor.name === "TransportReplayer") {
				this.#ledger = transport;
			} else {
				throw error;
			}
		}

		// @ts-ignore
		this.#transport = new Bitcoin.default(this.#ledger);
	}

	public override async disconnect(): Promise<void> {
		await this.#ledger.close();
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

	public override async signTransaction(path: string, payload: Buffer): Promise<string> {
		const tx = this.#splitTransaction(bitcoin.Transaction.fromHex(payload.toString()));
		const utxoPath = path.match(new RegExp("([0-9]+'?/?){3}$", "g"));
		const outputScript = serializeTransactionOutputs(tx).toString("hex");

		const signature = await this.#transport.createPaymentTransactionNew({
			inputs: [[tx, 1, undefined, undefined]],
			associatedKeysets: utxoPath!,
			outputScriptHex: outputScript,
			additionals: [],
		});

		return signature.toString();
	}

	public override async signMessage(path: string, payload: Buffer): Promise<string> {
		const signature = await this.#transport.signMessageNew(path, payload.toString("hex"));

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

		return await this.#transport.serializeTransactionOutputs(outLedgerTx).toString("hex");
	}

	#splitTransaction(tx: bitcoin.Transaction) {
		return this.#transport.splitTransaction(tx.toHex(), tx.hasWitnesses());
	}
}
