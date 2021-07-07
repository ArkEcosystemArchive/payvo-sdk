import { IProfile } from "./contracts";
import {
	IProfileTransactionNotifications,
	IProfileNotifications,
	INotificationRepository,
	INotification,
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
	public markAsRead = (key: string): void => {
		return this.#notificationRepository.markAsRead(key);
	};

	/** {@inheritDoc IProfileNotifications.get} */
	public get = (key: string): INotification => {
		return this.#notificationRepository.get(key);
	};

	/** {@inheritDoc IProfileNotifications.hasUnread} */
	public hasUnread = (): Boolean => {
		return this.#notificationRepository.unread().length > 0;
	};

	/** {@inheritDoc IProfileNotifications.filterByType} */
	public filterByType = (type: INotificationType): INotification[] => {
		return this.#notificationRepository.filterByType(type);
	};
}
