// Based on https://github.com/near/near-ledger-js/blob/master/supportedTransports.js
import LedgerU2F from "@ledgerhq/hw-transport-u2f";
import LedgerHID from "@ledgerhq/hw-transport-webhid";
import LedgerUSB from "@ledgerhq/hw-transport-webusb";
import platform from "platform";


export class LedgerTransportFactory {
	public async supportedTransport(): Promise<LedgerHID | LedgerUSB | LedgerU2F>  {
		const [supportsHID, supportsUSB, supportsU2F] = await Promise.all([
			this.#supportsHID(),
			this.#supportsUSB(),
			this.#supportsU2F(),
		]);

		if (supportsHID) {
			return LedgerHID;
		}

		if (supportsUSB) {
			return LedgerUSB;
		}

		if (supportsU2F) {
			return LedgerU2F;
		}

		throw new Error("No transports appear to be supported.");
	}

	async #supportsHID(): Promise<boolean> {
		try {
			return await LedgerHID.isSupported();
		} catch {
			return false;
		}
	}

	async #supportsUSB(): Promise<boolean> {
		try {
			if (await LedgerUSB.isSupported()) {
				return platform.os?.family !== "Windows" && platform.name !== "Opera";
			}

			return false;
		} catch {
			return false;
		}
	}

	async #supportsU2F(): Promise<boolean> {
		try {
			return await LedgerU2F.isSupported();
		} catch {
			return false;
		}
	}
}
