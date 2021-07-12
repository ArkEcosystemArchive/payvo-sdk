import { IProfileTransactionNotificationService, IProfile, INotificationTypes, ITransactionNotification } from "./contracts";
import { sortByDesc } from "@arkecosystem/utils";
import { Except } from "type-fest";
import { ExtendedConfirmedTransactionData } from "./transaction.dto";
import { AggregateQuery } from "./transaction.aggregate.contract";
import { INotificationRepository } from "./notification.repository.contract";

export class ProfileTransactionNotificationService implements IProfileTransactionNotificationService {
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

	/** {@inheritDoc IProfileTransactionNotificationService.findByTransactionId} */
	public findByTransactionId (transactionId: string) {
		return this.#notifications.findByTransactionId(transactionId);
	}

	/** {@inheritDoc IProfileTransactionNotificationService.has} */
	public has (transactionId: string) {
		return !!this.#notifications.findByTransactionId(transactionId);
	}

	/** {@inheritDoc IProfileTransactionNotificationService.forget} */
	public forget (transactionId: string): void {
		for (const { id, meta } of this.#notifications.values()) {
			if (transactionId === meta.transactionId) {
				this.#notifications.forget(id);
			}
		}
	}

	/** {@inheritDoc IProfileTransactionNotificationService.recent} */
	public recent (limit?: number) {
		const notifications = this.#notifications.filterByType(INotificationTypes.Transaction);

		return sortByDesc(notifications, (notification) => notification.meta.timestamp)
			.slice(0, limit || this.#defaultLimit);
	}

	/** {@inheritDoc IProfileTransactionNotificationService.markAsRead} */
	public markAsRead (transactionId: string) {
		const notification = this.findByTransactionId(transactionId);

		if (!notification) {
			return;
		}

		this.#notifications.markAsRead(notification.id);
	}

	/** {@inheritDoc IProfileTransactionNotificationService.markAllAsRead} */
	public markAllAsRead () {
		const unread = this.#notifications.unread();

		for (const notification of unread) {
			if (notification.type === INotificationTypes.Transaction) {
				this.#notifications.markAsRead(notification.id);
			}
		}
	}

	/** {@inheritDoc IProfileTransactionNotificationService.sync} */
	public async sync(queryInput?: AggregateQuery) {
		this.#isSyncing = true;

		const transactions = await this.#profile.transactionAggregate().received({
			cursor: 1,
			limit: this.#defaultLimit,
			...(queryInput && queryInput),
		});

		for (const transaction of this.#filterUnseen(transactions.items())) {
			this.#notifications.push(this.#format(transaction));
		}

		this.#storeTransactions(transactions.items());

		this.#isSyncing = false;
	}

	/** {@inheritDoc IProfileTransactionNotificationService.transactions} */
	public transactions (limit?: number): ExtendedConfirmedTransactionData[] {
		return sortByDesc(this.#transactions, (transaction) => transaction.timestamp()?.toUNIX())
			.slice(0, limit || this.#defaultLimit);
	}

	/** {@inheritDoc IProfileTransactionNotificationService.transaction} */
	public transaction (transactionId: string) {
		return this.transactions().find((transaction) => transaction.id() === transactionId);
	}

	/** {@inheritDoc IProfileTransactionNotificationService.isSyncing} */
	public isSyncing (): boolean {
		return this.#isSyncing;
	}


	#format(
		transaction: ExtendedConfirmedTransactionData,
	): Partial<Except<ITransactionNotification, "id">> {
		return {
			meta: {
				timestamp: transaction.timestamp()?.toUNIX(),
				transactionId: transaction.id(),
			},
			type: INotificationTypes.Transaction,
			read_at: undefined,
		}
	}

	#isRecipient(transaction: ExtendedConfirmedTransactionData) {
		return [transaction.recipient(), ...transaction.recipients().map((recipient) => recipient.address)].some((address: string) => !!this.#profile.wallets().findByAddress(address));
	}

	#filterUnseen(transactions: ExtendedConfirmedTransactionData[]) {
		const unseen: ExtendedConfirmedTransactionData[] = [];

		for (const transaction of transactions) {
			if (!this.#allowedTypes.includes(transaction.type())) {
				continue;
			}

			if (!this.#isRecipient(transaction)) {
				continue;
			}

			if (this.has(transaction.id())) {
				continue;
			}

			unseen.push(transaction);
		}

		return unseen;
	}

	#hasStoredTransaction(transactionId: string) {
		return !!this.transactions().find((storedTransaction) => storedTransaction.id() === transactionId);
	}

	#storeTransactions(transactions: ExtendedConfirmedTransactionData[]) {
		for (const transaction of transactions) {
			if (this.#hasStoredTransaction(transaction.id())) {
				continue;
			}

			if (!this.has(transaction.id())) {
				continue;
			}

			this.#transactions.push(transaction);
		}
	}

}
