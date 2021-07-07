import { IProfileTransactionNotifications, IProfile, INotificationTypes, ITransactionNotification } from "./contracts";
import { sortByDesc } from "@arkecosystem/utils";
import { Except } from "type-fest";
import { ExtendedConfirmedTransactionData } from "./transaction.dto";
import { AggregateQuery } from "./transaction.aggregate.contract";
import { INotification, INotificationRepository } from "./notification.repository.contract";

export class ProfileTransactionNotifications implements IProfileTransactionNotifications {
	readonly #profile: IProfile;
	readonly #allowedTypes: string[];
	readonly #notifications: INotificationRepository;

	public constructor(profile: IProfile, notificationRepository: INotificationRepository) {
		this.#profile = profile;
		this.#allowedTypes = ["transfer", "multiPayment"];
		this.#notifications = notificationRepository;
	}

	private format = (
		transaction: ExtendedConfirmedTransactionData,
	): Partial<Except<ITransactionNotification, "id">> => ({
		meta: {
			timestamp: transaction.timestamp()?.toUNIX(),
			transactionId: transaction.id(),
		},
		type: INotificationTypes.Transaction,
		read_at: undefined,
	});

	private isRecipient = (transaction: ExtendedConfirmedTransactionData) => {
		const recipients = [transaction.recipient(), ...transaction.recipients().map((recipient) => recipient.address)];

		return recipients.some((address: string) => !!this.#profile.wallets().findByAddress(address));
	};

	private filterUnseen = (transactions: ExtendedConfirmedTransactionData[]) => {
		const unseen: ExtendedConfirmedTransactionData[] = [];

		for (const transaction of transactions) {
			if (!this.#allowedTypes.includes(transaction.type())) {
				continue;
			}

			if (!this.isRecipient(transaction)) {
				continue;
			}

			if (this.has(transaction.id())) {
				continue;
			}

			unseen.push(transaction);
		}

		return unseen;
	};

	/** {@inheritDoc IProfileTransactionNotifications.findByTransactionId} */
	public findByTransactionId = (transactionId: string): INotification | undefined => {
		return this.#notifications.findByTransactionId(transactionId);
	};

	/** {@inheritDoc IProfileTransactionNotifications.has} */
	public has = (transactionId: string) => {
		return !!this.#notifications.findByTransactionId(transactionId);
	};

	/** {@inheritDoc IProfileTransactionNotifications.forget} */
	public forget = (transactionId: string): void => {
		for (const { id, meta } of this.#notifications.values()) {
			if (transactionId === meta?.transactionId) {
				this.#notifications.forget(id);
			}
		}
	};

	/** {@inheritDoc IProfileTransactionNotifications.recent} */
	public recent = (limit: number = 10) => {
		const notifications = this.#notifications.filterByType(INotificationTypes.Transaction);
		const sorted = sortByDesc(notifications, (notification) => notification?.meta?.timestamp);

		return sorted.slice(0, limit);
	};

	/** {@inheritDoc IProfileTransactionNotifications.markAsRead} */
	public markAsRead = (transactionId: string) => {
		const notification = this.findByTransactionId(transactionId);

		if (!notification) {
			return;
		}

		this.#notifications.markAsRead(notification.id);
	};

	/** {@inheritDoc IProfileTransactionNotifications.sync} */
	public sync = async (query: AggregateQuery = {}): Promise<void> => {
		const defaultQuery = {
			addresses: this.#profile
				.wallets()
				.values()
				.map((wallet) => wallet.address()),
			cursor: 1,
			limit: 10,
		};

		const transactions = await this.#profile.transactionAggregate().received({ ...defaultQuery, ...query });
		const unseen = this.filterUnseen(transactions.items());

		for (const transaction of unseen) {
			this.#notifications.push(this.format(transaction));
		}
	};
}
