import { IoC, Services } from "@payvo/sdk";
import Ripple from "@ledgerhq/hw-app-xrp";

@IoC.injectable()
export class LedgerService extends Services.AbstractLedgerService {
	#ledger: Services.LedgerTransport;
	#transport!: Ripple;

	public override async connect(transport: Services.LedgerTransport): Promise<void> {
		if (transport.open === "function") {
			this.#ledger = transport.open();
		} else {
			this.#ledger = transport;
		}

		this.#transport = new Ripple(this.#ledger);
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
		return this.#transport.signTransaction(path, payload.toString("hex"));
	}
}
