import { IProfileTransactionNotifications, IProfile, INotificationTypes, ITransactionNotification } from "./contracts";
import { sortByDesc } from "@arkecosystem/utils";
import { Except } from "type-fest";
import { ExtendedConfirmedTransactionData } from "./transaction.dto";
import { AggregateQuery } from "./transaction.aggregate.contract";
import { INotificationRepository } from "./notification.repository.contract";

export class ProfileTransactionNotifications implements IProfileTransactionNotifications {
	readonly #profile: IProfile;
	readonly #allowedTypes: string[];
	readonly #notifications: INotificationRepository;
	readonly #defaultLimit: number;

	#transactions: ExtendedConfirmedTransactionData[];
	#isSyncing: boolean;

	public constructor(profile: IProfile, notificationRepository: INotificationRepository) {
		this.#defaultLimit = 10;
		this.#profile = profile;
		this.#allowedTypes = ["transfer", "multiPayment"];
		this.#notifications = notificationRepository;
		this.#transactions = [];
		this.#isSyncing = false;
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

	private storeTransactions = (transactions: ExtendedConfirmedTransactionData[]) => {
		for (const transaction of transactions) {
			if (this.has(transaction.id())) {
				this.#transactions.push(transaction);
			}
		}
	};

	/** {@inheritDoc IProfileTransactionNotifications.findByTransactionId} */
	public findByTransactionId = (transactionId: string) => {
		return this.#notifications.findByTransactionId(transactionId);
	};

	/** {@inheritDoc IProfileTransactionNotifications.has} */
	public has = (transactionId: string) => {
		return !!this.#notifications.findByTransactionId(transactionId);
	};

	/** {@inheritDoc IProfileTransactionNotifications.forget} */
	public forget = (transactionId: string): void => {
		for (const { id, meta } of this.#notifications.values()) {
			if (transactionId === meta.transactionId) {
				this.#notifications.forget(id);
			}
		}
	};

	/** {@inheritDoc IProfileTransactionNotifications.recent} */
	public recent = (limit?: number) => {
		const notifications = this.#notifications.filterByType(INotificationTypes.Transaction);
		const sorted = sortByDesc(notifications, (notification) => notification.meta.timestamp);

		return sorted.slice(0, limit || this.#defaultLimit);
	};

	/** {@inheritDoc IProfileTransactionNotifications.markAsRead} */
	public markAsRead = (transactionId: string) => {
		const notification = this.findByTransactionId(transactionId);

		if (!notification) {
			return;
		}

		this.#notifications.markAsRead(notification.id);
	};

	/** {@inheritDoc IProfileTransactionNotifications.markAllAsRead} */
	public markAllAsRead = () => {
		const unread = this.#notifications.unread();

		for (const notification of unread) {
			if (notification.type === INotificationTypes.Transaction) {
				this.#notifications.markAsRead(notification.id);
			}
		}
	};

	/** {@inheritDoc IProfileTransactionNotifications.sync} */
	public sync = async (queryInput?: AggregateQuery) => {
		const query = {
			cursor: 1,
			limit: this.#defaultLimit,
			...(queryInput && queryInput),
		};

		this.#isSyncing = true;

		const transactions = await this.#profile.transactionAggregate().received(query);
		const unseen = this.filterUnseen(transactions.items());

		for (const transaction of unseen) {
			this.#notifications.push(this.format(transaction));
		}

		this.storeTransactions(transactions.items());

		this.#isSyncing = false;
	};

	/** {@inheritDoc IProfileTransactionNotifications.transactions} */
	public transactions = (limit?: number): ExtendedConfirmedTransactionData[] => {
		const sorted = sortByDesc(this.#transactions, (transaction) => transaction.timestamp()?.toUNIX());

		return sorted.slice(0, limit || this.#defaultLimit);
	};

	/** {@inheritDoc IProfileTransactionNotifications.transaction} */
	public transaction = (transactionId: string) => {
		return this.transactions().find((transaction) => transaction.id() === transactionId);
	};

	/** {@inheritDoc IProfileTransactionNotifications.isSyncing} */
	public isSyncing = (): boolean => {
		return this.#isSyncing;
	};
}
