import { assert, describe, Mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";
import {nock} from "@payvo/sdk-test";

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

let notificationsRepository;
let subjectTransactionNotificationService;
let profile;

describe("ProfileTransactionNotificationService", ({ afterEach, beforeEach, test }) => {
	test.before(async () => {
		bootContainer();

		nock.disableNetConnect();

		nock.fake(/.+/)
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

	test.before.each(async () => {
		profile = new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" });
		await importByMnemonic(profile, identity.mnemonic, "ARK", "ark.devnet");

		notificationsRepository = new NotificationRepository(profile);
		subject = new ProfileTransactionNotificationService(profile, notificationsRepository);
	});

	test("#recent", async () => {
		nock.fake(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		await subject.sync({ limit: 20 });

		assert.length(subject.recent(), 2);
		assert.length(subject.recent(10), 2);

		await subject.sync();
		assert.length(subject.recent(1), 1);
	});

	test("#sync", async () => {
		nock.fake(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		profile.settings().set(ProfileSetting.UseTestNetworks, true);

		await subject.sync({ limit: 10 });

		assert.length(subject.transactions(), 2);
		assert.false(subject.has(excludedTransactionNotificationId));
		assert.true(subject.has(includedTransactionNotificationId));
	});

	test("should return empty responses for test networks", async () => {
		nock.fake(/.+/)
			.get("/api/transactions")
			.query(true)
			.reply(200, require("../test/fixtures/client/transactions-empty.json"));

		profile.settings().set(ProfileSetting.UseTestNetworks, false);

		await subject.sync();

		assert.length(subject.transactions(), 0);
		assert.false(subject.has(excludedTransactionNotificationId));
		assert.false(subject.has(includedTransactionNotificationId));
	});

	test("#has", async () => {
		nock.fake(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		await subject.sync();

		assert.false(subject.has(excludedTransactionNotificationId));
		assert.true(subject.has(includedTransactionNotificationId));
	});

	test("#findByTransactionId", async () => {
		nock.fake(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		await subject.sync();

		assert.truthy(subject.findByTransactionId(includedTransactionNotificationId));
		assert.undefined(subject.findByTransactionId("unknown"));
	});

	test("#forget", async () => {
		nock.fake(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		await subject.sync();

		assert.truthy(subject.findByTransactionId(includedTransactionNotificationId));

		subject.forget("unknown");
		subject.forget(includedTransactionNotificationId);

		assert.undefined(subject.findByTransactionId(includedTransactionNotificationId));
	});

	test("#forgetByRecipient", async () => {
		nock.fake(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures).persist();

		await subject.sync({ limit: 20 });
		const wallet = profile.wallets().first();
		assert.true(subject.has(includedTransactionNotificationId));
		assert.length(subject.transactions(), 2);

		subject.forgetByRecipient("unknown");

		assert.true(subject.has(includedTransactionNotificationId));

		subject.forgetByRecipient(wallet.address());

		assert.false(subject.has(includedTransactionNotificationId));
		assert.length(subject.transactions(), 0);
	});

	test("#markAsRead", async () => {
		nock.fake(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		await subject.sync({ limit: 20 });

		const notification = subject.findByTransactionId(includedTransactionNotificationId);
		assert.undefined(notification?.read_at);

		subject.markAsRead("unknown");
		subject.markAsRead(includedTransactionNotificationId);

		assert.truthy(subject.findByTransactionId(includedTransactionNotificationId)?.read_at);
	});

	test("#transactions", async () => {
		nock.fake(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		await subject.sync({ limit: 20 });

		assert.length(subject.transactions(), 2);
		assert.length(subject.transactions(1), 1);
	});

	test("#transactions", async () => {
		nock.fake(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		await subject.sync({ limit: 20 });

		assert.instance(subject.transaction(includedTransactionNotificationId), ExtendedConfirmedTransactionData);
	});

	test("should handle undefined timestamp", async () => {
		nock.fake(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		const transactions = await profile.transactionAggregate().received({ limit: 10 });
		const transaction = transactions.findById(NotificationTransactionFixtures.data[2].id);

		Mockery.stub(transaction, "timestamp").returnValue(undefined);
		Mockery.stub(profile.transactionAggregate(), "received").resolvedValue(transactions);

		await subject.sync();
		assert.length(subject.recent(10), 2);
		assert.length(subject.recent(), 2);
		assert.length(subject.transactions(), 2);

		// jest.restoreAllMocks();

		await subject.sync();
		assert.length(subject.recent(10), 2);
		assert.length(subject.recent(), 2);
	});

	test("#markAllAsRead", async () => {
		nock.fake(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		await subject.sync({ limit: 20 });
		notificationsRepository.push({
			type: INotificationTypes.Release,
			meta: { version: "3.0.0" },
		});

		assert.length(notificationsRepository.unread(), 3);
		assert.length(subject.recent(), 2);
		subject.markAllAsRead();
		assert.length(notificationsRepository.unread(), 1);
	});

	test("#isSyncing", async () => {
		nock.fake(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

		assert.false(subject.isSyncing());
		await subject.sync({ limit: 20 });
	});
});

test.run();
