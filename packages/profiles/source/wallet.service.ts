import { pqueueSettled } from "./helpers/queue.js";
import { IProfile, IWalletService } from "./contracts.js";

export class WalletService implements IWalletService {
	/** {@inheritDoc IWalletService.syncByProfile} */
	public async syncByProfile(profile: IProfile): Promise<void> {
		const promises: (() => Promise<void>)[] = [];

		for (const wallet of profile.wallets().values()) {
			promises.push(() => wallet?.synchroniser().identity());
			promises.push(() => wallet?.synchroniser().votes());
		}

		await pqueueSettled(promises);
	}
}
