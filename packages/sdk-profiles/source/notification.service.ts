import { IProfile } from "./contracts";
import {
	IProfileTransactionNotifications,
	IProfileNotifications,
	INotificationRepository,
	INotificationType,
	IWalletReleaseNotifications,
} from "./notification.repository.contract";

import { NotificationRepository } from "./notification.repository";
import { ProfileTransactionNotifications } from "./notification.transactions.service";
import { WalletReleaseNotifications } from "./notification.releases.service";

export class ProfileNotifications implements IProfileNotifications {
	readonly #transactions: IProfileTransactionNotifications;
	readonly #releases: IWalletReleaseNotifications;
	readonly #notificationRepository: INotificationRepository;

	public constructor(profile: IProfile) {
		this.#notificationRepository = new NotificationRepository(profile);
		this.#transactions = new ProfileTransactionNotifications(profile, this.#notificationRepository);
		this.#releases = new WalletReleaseNotifications(this.#notificationRepository);
	}

	/** {@inheritDoc IProfileNotifications.transactions} */
	public transactions = (): IProfileTransactionNotifications => {
		return this.#transactions;
	};

	/** {@inheritDoc IProfileNotifications.releases} */
	public releases = (): IWalletReleaseNotifications => {
		return this.#releases;
	};

	/** {@inheritDoc IProfileNotifications.markAsRead} */
	public markAsRead = (id: string): void => {
		return this.#notificationRepository.markAsRead(id);
	};

	/** {@inheritDoc IProfileNotifications.get} */
	public get = (id: string) => {
		return this.#notificationRepository.get(id);
	};

	/** {@inheritDoc IProfileNotifications.hasUnread} */
	public hasUnread = (): boolean => {
		return this.#notificationRepository.unread().length > 0;
	};

	/** {@inheritDoc IProfileNotifications.filterByType} */
	public filterByType = (type: INotificationType) => {
		return this.#notificationRepository.filterByType(type);
	};

	/** {@inheritDoc IProfileNotifications.all} */
	public all = () => {
		return this.#notificationRepository.all();
	};

	/** {@inheritDoc IProfileNotifications.count} */
	public count = () => {
		return this.#notificationRepository.count();
	};

	/** {@inheritDoc IProfileNotifications.flush} */
	public flush = () => {
		return this.#notificationRepository.flush();
	};

	/** {@inheritDoc IProfileNotifications.filll} */
	public fill = (entries: object) => {
		return this.#notificationRepository.fill(entries);
	};
}
