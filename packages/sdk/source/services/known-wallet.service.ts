/* istanbul ignore file */

import { injectable } from "../ioc";
import { KnownWallet, KnownWalletService } from "./known-wallet.contract";

@injectable()
export class AbstractKnownWalletService implements KnownWalletService {
	public async all(): Promise<KnownWallet[]> {
		return [];
	}
}
