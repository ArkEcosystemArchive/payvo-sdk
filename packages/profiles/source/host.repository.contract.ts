import { Networks } from "@payvo/sdk";

export type Host = Networks.NetworkHost;
export type HostSet = Host[];
export type HostMap = Record<string, HostSet>;

export interface IHostRepository {
	all(): HostMap;

	allByNetwork(network: string): HostSet;

	push(network: string, host: Host): HostSet;

	fill(entries: object): void;

	forget(network: string, index?: number): void;
}
