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
