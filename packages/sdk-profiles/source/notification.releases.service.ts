import { IWalletReleaseNotifications, IProfile, INotificationTypes, INotification } from "./contracts";
import { Except } from "type-fest";
import { INotificationRepository } from "./notification.repository.contract";

export class WalletReleaseNotifications implements IWalletReleaseNotifications {
	readonly #notifications: INotificationRepository;
	readonly #defaultLimit: number;

	public constructor(notificationRepository: INotificationRepository) {
		this.#defaultLimit = 10;
		this.#notifications = notificationRepository;
	}

	private format = (notification: INotification): Partial<Except<INotification, "id">> => ({
		...notification,
		type: INotificationTypes.Release,
		action: "update",
		read_at: undefined,
	});

	/** {@inheritDoc IWalletReleaseNotifications.findByVersion} */
	public findByVersion = (version: string) => {
		return this.#notifications.findByVersion(version);
	};

	/** {@inheritDoc IWalletReleaseNotifications.has} */
	public has = (version: string) => {
		return !!this.findByVersion(version);
	};

	/** {@inheritDoc IWalletReleaseNotifications.push} */
	public push = (notification: INotification) => {
		if (!notification.meta?.version) {
			return;
		}

		if (this.has(notification.meta.version)) {
			return;
		}

		return this.#notifications.push(this.format(notification));
	};

	/** {@inheritDoc IWalletReleaseNotifications.markAsRead} */
	public markAsRead = (version: string) => {
		const notification = this.findByVersion(version);

		if (!notification) {
			return;
		}

		this.#notifications.markAsRead(notification.id);
	};

	/** {@inheritDoc IWalletReleaseNotifications.forget} */
	public forget = (version: string) => {
		const notification = this.findByVersion(version);

		if (!notification) {
			return;
		}

		return this.#notifications.forget(notification.id);
	};

	/** {@inheritDoc IWalletReleaseNotifications.recent} */
	public recent = (limit?: number) => {
		const releases = this.#notifications.filterByType(INotificationTypes.Release);
		return releases.slice(0, limit || this.#defaultLimit);
	};
}
