import { AddressDataTransferObject } from "./address.contract.js";

export interface WalletDiscoveryService {
	fromMnemonic(mnemonic: string): Promise<AddressDataTransferObject[]>;
}
