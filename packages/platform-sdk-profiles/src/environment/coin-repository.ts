import { Coins, Contracts } from "@arkecosystem/platform-sdk";

import { DataRepository } from "../repositories/data-repository";
import { ReadOnlyWallet } from "../wallets/read-only-wallet";
import { makeCoin } from "./container.helpers";

export class CoinRepository {
	readonly #dataRepository: DataRepository = new DataRepository();

	public delegates(coin: string, network: string): ReadOnlyWallet[] {
		const result: any[] | undefined = this.#dataRepository.get(`${coin}.${network}.delegates`);

		if (result === undefined) {
			throw new Error(
				`The delegates for [${coin}.${network}] have not been synchronized yet. Please call [syncDelegates] before using this method.`,
			);
		}

		return result.map((delegate) => this.mapDelegate(delegate));
	}

	public findDelegateByAddress(coin: string, network: string, address: string): ReadOnlyWallet {
		return this.findDelegateByAttribute(coin, network, "address", address);
	}

	public findDelegateByPublicKey(coin: string, network: string, publicKey: string): ReadOnlyWallet {
		return this.findDelegateByAttribute(coin, network, "publicKey", publicKey);
	}

	public findDelegateByUsername(coin: string, network: string, username: string): ReadOnlyWallet {
		return this.findDelegateByAttribute(coin, network, "username", username);
	}

	public fees(coin: string, network: string): Contracts.TransactionFees {
		const result: Contracts.TransactionFees | undefined = this.#dataRepository.get(`${coin}.${network}.fees`);

		if (result === undefined) {
			throw new Error(
				`The delegates for [${coin}.${network}.fees] have not been synchronized yet. Please call [syncFees] before using this method.`,
			);
		}

		return result;
	}

	public async syncDelegates(coin: string, network: string): Promise<void> {
		const instance: Coins.Coin = await makeCoin(coin, network);
		const instanceKey = `${coin}.${network}.delegates`;

		let result: Contracts.WalletData[] = [];
		let hasMore = true;
		// TODO: use the nextPage() method as cursor like aggregates
		let cursor = 1;

		while (hasMore) {
			const response = await instance.client().delegates({ cursor });

			result = result.concat(response.items());

			hasMore = response.hasMorePages();

			cursor++;
		}

		this.#dataRepository.set(
			instanceKey,
			result.map((delegate: Contracts.WalletData) => delegate.toObject()),
		);
	}

	public async syncAllDelegates(coins: Record<string, string[]>): Promise<void> {
		await this.bulkSync("syncDelegates", coins);
	}

	public async syncFees(coin: string, network: string): Promise<void> {
		const instance: Coins.Coin = await makeCoin(coin, network);

		this.#dataRepository.set(`${coin}.${network}.fees`, await instance.fee().all(7));
	}

	public async syncAllFees(coins: Record<string, string[]>): Promise<void> {
		await this.bulkSync("syncFees", coins);
	}

	private async bulkSync(method: string, coins: Record<string, string[]>): Promise<void> {
		const promises: Promise<void>[] = [];

		for (const [coin, networks] of Object.entries(coins)) {
			for (const network of networks) {
				promises.push(this[method](coin, network));
			}
		}

		await Promise.allSettled(promises);
	}

	private findDelegateByAttribute(coin: string, network: string, key: string, value: string): ReadOnlyWallet {
		const result: any = this.delegates(coin, network).find((delegate) => (delegate[key] = value));

		if (result === undefined) {
			throw new Error(`No delegate for ${key} with ${value} could be found.`);
		}

		return this.mapDelegate(result);
	}

	private mapDelegate(delegate: Record<string, string>): ReadOnlyWallet {
		return new ReadOnlyWallet({
			address: delegate.address,
			publicKey: delegate.publicKey,
			username: delegate.username,
			rank: (delegate.rank as unknown) as number,
			explorerLink: "",
		});
	}
}
