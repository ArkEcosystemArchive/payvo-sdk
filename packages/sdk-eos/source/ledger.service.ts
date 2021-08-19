import { IoC, Services } from "@payvo/sdk";
import { BIP44 } from "@payvo/cryptography";

@IoC.injectable()
export class LedgerService extends Services.AbstractLedgerService {
	#ledger: Services.LedgerTransport;

	public override async connect(transport: Services.LedgerTransport): Promise<void> {
		if (transport.constructor.name === "TransportReplayer") {
			this.#ledger = transport;
		} else {
			this.#ledger = transport.create();
		}
	}

	public override async disconnect(): Promise<void> {
		await this.#ledger.close();
	}

	public override async getVersion(): Promise<string> {
		const result = await this.#ledger.send(0xd4, 0x06, 0x00, 0x00);

		return `${result[1]}.${result[2]}.${result[3]}`;
	}

	public override async getPublicKey(path: string): Promise<string> {
		const result = await this.#ledger.send(0xd4, 0x02, 0x00, 0x00, this.#eosBip44Parse(path));

		return result.slice(1, 1 + result[0]).toString("hex");
	}

	public override async signTransaction(path: string, payload: Buffer): Promise<string> {
		const signature = await this.#eosSignTransaction(path, payload);

		return signature;
	}

	/**
	 * EOS-like Bip44 Parsing
	 */
	#eosBip44Parse(path: string): Buffer {
		const elements: number[] = Object.values(BIP44.parse(path));
		const payload = Buffer.alloc(1 + elements.length * 4);
		payload[0] = elements.length;
		elements.forEach((element: number, index: number) => {
			payload.writeUInt32BE((element += index < 3 ? 0x80000000 : 0), 1 + 4 * index);
		});

		return payload;
	}

	/**
	 * EOS-like Transaction Signing
	 */
	async #eosSignTransaction(path: string, rawTxHex: Buffer): Promise<string> {
		const eosPaths = this.#eosBip44Parse(path);
		const buffer = Buffer.concat([eosPaths, rawTxHex]);

		const chunkSize = 150;
		const chunks = Array.from({ length: Math.ceil(buffer.length / chunkSize) }, (v, i) => {
			return buffer.slice(i * chunkSize, i * chunkSize + chunkSize);
		});

		let response = Buffer.alloc(65);
		for (let index = 0; index < chunks.length; ++index) {
			const chunk = chunks[index];
			await this.#ledger.send(0xd4, 0x04, index === 0 ? 0x00 : 0x80, 0x00, chunk).then((apduResponse) => {
				response = apduResponse;
				return response;
			});
		}

		return response.slice(0, response.length - 2).toString("hex");
	}
}
