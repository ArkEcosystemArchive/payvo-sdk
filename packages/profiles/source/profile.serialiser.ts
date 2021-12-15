import { IProfile, IProfileData, IProfileExportOptions, IProfileSerialiser } from "./contracts.js";

export class ProfileSerialiser implements IProfileSerialiser {
	readonly #profile: IProfile;

	public constructor(profile: IProfile) {
		this.#profile = profile;
	}

	/** {@inheritDoc IProfileSerialiser.toJSON} */
	public toJSON(
		options: IProfileExportOptions = {
			addNetworkInformation: true,
			excludeEmptyWallets: false,
			excludeLedgerWallets: false,
			saveGeneralSettings: true,
		},
	): IProfileData {
		if (!options.saveGeneralSettings) {
			throw new Error("This is not implemented yet");
		}

		return {
			contacts: this.#profile.contacts().toObject(),
			data: this.#profile.data().all(),
			exchangeTransactions: this.#profile.exchangeTransactions().toObject(),
			id: this.#profile.id(),
			notifications: this.#profile.notifications().all(),
			plugins: this.#profile.plugins().all(),
			settings: this.#profile.settings().all(),
			wallets: this.#profile.wallets().toObject(options),
		};
	}
}
