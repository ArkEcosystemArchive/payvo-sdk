import { Contracts, Exceptions, Utils } from "@arkecosystem/platform-sdk";
import LedgerTransport from "@ledgerhq/hw-transport-node-hid-singleton";
import { CommHandler, DposLedger, LedgerAccount, SupportedCoin } from "dpos-ledger-api";

export class LedgerService implements Contracts.LedgerService {
	readonly #ledger: LedgerTransport;
	readonly #transport: DposLedger;

	private constructor(transport: Contracts.LedgerTransport) {
		this.#ledger = transport;
		// @ts-ignore
		this.#transport = new DposLedger(new CommHandler(transport));
	}

	public static async construct(opts: Contracts.LedgerOptions): Promise<LedgerService> {
		return new LedgerService(opts.transport || (await LedgerTransport.create()));
	}

	public async destruct(): Promise<void> {
		await this.#ledger.close();
	}

	public async getVersion(): Promise<string> {
		const { version } = await this.#transport.version();

		return version;
	}

	public async getPublicKey(path: string): Promise<string> {
		const { publicKey } = await this.#transport.getPubKey(this.getLedgerAccount(path));

		return publicKey;
	}

	public async signTransaction(path: string, payload: Buffer): Promise<string> {
		const signature: Buffer = await this.#transport.signTX(this.getLedgerAccount(path), payload);

		return signature.toString("hex");
	}

	public async signTransactionWithSchnorr(path: string, payload: Buffer): Promise<string> {
		throw new Exceptions.NotImplemented(this.constructor.name, "signTransactionWithSchnorr");
	}

	public async signMessage(path: string, payload: Buffer): Promise<string> {
		const signature: Buffer = await this.#transport.signMSG(this.getLedgerAccount(path), payload);

		return signature.slice(0, 64).toString("hex");
	}

	public async signMessageWithSchnorr(path: string, payload: Buffer): Promise<string> {
		throw new Exceptions.NotImplemented(this.constructor.name, "signMessageWithSchnorr");
	}

	private getLedgerAccount(path: string): LedgerAccount {
		return new LedgerAccount().coinIndex(SupportedCoin.LISK).account(Utils.BIP44.parse(path).account);
	}
}
