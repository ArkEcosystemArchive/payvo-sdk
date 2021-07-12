import { IProfile } from "./contracts";
import {
	IProfileTransactionNotificationService,
	IProfileNotifications,
	INotificationRepository,
	INotificationType,
	IWalletReleaseNotificationService,
} from "./notification.repository.contract";

import { NotificationRepository } from "./notification.repository";
import { ProfileTransactionNotificationService } from "./notification.transactions.service";
import { WalletReleaseNotificationService } from "./notification.releases.service";

export class ProfileNotifications implements IProfileNotifications {
	readonly #transactions: IProfileTransactionNotificationService;
	readonly #releases: IWalletReleaseNotificationService;
	readonly #notificationRepository: INotificationRepository;

	public constructor(profile: IProfile) {
		this.#notificationRepository = new NotificationRepository(profile);
		this.#transactions = new ProfileTransactionNotificationService(profile, this.#notificationRepository);
		this.#releases = new WalletReleaseNotificationService(this.#notificationRepository);
	}

	/** {@inheritDoc IProfileNotifications.all} */
	public all () {
		return this.#notificationRepository.all();
	}

	/** {@inheritDoc IProfileNotifications.get} */
	public get (id: string) {
		return this.#notificationRepository.get(id);
	}

	/** {@inheritDoc IProfileNotifications.hasUnread} */
	public hasUnread (): boolean {
		return this.#notificationRepository.unread().length > 0;
	}

	/** {@inheritDoc IProfileNotifications.flush} */
	public flush () {
		return this.#notificationRepository.flush();
	}

	/** {@inheritDoc IProfileNotifications.filll} */
	public fill (entries: object) {
		return this.#notificationRepository.fill(entries);
	}

	/** {@inheritDoc IProfileNotifications.count} */
	public count () {
		return this.#notificationRepository.count();
	}

	/** {@inheritDoc IProfileNotifications.markAsRead} */
	public markAsRead (id: string): void {
		return this.#notificationRepository.markAsRead(id);
	}

	/** {@inheritDoc IProfileNotifications.transactions} */
	public transactions (): IProfileTransactionNotificationService {
		return this.#transactions;
	}

	/** {@inheritDoc IProfileNotifications.releases} */
	public releases (): IWalletReleaseNotificationService {
		return this.#releases;
	}

	/** {@inheritDoc IProfileNotifications.filterByType} */
	public filterByType (type: INotificationType) {
		return this.#notificationRepository.filterByType(type);
	}
}
