import { IoC, Services } from "@payvo/sdk";
import Ethereum from "@ledgerhq/hw-app-eth";
import { Buffer } from "buffer"

export class LedgerService extends Services.AbstractLedgerService {
	#ledger: Services.LedgerTransport;
	#transport!: Ethereum;

	public override async connect(): Promise<void> {
		this.#ledger = await this.ledgerTransportFactory();
		this.#transport = new Ethereum(this.#ledger);
	}

	public override async disconnect(): Promise<void> {
		await this.#ledger.close();
	}

	public override async getVersion(): Promise<string> {
		const { version } = await this.#transport.getAppConfiguration();

		return version;
	}

	public override async getPublicKey(path: string): Promise<string> {
		const { publicKey } = await this.#transport.getAddress(path);

		return publicKey;
	}

	public override async signTransaction(path: string, payload: Buffer): Promise<string> {
		return JSON.stringify(await this.#transport.signTransaction(path, payload.toString("hex")));
	}

	public override async signMessage(path: string, payload: string): Promise<string> {
		return JSON.stringify(await this.#transport.signPersonalMessage(path, Buffer.from(payload).toString("hex")));
	}
}
