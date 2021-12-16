import { AES,Base64 } from "@payvo/sdk-cryptography";

import { IProfile, IProfileData, IProfileEncrypter } from "./contracts.js";

export class ProfileEncrypter implements IProfileEncrypter {
	readonly #profile: IProfile;

	public constructor(profile: IProfile) {
		this.#profile = profile;
	}

	/** {@inheritDoc IProfileEncrypter.encrypt} */
	public encrypt(unencrypted: string, password?: string): string {
		if (typeof password !== "string") {
			password = this.#profile.password().get();
		}

		if (!this.#profile.auth().verifyPassword(password)) {
			throw new Error("The password did not match our records.");
		}

		return AES.encrypt(unencrypted, password);
	}

	/** {@inheritDoc IProfileEncrypter.decrypt} */
	public decrypt(password: string): IProfileData {
		if (!this.#profile.usesPassword()) {
			throw new Error("This profile does not use a password but password was passed for decryption");
		}

		const { id, data } = JSON.parse(
			AES.decrypt(Base64.decode(this.#profile.getAttributes().get<string>("data")), password),
		);

		return { id, ...data };
	}
}
