import { Networks } from "@payvo/sdk";

export type Host = Networks.NetworkHost;
export type HostSet = { host: Host }[];
export type HostMap = Record<string, HostSet>;

export interface IHostRepository {
	all(): HostMap;

	allByNetwork(network: string): HostSet;

	push(data: { host: Host; network: string }): HostSet;

	fill(entries: object): void;

	forget(network: string, index?: number): void;
}
