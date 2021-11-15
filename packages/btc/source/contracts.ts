export interface UnspentTransaction {
	address: string;
	txId: string;
	outputIndex: number;
	script: string;
	satoshis: number;
	raw: string;
}

export type Status = "used" | "unused" | "unknown";

export interface Bip44Address {
	address: string;
	path: string;
	status: Status;
}

export interface Bip44AddressWithKeys extends Bip44Address {
	publicKey: string;
	privateKey?: string;
}

export interface Levels {
	purpose: number;
	coinType: number;
	account?: number;
	change?: number;
	index?: number;
}

export type BipLevel = "bip44" | "bip49" | "bip84";
