import "reflect-metadata";
import { bootContainer } from "../test/mocking.js";
import { Profile } from "./profile.js";

import { NotificationRepository } from "./notification.repository";
import { WalletReleaseNotificationService } from "./notification.releases.service.js";
import { INotificationTypes, IWalletReleaseNotificationService } from "./notification.repository.contract.js";

let notificationsRepository: NotificationRepository;
let subject: IWalletReleaseNotificationService;

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
    subject = new WalletReleaseNotificationService(notificationsRepository);
});

test("#push", () => {
    releaseNotifications.forEach((notification) => subject.push(notification));
    assert.is(subject.has("3.0.0"), true);

    releaseNotifications.forEach((notification) => subject.push(notification));
    assert.is(notificationsRepository.values()).toHaveLength(2);

    subject.push({
        name: "Wallet Update Available",
        body: "...",
        meta: undefined,
    });

    assert.is(notificationsRepository.values()).toHaveLength(2);

    subject.push({
        name: "Wallet Update Available",
        body: "...",
        meta: {
            version: undefined,
        },
    });

    assert.is(notificationsRepository.values()).toHaveLength(2);
});

test("#has", () => {
    releaseNotifications.forEach((notification) => subject.push(notification));
    assert.is(subject.has("3.0.0"), true);
    assert.is(subject.has("3.3.0"), false);
});

test("#findByVersion", () => {
    releaseNotifications.forEach((notification) => subject.push(notification));
    assert.is(subject.findByVersion("3.0.0")?.name).toEqual(releaseNotifications[1].name);
    assert.is(subject.findByVersion("3.10.0")), "undefined");
});

test("#markAsRead", () => {
    releaseNotifications.forEach((notification) => subject.push(notification));
    const notification = subject.findByVersion("3.0.0");
    assert.is(notification?.name).toEqual(releaseNotifications[1].name);
    assert.is(notification?.read_at), "undefined");

subject.markAsRead("3.11.0");
subject.markAsRead("3.0.0");

assert.is(notification?.read_at).toBeTruthy();
});

test("#forget", () => {
    releaseNotifications.forEach((notification) => subject.push(notification));
    const notification = subject.findByVersion("3.0.0");
    assert.is(notification?.name).toEqual(releaseNotifications[1].name);
    assert.is(notification?.read_at), "undefined");

subject.forget("3.11.0");
subject.forget("3.0.0");

assert.is(subject.findByVersion("3.0.0")), "undefined");
});

test("#recent", () => {
    releaseNotifications.forEach((notification) => subject.push(notification));
    assert.is(subject.recent()).toHaveLength(2);
    assert.is(subject.recent(10)).toHaveLength(2);
});
