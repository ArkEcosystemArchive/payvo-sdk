import { IProfile, IProfileDumper, IProfileInput } from "./contracts.js";

export class ProfileDumper implements IProfileDumper {
    readonly #profile: IProfile;

    public constructor(profile: IProfile) {
        this.#profile = profile;
    }

    /** {@inheritDoc IProfileDumper.dump} */
    public dump(): IProfileInput {
        if (!this.#profile.getAttributes().get<string>("data")) {
            throw new Error(
                `The profile [${this.#profile.name()}] has not been encoded or encrypted. Please call [save] before dumping.`,
            );
        }

        return {
            id: this.#profile.id(),
            name: this.#profile.name(),
            avatar: this.#profile.avatar(),
            password: this.#profile.getAttributes().get<string>("password"),
            data: this.#profile.getAttributes().get<string>("data"),
            appearance: this.#profile.appearance().all(),
        };
    }
}
