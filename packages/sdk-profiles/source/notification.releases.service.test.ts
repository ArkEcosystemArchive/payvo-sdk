import "jest-extended";
import "reflect-metadata";
import { bootContainer } from "../test/mocking";
import { Profile } from "./profile";

import { NotificationRepository } from "./notification.repository";
import { WalletReleaseNotifications } from "./notification.releases.service";
import { INotificationTypes, IWalletReleaseNotifications } from "./notification.repository.contract";

let notificationsRepository: NotificationRepository;
let subject: IWalletReleaseNotifications;

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

beforeAll(() => {
	bootContainer();
});

beforeEach(() => {
	notificationsRepository = new NotificationRepository(
		new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" }),
	);
	subject = new WalletReleaseNotifications(notificationsRepository);
});

test("#push", () => {
	releaseNotifications.forEach((notification) => subject.push(notification));
	expect(subject.has("3.0.0")).toBeTrue();

	releaseNotifications.forEach((notification) => subject.push(notification));
	expect(notificationsRepository.values()).toHaveLength(2);

	subject.push({
		name: "Wallet Update Available",
		body: "...",
		meta: undefined,
	});

	expect(notificationsRepository.values()).toHaveLength(2);

	subject.push({
		name: "Wallet Update Available",
		body: "...",
		meta: {
			version: undefined,
		},
	});

	expect(notificationsRepository.values()).toHaveLength(2);
});

test("#has", () => {
	releaseNotifications.forEach((notification) => subject.push(notification));
	expect(subject.has("3.0.0")).toBeTrue();
	expect(subject.has("3.3.0")).toBeFalse();
});

test("#findByVersion", () => {
	releaseNotifications.forEach((notification) => subject.push(notification));
	expect(subject.findByVersion("3.0.0")?.name).toEqual(releaseNotifications[1].name);
	expect(subject.findByVersion("3.10.0")).toBeUndefined();
});

test("#markAsRead", () => {
	releaseNotifications.forEach((notification) => subject.push(notification));
	const notification = subject.findByVersion("3.0.0");
	expect(notification?.name).toEqual(releaseNotifications[1].name);
	expect(notification?.read_at).toBeUndefined();

	subject.markAsRead("3.11.0");
	subject.markAsRead("3.0.0");

	expect(notification?.read_at).toBeTruthy();
});

test("#forget", () => {
	releaseNotifications.forEach((notification) => subject.push(notification));
	const notification = subject.findByVersion("3.0.0");
	expect(notification?.name).toEqual(releaseNotifications[1].name);
	expect(notification?.read_at).toBeUndefined();

	subject.forget("3.11.0");
	subject.forget("3.0.0");

	expect(subject.findByVersion("3.0.0")).toBeUndefined();
});
