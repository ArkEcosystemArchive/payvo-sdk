import { IWalletReleaseNotifications, IProfile, INotificationTypes, INotification } from "./contracts";
import { Except } from "type-fest";
import { INotificationRepository } from "./notification.repository.contract";

export class WalletReleaseNotifications implements IWalletReleaseNotifications {
	readonly #notifications: INotificationRepository;

	public constructor(notificationRepository: INotificationRepository) {
		this.#notifications = notificationRepository;
	}

	private format = (notification: INotification): Partial<Except<INotification, "id">> => ({
		...notification,
		type: INotificationTypes.Release,
		action: "update",
	});

	/** {@inheritDoc IWalletReleaseNotifications.findByVersion} */
	public findByVersion = (version: string): INotification | undefined => {
		return this.#notifications.findByVersion(version);
	};

	/** {@inheritDoc IWalletReleaseNotifications.has} */
	public has = (version: string) => {
		return !!this.findByVersion(version);
	};

	/** {@inheritDoc IWalletReleaseNotifications.push} */
	public push = (notification: INotification): INotification | undefined => {
		if (this.has(notification?.meta?.version)) {
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
	public forget = (version: string): void => {
		const notification = this.findByVersion(version);

		if (!notification) {
			return;
		}

		this.#notifications.forget(notification.id);
	};
}
