import "jest-extended";
import "reflect-metadata";
import { bootContainer } from "../test/mocking.js";
import { Profile } from "./profile.js";

import { NotificationRepository } from "./notification.repository";
import { INotificationTypes } from "./notification.repository.contract";

let subject: NotificationRepository;

const stubNotifications = [
    {
        icon: "warning",
        name: "Ledger Update Available",
        type: "ledger",
        body: "...",
        action: "Read Changelog",
    },
    {
        icon: "warning",
        name: "Ledger Update Available",
        type: "plugin",
        body: "...",
        action: "Read Changelog",
    },
    {
        icon: "info",
        name: "Transaction Created",
        body: "...",
        type: "transaction",
        action: "open",
        meta: {
            txId: "1",
        },
    },
];

const transactionNotifications = [
    {
        type: INotificationTypes.Transaction,
        meta: {
            transactionId: "1",
        },
    },
    {
        type: INotificationTypes.Transaction,
        meta: {
            transactionId: "2",
        },
    },
    {
        type: INotificationTypes.Transaction,
        meta: {
            transactionId: "3",
        },
    },
];

const releaseNotifications = [
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

const stubNotification = stubNotifications[0];

beforeAll(() => {
    bootContainer();
});

beforeEach(
    () => (subject = new NotificationRepository(new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" }))),
);

test("#all", () => {
    expect(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));
    expect(Object.keys(subject.all())).toHaveLength(stubNotifications.length);
});

test("#first", () => {
    expect(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));

    expect(subject.keys()).toHaveLength(stubNotifications.length);
    expect(subject.first().name).toEqual(stubNotification.name);
});

test("#last", () => {
    expect(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));

    expect(subject.keys()).toHaveLength(stubNotifications.length);
    expect(subject.last().name).toEqual(stubNotifications[stubNotifications.length - 1].name);
});

test("#keys", () => {
    expect(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));
    const keys = Object.keys(subject.all());

    expect(subject.keys()).toEqual(keys);
});

test("#values", () => {
    expect(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));
    const values = Object.keys(subject.all()).map((id) => subject.get(id));

    expect(subject.values()).toEqual(values);
});

test("#get", () => {
    expect(() => subject.get("invalid")).toThrowError("Failed to find");

    const notification = subject.push(stubNotification);

    expect(subject.get(notification.id)).toBeObject();
});

test("#push", () => {
    expect(subject.keys()).toHaveLength(0);

    subject.push(stubNotification);

    expect(subject.keys()).toHaveLength(1);

    subject.push(stubNotification);

    expect(subject.keys()).toHaveLength(2);
});

test("#fill", () => {
    expect(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));
    const first = subject.first();
    subject.fill(Object.assign(first, { name: "updated name" }));

    expect(subject.first().name).toEqual("updated name");
});

test("#has", () => {
    const notification = subject.push(stubNotification);

    expect(subject.has(notification.id)).toBeTrue();

    subject.forget(notification.id);

    expect(subject.has(notification.id)).toBeFalse();
});

test("#forget", () => {
    expect(() => subject.forget("invalid")).toThrowError("Failed to find");

    const notification = subject.push(stubNotification);

    subject.forget(notification.id);

    expect(() => subject.get(notification.id)).toThrowError("Failed to find");
});

test("#flush", () => {
    subject.push(stubNotification);
    subject.push(stubNotification);

    expect(subject.keys()).toHaveLength(2);

    subject.flush();

    expect(subject.keys()).toHaveLength(0);
});

test("#count", () => {
    expect(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));

    expect(subject.count()).toEqual(stubNotifications.length);
});

test("marks notifications as read and filters them", () => {
    subject.push(stubNotification);
    subject.markAsRead(subject.push(stubNotification).id);

    expect(subject.read()).toHaveLength(1);
    expect(subject.unread()).toHaveLength(1);
});

test("#read", () => {
    expect(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));
    subject.markAsRead(subject.first().id);

    expect(subject.unread()).toHaveLength(2);
    expect(subject.first().read_at).toBeTruthy();
});

test("#unread", () => {
    expect(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));
    subject.markAsRead(subject.first().id);

    expect(subject.unread()).toHaveLength(2);
    expect(subject.first().read_at).toBeTruthy();

    expect(subject.last().read_at).toBeUndefined();
});

test("#filterByType", () => {
    expect(subject.keys()).toHaveLength(0);

    transactionNotifications.forEach((n) => subject.push(n));
    releaseNotifications.forEach((n) => subject.push(n));

    expect(subject.filterByType(INotificationTypes.Release)).toHaveLength(1);
    expect(subject.filterByType(INotificationTypes.Transaction)).toHaveLength(3);
});

test("#findByTransactionId", () => {
    expect(subject.keys()).toHaveLength(0);

    expect(subject.findByTransactionId("1")?.meta?.transactionId).toBeUndefined();

    transactionNotifications.forEach((n) => subject.push(n));

    expect(subject.findByTransactionId("1")?.meta?.transactionId).toEqual(
        transactionNotifications[0]?.meta.transactionId,
    );
    expect(subject.findByTransactionId("10")?.meta?.transactionId).toBeUndefined();

    subject.push({
        type: INotificationTypes.Transaction,
    });

    expect(subject.filterByType(INotificationTypes.Transaction)).toHaveLength(4);
    expect(subject.findByTransactionId("100")?.meta?.transactionId).toBeUndefined();
});

test("#findByVersion", () => {
    expect(subject.keys()).toHaveLength(0);

    expect(subject.findByVersion("3.0.0")?.meta?.version).toBeUndefined();

    releaseNotifications.forEach((n) => subject.push(n));

    subject.push({
        type: INotificationTypes.Release,
    });

    expect(subject.findByVersion("3.0.0")?.meta?.version).toEqual(releaseNotifications[0]?.meta.version);
    expect(subject.findByVersion("3.0.1")?.meta?.version).toBeUndefined();
});

it("should have meta info", () => {
    expect(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));

    const last = stubNotifications[stubNotifications.length - 1];
    expect(subject.last().meta).toBeObject();
    expect(subject.last().meta).toEqual(last.meta);
});

it("should have a type", () => {
    expect(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));

    const last = stubNotifications[stubNotifications.length - 1];
    expect(subject.last().type).toEqual(last.type);
});
