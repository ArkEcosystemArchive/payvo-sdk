/* istanbul ignore file */

import { inject, injectable, preDestroy } from "inversify";

import { WalletData } from "../contracts";
import { NotImplemented } from "../exceptions";
import { BindingType } from "../ioc/service-provider.contract";
import { DataTransferObjectService } from "./data-transfer-object.contract";
import { LedgerService, LedgerTransportFactory, LedgerWalletList } from "./ledger.contract";

@injectable()
export class AbstractLedgerService implements LedgerService {
	@inject(BindingType.LedgerTransportFactory)
	protected readonly ledgerTransportFactory!: LedgerTransportFactory;

	@inject(BindingType.DataTransferObjectService)
	private readonly dataTransferObjectService!: DataTransferObjectService;

	public async connect(): Promise<void> {
		throw new NotImplemented(this.constructor.name, this.connect.name);
	}

	@preDestroy()
	public async disconnect(): Promise<void> {
		//
	}

	public async getVersion(): Promise<string> {
		throw new NotImplemented(this.constructor.name, this.getVersion.name);
	}

	public async getPublicKey(path: string): Promise<string> {
		throw new NotImplemented(this.constructor.name, this.getPublicKey.name);
	}

	public async getExtendedPublicKey(path: string): Promise<string> {
		throw new NotImplemented(this.constructor.name, this.getExtendedPublicKey.name);
	}

	public async signTransaction(path: string, payload: Buffer): Promise<string> {
		throw new NotImplemented(this.constructor.name, this.signTransaction.name);
	}

	public async signMessage(path: string, payload: Buffer): Promise<string> {
		throw new NotImplemented(this.constructor.name, this.signMessage.name);
	}

	public async scan(options?: { useLegacy: boolean }): Promise<LedgerWalletList> {
		throw new NotImplemented(this.constructor.name, this.scan.name);
	}

	public async isNanoS(): Promise<boolean> {
		return false;
	}

	public async isNanoX(): Promise<boolean> {
		return false;
	}

	protected mapPathsToWallets(
		addressCache: Record<string, { address: string; publicKey: string }>,
		wallets: WalletData[],
	): LedgerWalletList {
		let foundFirstCold = false;
		const ledgerWallets: LedgerWalletList = {};

		for (const [path, { address, publicKey }] of Object.entries(addressCache)) {
			const matchingWallet: WalletData | undefined = wallets.find(
				(wallet: WalletData) => wallet.address() === address,
			);

			if (matchingWallet === undefined) {
				if (foundFirstCold) {
					continue;
				}
				foundFirstCold = true;

				ledgerWallets[path] = this.dataTransferObjectService.wallet({
					address,
					balance: 0,
					publicKey,
				});
			} else {
				ledgerWallets[path] = matchingWallet;
			}
		}
		return ledgerWallets;
	}
}
