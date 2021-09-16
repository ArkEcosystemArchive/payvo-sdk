import { Coins, IoC, Services } from "@payvo/sdk";
import * as bitcoin from "bitcoinjs-lib";
import Bitcoin from "@ledgerhq/hw-app-btc";
import { getAppAndVersion } from "@ledgerhq/hw-app-btc/lib/getAppAndVersion";
import { serializeTransactionOutputs } from "@ledgerhq/hw-app-btc/lib/serializeTransaction";
import { BIP32, BIP44 } from "@payvo/cryptography";
import { getNetworkConfig } from "./config";

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
		return await this.#transport.getWalletPublicKey(path, { verify: false });
	}

	public override async getExtendedPublicKey(path: string): Promise<string> {
		const network = getNetworkConfig(this.configRepository);

		const walletPublicKey = await this.#transport.getWalletPublicKey(path, { verify: false });
		console.log("walletPublicKey", walletPublicKey);

		const ecpair = bitcoin.ECPair.fromPublicKey(Buffer.from(walletPublicKey.publicKey, "hex"), { network });
		console.log("ecpair", ecpair);

		const publicKey2 = ecpair.publicKey;
		console.log("publicKey2", publicKey2.toString("hex"));

		let toBase58 = BIP32.fromPublicKey(publicKey2.toString("hex"), walletPublicKey.chainCode, network).toBase58();
		console.log("toBase58", toBase58);

		console.log(BIP32.fromBase58(toBase58, network));
		return toBase58;
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
