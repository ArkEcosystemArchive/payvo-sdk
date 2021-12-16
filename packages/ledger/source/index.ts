// Based on https://github.com/near/near-ledger-js/blob/master/supportedTransports.js

import LedgerU2F from "@ledgerhq/hw-transport-u2f";
import LedgerHID from "@ledgerhq/hw-transport-webhid";
import LedgerUSB from "@ledgerhq/hw-transport-webusb";
import { Services } from "@payvo/sdk";
import platform from "platform";

export class LedgerTransportFactory {
	public static async create(): Promise<Services.LedgerTransport> {
		return new LedgerTransportFactory().#make();
	}

	async #make(): Promise<Services.LedgerTransport> {
		const [supportsHID, supportsUSB, supportsU2F] = await Promise.all([
			this.#supportsHID(),
			this.#supportsUSB(),
			this.#supportsU2F(),
		]);

		if (!supportsHID && !supportsUSB && !supportsU2F) {
			throw new Error("No transports appear to be supported.");
		}

		const supportedTransports: Services.LedgerTransport[] = [];

		if (supportsHID) {
			supportedTransports.push(LedgerHID);
		}

		if (supportsUSB) {
			supportedTransports.push(LedgerUSB);
		}

		if (supportsU2F) {
			supportedTransports.push(LedgerU2F);
		}

		for (const transport of supportedTransports) {
			try {
				return await transport.create();
			} catch (error) {
				if (error.name === "TransportOpenUserCancelled") {
					throw error;
				}
			}
		}

		throw new Error("Failed to connect through any transport.");
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
				return platform.os.family !== "Windows" && platform.name !== "Opera";
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
