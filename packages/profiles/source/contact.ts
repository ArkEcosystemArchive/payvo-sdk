import Joi from "joi";

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
		const { error } = Joi.object({
			id: Joi.string().required(),
			name: Joi.string().required(),
			addresses: Joi.array()
				.min(1)
				.items(
					Joi.object({
						coin: Joi.string().required(),
						network: Joi.string().required(),
						address: Joi.string().required(),
					}),
				),
			starred: Joi.boolean().required(),
		}).validate(data, { stripUnknown: true, allowUnknown: true });

		if (error !== undefined) {
			throw error;
		}
	}
}
