import { getLegacyAddressFromPublicKey, getLisk32AddressFromPublicKey } from "@liskhq/lisk-cryptography";
import { Contracts, IoC, Services } from "@payvo/sdk";
import { BIP44 } from "@payvo/sdk-cryptography";
import { Buffer } from "buffer"

import { LedgerTransport } from "./ledger/transport.js";

const createRange = (start: number, size: number) => Array.from({ length: size }, (_, index) => index + size * start);

export class LedgerService extends Services.AbstractLedgerService {
	readonly #clientService!: Services.ClientService;
	#ledger: Services.LedgerTransport;
	#transport!: LedgerTransport;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#clientService = container.get(IoC.BindingType.ClientService);
	}

	public override async connect(): Promise<void> {
		this.#ledger = await this.ledgerTransportFactory();
		this.#transport = new LedgerTransport(this.#ledger);
	}

	public override async disconnect(): Promise<void> {
		await this.#ledger.close();
	}

	public override async getVersion(): Promise<string> {
		const { version } = await this.#transport.version();

		return version;
	}

	public override async getPublicKey(path: string): Promise<string> {
		return (await this.#transport.getPubKey(this.#getLedgerAccount(path))).publicKey;
	}

	public override async signTransaction(path: string, payload: Buffer): Promise<string> {
		const signature: Buffer = await this.#transport.signTX(this.#getLedgerAccount(path), payload);

		return signature.toString("hex");
	}

	public override async signMessage(path: string, payload: string): Promise<string> {
		const signature: Buffer = await this.#transport.signMSG(this.#getLedgerAccount(path), Buffer.from(payload));

		return signature.slice(0, 64).toString("hex");
	}

	// @TODO: discover wallets until they 404
	public override async scan(options?: {
		useLegacy: boolean;
		startPath?: string;
	}): Promise<Services.LedgerWalletList> {
		const pageSize = 5;
		const page = 0;
		const slip44 = this.configRepository.get<number>("network.constants.slip44");

		const addressCache: Record<string, { address: string; publicKey: string }> = {};
		const wallets: Contracts.WalletData[] = [];

		const addresses: string[] = [];

		let initialAccountIndex = 0;

		if (options?.startPath) {
			initialAccountIndex = BIP44.parse(options.startPath).account + 1;
		}

		// Scan Ledger
		for (const accountIndexIterator of createRange(page, pageSize)) {
			const accountIndex = initialAccountIndex + accountIndexIterator;

			const path = BIP44.stringify({
				account: accountIndex,
				coinType: slip44,
			});

			const publicKey: string = await this.getPublicKey(path);

			let address: string;

			if (options?.useLegacy) {
				address = getLegacyAddressFromPublicKey(Buffer.from(publicKey, "hex"));
			} else {
				address = getLisk32AddressFromPublicKey(Buffer.from(publicKey, "hex"));
			}

			addresses.push(address);

			addressCache[path] = { address, publicKey };
		}

		// Scan Network
		const promises: Promise<void>[] = [];

		for (const address of addresses) {
			promises.push(this.#fetchWallet(address, wallets));
		}

		await Promise.all(promises);

		// Return a mapping of paths and wallets that have been found.
		return this.mapPathsToWallets(addressCache, wallets);
	}

	public override async isNanoS(): Promise<boolean> {
		return this.#ledger.deviceModel.id === "nanoS";
	}

	public override async isNanoX(): Promise<boolean> {
		return this.#ledger.deviceModel.id === "nanoX";
	}

	#getLedgerAccount(path: string): Buffer {
		const pathArray = this.#getPathArray(
			`44'/${this.configRepository.get("network.constants.slip44")}'/${BIP44.parse(path).account}'`,
		);
		const buffer = Buffer.alloc(pathArray.length * 4);

		for (const [index, r] of pathArray.entries()) {
			buffer.writeUInt32BE(r, index * 4);
		}

		return buffer;
	}

	async #fetchWallet(address: string, wallets: Contracts.WalletData[]): Promise<void> {
		try {
			const wallet: Contracts.WalletData = await this.#clientService.wallet({ type: "address", value: address });

			if (wallet.address()) {
				wallets.push(wallet);
			}
		} catch {
			return undefined;
		}
	}

	#getPathArray(text: string): number[] {
		const HARDENED = 0x80_00_00_00;

		// skip the root
		if (/^m\//i.test(text)) {
			text = text.slice(2);
		}

		const path = text.split("/");
		const result = new Array(path.length);

		for (const [index, element] of path.entries()) {
			const temporary = /(\d+)(['Hh]?)/.exec(element);

			if (temporary === null) {
				throw new Error("Invalid input");
			}

			result[index] = Number.parseInt(temporary[1], 10);

			if (result[index] >= HARDENED) {
				throw new Error("Invalid child index");
			}

			if (temporary[2] === "h" || temporary[2] === "H" || temporary[2] === "'") {
				result[index] += HARDENED;
			} else if (temporary[2].length > 0) {
				throw new Error("Invalid modifier");
			}
		}

		return result;
	}
}
