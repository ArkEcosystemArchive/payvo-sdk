import "jest-extended";
import "reflect-metadata";
import nock from "nock";

import { identity } from "../test/fixtures/identity";
import { bootContainer, importByMnemonic } from "../test/mocking";
import { Profile } from "./profile";

import { NotificationRepository } from "./notification.repository";
import { ProfileTransactionNotifications } from "./notification.transactions.service";
import { IProfileTransactionNotifications } from "./notification.repository.contract";
const NotificationTransactionFixtures = require("../test/fixtures/client/notification-transactions.json");

const defaultTransactionNotificationId = NotificationTransactionFixtures.data[1].id;

let notificationsRepository: NotificationRepository;
let subject: IProfileTransactionNotifications;

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

	nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures).persist();
});

beforeEach(async () => {
	const profile = new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" });
	await importByMnemonic(profile, identity.mnemonic, "ARK", "ark.devnet");

	notificationsRepository = new NotificationRepository(profile);
	subject = new ProfileTransactionNotifications(profile, notificationsRepository);

	await subject.sync({});
});

test("#recent", async () => {
	expect(subject.recent(10)).toHaveLength(1);

	await subject.sync({});
	expect(subject.recent(10)).toHaveLength(1);
});

test("#has", async () => {
	expect(subject.has(NotificationTransactionFixtures.data[0].id)).toBeFalse();
	expect(subject.has(defaultTransactionNotificationId)).toBeTrue();
});

test("#findByTransactionId", async () => {
	expect(subject.findByTransactionId(defaultTransactionNotificationId)).toBeTruthy();
	expect(subject.findByTransactionId("unknown")).toBeUndefined();
});

test("#forget", async () => {
	expect(subject.findByTransactionId(defaultTransactionNotificationId)).toBeTruthy();

	subject.forget("unknown");
	subject.forget(defaultTransactionNotificationId);

	expect(subject.findByTransactionId(defaultTransactionNotificationId)).toBeUndefined();
});

test("#markAsRead", async () => {
	const notification = subject.findByTransactionId(defaultTransactionNotificationId);
	expect(notification?.read_at).toBeUndefined();

	subject.markAsRead("unknown");
	subject.markAsRead(defaultTransactionNotificationId);

	expect(subject.findByTransactionId(defaultTransactionNotificationId)?.read_at).toBeTruthy();
});
