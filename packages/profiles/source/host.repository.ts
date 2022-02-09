import { DataRepository } from "./data.repository.js";
import { Host, HostMap, HostSet, IHostRepository } from "./host.repository.contract.js";
import { IProfile } from "./profile.contract.js";

export class HostRepository implements IHostRepository {
	readonly #profile: IProfile;
	#data: DataRepository = new DataRepository();

	public constructor(profile: IProfile) {
		this.#profile = profile;
	}

	/** {@inheritDoc IHostRepository.all} */
	public all(): HostMap {
		return this.#data.all() as HostMap;
	}

	/** {@inheritDoc HostRepository.get} */
	public get(network: string): HostSet {
		const hosts: HostSet | undefined = this.#data.get(network);

		if (!hosts) {
			throw new Error(`Failed to find hosts that match [${network}].`);
		}

		return hosts;
	}

	/** {@inheritDoc HostRepository.push} */
	public push(network: string, host: Host): HostSet {
		if (!this.#data.has(network)) {
			this.#data.set(network, []);
		}

		host.custom = true;

		this.#data.get<HostSet>(network)?.push(host);

		this.#profile.status().markAsDirty();

		return this.get(network);
	}

	/** {@inheritDoc HostRepository.fill} */
	public fill(entries: object): void {
		this.#data.fill(entries);
	}

	/** {@inheritDoc HostRepository.forget} */
	public forget(network: string, index?: number): void {
		this.get(network);

		if (index) {
			this.#data.forgetIndex(network, index);
		} else {
			this.#data.forget(network);
		}

		this.#profile.status().markAsDirty();
	}
}
