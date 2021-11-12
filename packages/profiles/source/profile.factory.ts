import { UUID } from "@payvo/sdk-cryptography";

import { IProfile, IProfileFactory } from "./contracts";
import { Profile } from "./profile";

export class ProfileFactory implements IProfileFactory {
	/** {@inheritDoc IProfileFactory.fromName} */
	public static fromName(name: string): IProfile {
		return new Profile({ data: "", id: UUID.random(), name });
	}
}
