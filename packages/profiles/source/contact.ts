import yup from "yup";

import { ContactAddressRepository } from "./contact-address.repository";
import { IContact, IContactAddressInput, IContactAddressRepository, IContactData, IProfile } from "./contracts.js";
import { Avatar } from "./helpers/avatar.js";

export class Contact implements IContact {
	readonly #profile: IProfile;
	readonly #id: string;
	#name: string;
	#addresses: ContactAddressRepository;
	#starred: boolean;

	#avatar: string;

	public constructor({ id, name, starred }: Omit<IContactData, "addresses">, profile: IProfile) {
		this.#profile = profile;
		this.#id = id;
		this.#name = name;
		this.#starred = starred;
		this.#avatar = Avatar.make(name);
		this.#addresses = new ContactAddressRepository(profile);
	}

	/** {@inheritDoc IContact.id} */
	public id(): string {
		return this.#id;
	}

	/** {@inheritDoc IContact.name} */
	public name(): string {
		return this.#name;
	}

	/** {@inheritDoc IContact.addresses} */
	public addresses(): IContactAddressRepository {
		return this.#addresses;
	}

	/** {@inheritDoc IContact.isStarred} */
	public isStarred(): boolean {
		return this.#starred;
	}

	/** {@inheritDoc IContact.toggleStarred} */
	public toggleStarred(): void {
		this.#starred = !this.isStarred();

		this.#profile.status().markAsDirty();
	}

	/** {@inheritDoc IContact.setAvatar} */
	public setAvatar(value: string): void {
		this.#avatar = value;

		this.#profile.status().markAsDirty();
	}

	/** {@inheritDoc IContact.setName} */
	public setName(name: string): void {
		this.#name = name;

		this.setAvatar(Avatar.make(name));
	}

	/** {@inheritDoc IContact.setAddresses} */
	public setAddresses(addresses: IContactAddressInput[]): void {
		this.#validate({ ...this.toObject(), addresses });

		this.#addresses.flush();

		for (const address of addresses) {
			this.#addresses.create(address);
		}

		this.#profile.status().markAsDirty();
	}

	/** {@inheritDoc IContact.avatar} */
	public avatar(): string {
		return this.#avatar;
	}

	/** {@inheritDoc IContact.toObject} */
	public toObject(): IContactData {
		return {
			id: this.id(),
			name: this.name(),
			starred: this.isStarred(),
			addresses: this.addresses().toArray(),
		};
	}

	#validate(data: Omit<IContactData, "addresses"> & { addresses: IContactAddressInput[] }): void {
		yup.object({
			id: yup.string().required(),
			name: yup.string().required(),
			addresses: yup
				.array()
				.min(1)
				.of(
					yup.object({
						coin: yup.string().required(),
						network: yup.string().required(),
						address: yup.string().required(),
					}),
				),
			starred: yup.boolean().required(),
		}).validateSync(data, { stripUnknown: true });
	}
}
