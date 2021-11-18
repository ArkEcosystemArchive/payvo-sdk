import "reflect-metadata";
import { bootContainer } from "../test/mocking.js";
import { Profile } from "./profile.js";

import { NotificationRepository } from "./notification.repository";
import { INotificationTypes } from "./notification.repository.contract.js";

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
    assert.is(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));
    assert.is(Object.keys(subject.all())).toHaveLength(stubNotifications.length);
});

test("#first", () => {
    assert.is(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));

    assert.is(subject.keys()).toHaveLength(stubNotifications.length);
    assert.is(subject.first().name).toEqual(stubNotification.name);
});

test("#last", () => {
    assert.is(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));

    assert.is(subject.keys()).toHaveLength(stubNotifications.length);
    assert.is(subject.last().name).toEqual(stubNotifications[stubNotifications.length - 1].name);
});

test("#keys", () => {
    assert.is(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));
    const keys = Object.keys(subject.all());

    assert.is(subject.keys()).toEqual(keys);
});

test("#values", () => {
    assert.is(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));
    const values = Object.keys(subject.all()).map((id) => subject.get(id));

    assert.is(subject.values()).toEqual(values);
});

test("#get", () => {
    assert.is(() => subject.get("invalid")).toThrowError("Failed to find");

    const notification = subject.push(stubNotification);

    assert.is(subject.get(notification.id)), "object");
});

test("#push", () => {
    assert.is(subject.keys()).toHaveLength(0);

    subject.push(stubNotification);

    assert.is(subject.keys()).toHaveLength(1);

    subject.push(stubNotification);

    assert.is(subject.keys()).toHaveLength(2);
});

test("#fill", () => {
    assert.is(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));
    const first = subject.first();
    subject.fill(Object.assign(first, { name: "updated name" }));

    assert.is(subject.first().name).toEqual("updated name");
});

test("#has", () => {
    const notification = subject.push(stubNotification);

    assert.is(subject.has(notification.id), true);

    subject.forget(notification.id);

    assert.is(subject.has(notification.id), false);
});

test("#forget", () => {
    assert.is(() => subject.forget("invalid")).toThrowError("Failed to find");

    const notification = subject.push(stubNotification);

    subject.forget(notification.id);

    assert.is(() => subject.get(notification.id)).toThrowError("Failed to find");
});

test("#flush", () => {
    subject.push(stubNotification);
    subject.push(stubNotification);

    assert.is(subject.keys()).toHaveLength(2);

    subject.flush();

    assert.is(subject.keys()).toHaveLength(0);
});

test("#count", () => {
    assert.is(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));

    assert.is(subject.count()).toEqual(stubNotifications.length);
});

test("marks notifications as read and filters them", () => {
    subject.push(stubNotification);
    subject.markAsRead(subject.push(stubNotification).id);

    assert.is(subject.read()).toHaveLength(1);
    assert.is(subject.unread()).toHaveLength(1);
});

test("#read", () => {
    assert.is(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));
    subject.markAsRead(subject.first().id);

    assert.is(subject.unread()).toHaveLength(2);
    assert.is(subject.first().read_at).toBeTruthy();
});

test("#unread", () => {
    assert.is(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));
    subject.markAsRead(subject.first().id);

    assert.is(subject.unread()).toHaveLength(2);
    assert.is(subject.first().read_at).toBeTruthy();

    assert.is(subject.last().read_at), "undefined");
});

test("#filterByType", () => {
    assert.is(subject.keys()).toHaveLength(0);

    transactionNotifications.forEach((n) => subject.push(n));
    releaseNotifications.forEach((n) => subject.push(n));

    assert.is(subject.filterByType(INotificationTypes.Release)).toHaveLength(1);
    assert.is(subject.filterByType(INotificationTypes.Transaction)).toHaveLength(3);
});

test("#findByTransactionId", () => {
    assert.is(subject.keys()).toHaveLength(0);

    assert.is(subject.findByTransactionId("1")?.meta?.transactionId), "undefined");

transactionNotifications.forEach((n) => subject.push(n));

assert.is(subject.findByTransactionId("1")?.meta?.transactionId).toEqual(
    transactionNotifications[0]?.meta.transactionId,
);
assert.is(subject.findByTransactionId("10")?.meta?.transactionId), "undefined");

subject.push({
    type: INotificationTypes.Transaction,
});

assert.is(subject.filterByType(INotificationTypes.Transaction)).toHaveLength(4);
assert.is(subject.findByTransactionId("100")?.meta?.transactionId), "undefined");
});

test("#findByVersion", () => {
    assert.is(subject.keys()).toHaveLength(0);

    assert.is(subject.findByVersion("3.0.0")?.meta?.version), "undefined");

releaseNotifications.forEach((n) => subject.push(n));

subject.push({
    type: INotificationTypes.Release,
});

assert.is(subject.findByVersion("3.0.0")?.meta?.version).toEqual(releaseNotifications[0]?.meta.version);
assert.is(subject.findByVersion("3.0.1")?.meta?.version), "undefined");
});

it("should have meta info", () => {
    assert.is(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));

    const last = stubNotifications[stubNotifications.length - 1];
    assert.is(subject.last().meta), "object");
assert.is(subject.last().meta).toEqual(last.meta);
});

it("should have a type", () => {
    assert.is(subject.keys()).toHaveLength(0);

    stubNotifications.forEach((n) => subject.push(n));

    const last = stubNotifications[stubNotifications.length - 1];
    assert.is(subject.last().type).toEqual(last.type);
});
