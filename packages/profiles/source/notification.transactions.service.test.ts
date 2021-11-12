import "jest-extended";
import "reflect-metadata";
import nock from "nock";

import { identity } from "../test/fixtures/identity";
import { bootContainer, importByMnemonic } from "../test/mocking";
import { Profile } from "./profile";

import { NotificationRepository } from "./notification.repository";
import { ProfileTransactionNotificationService } from "./notification.transactions.service";
import { INotificationTypes, IProfileTransactionNotificationService } from "./notification.repository.contract";
import { IProfile } from "./profile.contract";
import { ExtendedConfirmedTransactionData } from "./transaction.dto";
import { ProfileSetting } from "./profile.enum.contract";
const NotificationTransactionFixtures = require("../test/fixtures/client/notification-transactions.json");

const includedTransactionNotificationId = NotificationTransactionFixtures.data[1].id;
const excludedTransactionNotificationId = NotificationTransactionFixtures.data[3].id;

let notificationsRepository: NotificationRepository;
let subject: IProfileTransactionNotificationService;
let profile: IProfile;

describe("ProfileTransactionNotificationService", () => {
	beforeAll(async () => {
		bootContainer();

		nock.disableNetConnect();

		nock(/.+/)
			.get("/api/node/configuration/crypto")
			.reply(200, require("../test/fixtures/client/cryptoConfiguration.json"))
			.get("/api/node/configuration")
			.reply(200, require("../test/fixtures/client/configuration.json"))
			.get("/api/peers")
			.reply(200, require("../test/fixtures/client/peers.json"))
			.get("/api/node/syncing")
			.reply(200, require("../test/fixtures/client/syncing.json"))
			.get("/api/wallets/D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW")
			.reply(200, require("../test/fixtures/client/wallet.json"))
			.persist();
	});

	beforeEach(async () => {
		profile = new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" });
		await importByMnemonic(profile, identity.mnemonic, "ARK", "ark.devnet");

		notificationsRepository = new NotificationRepository(profile);
		subject = new ProfileTransactionNotificationService(profile, notificationsRepository);
	});

	test("#recent", async () => {
		nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		await subject.sync({ limit: 20 });

		expect(subject.recent()).toHaveLength(2);
		expect(subject.recent(10)).toHaveLength(2);

		await subject.sync();
		expect(subject.recent(1)).toHaveLength(1);
	});

	test("#sync", async () => {
		nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		profile.settings().set(ProfileSetting.UseTestNetworks, true);

		await subject.sync({ limit: 10 });

		expect(subject.transactions()).toHaveLength(2);
		expect(subject.has(excludedTransactionNotificationId)).toBeFalse();
		expect(subject.has(includedTransactionNotificationId)).toBeTrue();
	});

	test("should return empty responses for test networks", async () => {
		nock(/.+/)
			.get("/api/transactions")
			.query(true)
			.reply(200, require("../test/fixtures/client/transactions-empty.json"));

		profile.settings().set(ProfileSetting.UseTestNetworks, false);

		await subject.sync();

		expect(subject.transactions()).toHaveLength(0);
		expect(subject.has(excludedTransactionNotificationId)).toBeFalse();
		expect(subject.has(includedTransactionNotificationId)).toBeFalse();
	});

	test("#has", async () => {
		nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		await subject.sync();

		expect(subject.has(excludedTransactionNotificationId)).toBeFalse();
		expect(subject.has(includedTransactionNotificationId)).toBeTrue();
	});

	test("#findByTransactionId", async () => {
		nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		await subject.sync();

		expect(subject.findByTransactionId(includedTransactionNotificationId)).toBeTruthy();
		expect(subject.findByTransactionId("unknown")).toBeUndefined();
	});

	test("#forget", async () => {
		nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		await subject.sync();

		expect(subject.findByTransactionId(includedTransactionNotificationId)).toBeTruthy();

		subject.forget("unknown");
		subject.forget(includedTransactionNotificationId);

		expect(subject.findByTransactionId(includedTransactionNotificationId)).toBeUndefined();
	});

	test("#forgetByRecipient", async () => {
		nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures).persist();

		await subject.sync({ limit: 20 });
		const wallet = profile.wallets().first();
		expect(subject.has(includedTransactionNotificationId)).toBeTrue();
		expect(subject.transactions()).toHaveLength(2);

		subject.forgetByRecipient("unknown");

		expect(subject.has(includedTransactionNotificationId)).toBeTrue();

		subject.forgetByRecipient(wallet.address());

		expect(subject.has(includedTransactionNotificationId)).toBeFalse();
		expect(subject.transactions()).toHaveLength(0);
	});

	test("#markAsRead", async () => {
		nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		await subject.sync({ limit: 20 });

		const notification = subject.findByTransactionId(includedTransactionNotificationId);
		expect(notification?.read_at).toBeUndefined();

		subject.markAsRead("unknown");
		subject.markAsRead(includedTransactionNotificationId);

		expect(subject.findByTransactionId(includedTransactionNotificationId)?.read_at).toBeTruthy();
	});

	test("#transactions", async () => {
		nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		await subject.sync({ limit: 20 });

		expect(subject.transactions()).toHaveLength(2);
		expect(subject.transactions(1)).toHaveLength(1);
	});

	test("#transactions", async () => {
		nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		await subject.sync({ limit: 20 });

		expect(subject.transaction(includedTransactionNotificationId)).toBeInstanceOf(ExtendedConfirmedTransactionData);
	});

	test("should handle undefined timestamp", async () => {
		nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		const transactions = await profile.transactionAggregate().received({ limit: 10 });
		const transaction = transactions.findById(
			NotificationTransactionFixtures.data[2].id,
		) as ExtendedConfirmedTransactionData;

		jest.spyOn(transaction, "timestamp").mockReturnValue(undefined);
		jest.spyOn(profile.transactionAggregate(), "received").mockResolvedValue(transactions);

		await subject.sync();
		expect(subject.recent(10)).toHaveLength(2);
		expect(subject.recent()).toHaveLength(2);
		expect(subject.transactions()).toHaveLength(2);

		jest.restoreAllMocks();

		await subject.sync();
		expect(subject.recent(10)).toHaveLength(2);
		expect(subject.recent()).toHaveLength(2);
	});

	test("#markAllAsRead", async () => {
		nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		await subject.sync({ limit: 20 });
		notificationsRepository.push({
			type: INotificationTypes.Release,
			meta: { version: "3.0.0" },
		});

		expect(notificationsRepository.unread()).toHaveLength(3);
		expect(subject.recent()).toHaveLength(2);
		subject.markAllAsRead();
		expect(notificationsRepository.unread()).toHaveLength(1);
	});

	test("#isSyncing", async () => {
		nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		expect(subject.isSyncing()).toBeFalse();
		await subject.sync({ limit: 20 });
	});
});
