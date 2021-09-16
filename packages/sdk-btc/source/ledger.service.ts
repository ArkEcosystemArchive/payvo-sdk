import { Coins, IoC, Services } from "@payvo/sdk";
import Bitcoin from "@ledgerhq/hw-app-btc";
import { getAppAndVersion } from "@ledgerhq/hw-app-btc/lib/getAppAndVersion";
import { serializeTransactionOutputs } from "@ledgerhq/hw-app-btc/lib/serializeTransaction";
import { getNetworkID } from "./config";
import createXpub from "create-xpub";

@IoC.injectable()
export class LedgerService extends Services.AbstractLedgerService {
	@IoC.inject(IoC.BindingType.ConfigRepository)
	private readonly configRepository!: Coins.ConfigRepository;

	#ledger: Services.LedgerTransport;
	#transport!: Bitcoin;

	public getTransport(): Bitcoin {
		return this.#transport;
	}

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
		const publicKey = await this.#transport.getWalletPublicKey(path, { verify: false });
		console.log("publicKey", publicKey);
		return publicKey.publicKey;
	}

	public async getPublicKey2(path: string): Promise<any> {
		return await this.#transport.getWalletPublicKey(path, { verify: false, format: "p2sh" });
	}

	public override async getExtendedPublicKey(path: string): Promise<string> {
		const networkId = getNetworkID(this.configRepository);

		const walletPublicKey = await this.#transport.getWalletPublicKey(path, { verify: false });

		return createXpub({
			networkVersion: networkId === "testnet" ? createXpub.testnet : createXpub.mainnet,
			depth: 3,
			childNumber: 2147483648,
			chainCode: walletPublicKey.chainCode,
			publicKey: walletPublicKey.publicKey,
		});
	}

	public override async signTransaction(path: string, payload: Buffer): Promise<string> {
		const tx = await this.#transport.splitTransaction(payload.toString());
		console.log("split transaction", tx);
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
}
