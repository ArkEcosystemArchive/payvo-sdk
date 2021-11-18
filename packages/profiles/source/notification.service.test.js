import "reflect-metadata";
import nock from "nock";

import { identity } from "../test/fixtures/identity";
import { bootContainer, importByMnemonic } from "../test/mocking";
import { Profile } from "./profile";

import { ProfileNotificationService } from "./notification.service";
import { ProfileTransactionNotificationService } from "./notification.transactions.service";
import { WalletReleaseNotificationService } from "./notification.releases.service";
import { INotificationTypes } from "./notification.repository.contract";

const NotificationTransactionFixtures = require("../test/fixtures/client/notification-transactions.json");
const includedTransactionNotificationId = NotificationTransactionFixtures.data[1].id;

let subject: ProfileNotificationService;

test.before(async () => {
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

	nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures).persist();
});

test.before.each(async () => {
	const profile = new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" });
	await importByMnemonic(profile, identity.mnemonic, "ARK", "ark.devnet");

	subject = new ProfileNotificationService(profile);
});

test("#transactions", async () => {
	assert.is(subject.transactions() instanceof ProfileTransactionNotificationService);
});

test("#releases", async () => {
	assert.is(subject.releases() instanceof WalletReleaseNotificationService);
});

test("#markAsRead", async () => {
	assert.is(subject.hasUnread(), false);
	await subject.transactions().sync({});

	assert.is(subject.hasUnread(), true);

	const notification = subject.transactions().findByTransactionId(includedTransactionNotificationId);
	subject.markAsRead(notification?.id as string);

	const notification2 = subject.transactions().findByTransactionId(NotificationTransactionFixtures.data[2].id);
	subject.markAsRead(notification2?.id as string);

	assert.is(subject.hasUnread(), false);
});

test("#get", async () => {
	assert.is(subject.hasUnread(), false);
	await subject.transactions().sync({});

	const notification = subject.transactions().findByTransactionId(includedTransactionNotificationId);

	assert.is(subject.get(notification?.id!).meta, notification?.meta!);
});

test("#filterByType", async () => {
	await subject.transactions().sync({});

	assert.is(subject.filterByType(INotificationTypes.Transaction)).toHaveLength(2);
});

test("#hasUnread", async () => {
	assert.is(subject.hasUnread(), false);
	await subject.transactions().sync({});
	assert.is(subject.hasUnread(), true);
});

test("#all", async () => {
	await subject.transactions().sync({});
	assert.is(subject.all() instanceof Object);
	assert.is(Object.values(subject.all())).toHaveLength(2);
});

test("#count", async () => {
	await subject.transactions().sync({});
	assert.is(subject.count(), 2);
});

test("#flush", async () => {
	await subject.transactions().sync({});
	assert.is(subject.count(), 2);
	subject.flush();
	assert.is(subject.count(), 0);
});

test("#fill", async () => {
	const notifications = {
		"46530491-0056-4239-ae12-1b406ba7f68d": {
			id: "46530491-0056-4239-ae12-1b406ba7f68d",
			meta: {
				timestamp: 1584871208,
				transactionId: "9049c49eb0e0d9b14becc38d4f51ab993aa9fc7f6a7b23a1aff9e7bc060d2bb1",
			},
			read_at: undefined,
			type: "transaction",
		},
	};

	assert.is(subject.count(), 0);
	subject.fill(notifications);
	assert.is(subject.count(), 1);
});
