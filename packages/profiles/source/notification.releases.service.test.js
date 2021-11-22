import { assert, describe, Mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";
import { bootContainer } from "../test/mocking";
import { Profile } from "./profile";

import { NotificationRepository } from "./notification.repository";
import { WalletReleaseNotificationService } from "./notification.releases.service";
import { INotificationTypes, IWalletReleaseNotificationService } from "./notification.repository.contract";

let notificationsRepository;
let subject;

const releaseNotifications = [
	{
		icon: "warning",
		name: "Wallet Update Available 2",
		type: INotificationTypes.Release,
		body: "...",
		meta: {
			version: "3.0.2",
		},
	},
	{
		icon: "warning",
		name: "Wallet Update Available",
		type: INotificationTypes.Release,
		body: "...",
		meta: {
			version: "3.0.0",
		},
	},
];

test.before(() => {
	bootContainer();
});

test.before.each(() => {
	notificationsRepository = new NotificationRepository(
		new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" }),
	);
	subject = new WalletReleaseNotificationService(notificationsRepository);
});

test("#push", () => {
	releaseNotifications.forEach((notification) => subject.push(notification));
	assert.true(subject.has("3.0.0"));

	releaseNotifications.forEach((notification) => subject.push(notification));
	assert.length(notificationsRepository.values(), 2);

	subject.push({
		name: "Wallet Update Available",
		body: "...",
		meta: undefined,
	});

	assert.length(notificationsRepository.values(), 2);

	subject.push({
		name: "Wallet Update Available",
		body: "...",
		meta: {
			version: undefined,
		},
	});

	assert.length(notificationsRepository.values(), 2);
});

test("#has", () => {
	releaseNotifications.forEach((notification) => subject.push(notification));
	assert.true(subject.has("3.0.0"));
	assert.false(subject.has("3.3.0"));
});

test("#findByVersion", () => {
	releaseNotifications.forEach((notification) => subject.push(notification));
	assert.is(subject.findByVersion("3.0.0")?.name, releaseNotifications[1].name);
	assert.undefined(subject.findByVersion("3.10.0"));
});

test("#markAsRead", () => {
	releaseNotifications.forEach((notification) => subject.push(notification));
	const notification = subject.findByVersion("3.0.0");
	assert.is(notification?.name, releaseNotifications[1].name);
	assert.undefined(notification?.read_at);

	subject.markAsRead("3.11.0");
	subject.markAsRead("3.0.0");

	assert.truthy(notification?.read_at);
});

test("#forget", () => {
	releaseNotifications.forEach((notification) => subject.push(notification));
	const notification = subject.findByVersion("3.0.0");
	assert.is(notification?.name, releaseNotifications[1].name);
	assert.undefined(notification?.read_at);

	subject.forget("3.11.0");
	subject.forget("3.0.0");

	assert.undefined(subject.findByVersion("3.0.0"));
});

test("#recent", () => {
	releaseNotifications.forEach((notification) => subject.push(notification));
	assert.length(subject.recent(), 2);
	assert.length(subject.recent(10), 2);
});

test.run();
