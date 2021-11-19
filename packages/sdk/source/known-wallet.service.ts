/* istanbul ignore file */

import { injectable } from "./ioc.js";
import { KnownWallet, KnownWalletService } from "./known-wallet.contract.js";

@injectable()
export class AbstractKnownWalletService implements KnownWalletService {
	public async all(): Promise<KnownWallet[]> {
		return [];
	}
}
