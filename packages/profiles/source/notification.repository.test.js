import { assert, describe, stub, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";
import { bootContainer } from "../test/mocking";
import { Profile } from "./profile";

import { NotificationRepository } from "./notification.repository";
import { INotificationTypes } from "./notification.repository.contract";

let subject;

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

test.before(() => {
	bootContainer();
});

test.before.each(
	() => (subject = new NotificationRepository(new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" }))),
);

test("#all", () => {
	assert.length(subject.keys(), 0);

	stubNotifications.forEach((n) => subject.push(n));
	assert.length(Object.keys(subject.all()), stubNotifications.length);
});

test("#first", () => {
	assert.length(subject.keys(), 0);

	stubNotifications.forEach((n) => subject.push(n));

	assert.length(subject.keys(), stubNotifications.length);
	assert.is(subject.first().name, stubNotification.name);
});

test("#last", () => {
	assert.length(subject.keys(), 0);

	stubNotifications.forEach((n) => subject.push(n));

	assert.length(subject.keys(), stubNotifications.length);
	assert.is(subject.last().name, stubNotifications[stubNotifications.length - 1].name);
});

test("#keys", () => {
	assert.length(subject.keys(), 0);

	stubNotifications.forEach((n) => subject.push(n));
	const keys = Object.keys(subject.all());

	assert.equal(subject.keys(), keys);
});

test("#values", () => {
	assert.length(subject.keys(), 0);

	stubNotifications.forEach((n) => subject.push(n));
	const values = Object.keys(subject.all()).map((id) => subject.get(id));

	assert.equal(subject.values(), values);
});

test("#get", () => {
	assert.throws(() => subject.get("invalid"), "Failed to find");

	const notification = subject.push(stubNotification);

	assert.object(subject.get(notification.id));
});

test("#push", () => {
	assert.length(subject.keys(), 0);

	subject.push(stubNotification);

	assert.length(subject.keys(), 1);

	subject.push(stubNotification);

	assert.length(subject.keys(), 2);
});

test("#fill", () => {
	assert.length(subject.keys(), 0);

	stubNotifications.forEach((n) => subject.push(n));
	const first = subject.first();
	subject.fill(Object.assign(first, { name: "updated name" }));

	assert.is(subject.first().name, "updated name");
});

test("#has", () => {
	const notification = subject.push(stubNotification);

	assert.true(subject.has(notification.id));

	subject.forget(notification.id);

	assert.false(subject.has(notification.id));
});

test("#forget", () => {
	assert.throws(() => subject.forget("invalid"), "Failed to find");

	const notification = subject.push(stubNotification);

	subject.forget(notification.id);

	assert.throws(() => subject.get(notification.id), "Failed to find");
});

test("#flush", () => {
	subject.push(stubNotification);
	subject.push(stubNotification);

	assert.length(subject.keys(), 2);

	subject.flush();

	assert.length(subject.keys(), 0);
});

test("#count", () => {
	assert.length(subject.keys(), 0);

	stubNotifications.forEach((n) => subject.push(n));

	assert.is(subject.count(), stubNotifications.length);
});

test("marks notifications as read and filters them", () => {
	subject.push(stubNotification);
	subject.markAsRead(subject.push(stubNotification).id);

	assert.length(subject.read(), 1);
	assert.length(subject.unread(), 1);
});

test("#read", () => {
	assert.length(subject.keys(), 0);

	stubNotifications.forEach((n) => subject.push(n));
	subject.markAsRead(subject.first().id);

	assert.length(subject.unread(), 2);
	assert.truthy(subject.first().read_at);
});

test("#unread", () => {
	assert.length(subject.keys(), 0);

	stubNotifications.forEach((n) => subject.push(n));
	subject.markAsRead(subject.first().id);

	assert.length(subject.unread(), 2);
	assert.truthy(subject.first().read_at);

	assert.undefined(subject.last().read_at);
});

test("#filterByType", () => {
	assert.length(subject.keys(), 0);

	transactionNotifications.forEach((n) => subject.push(n));
	releaseNotifications.forEach((n) => subject.push(n));

	assert.length(subject.filterByType(INotificationTypes.Release), 1);
	assert.length(subject.filterByType(INotificationTypes.Transaction), 3);
});

test("#findByTransactionId", () => {
	assert.length(subject.keys(), 0);

	assert.undefined(subject.findByTransactionId("1")?.meta?.transactionId);

	transactionNotifications.forEach((n) => subject.push(n));

	assert.is(subject.findByTransactionId("1")?.meta?.transactionId, transactionNotifications[0]?.meta.transactionId);
	assert.undefined(subject.findByTransactionId("10")?.meta?.transactionId);

	subject.push({
		type: INotificationTypes.Transaction,
	});

	assert.length(subject.filterByType(INotificationTypes.Transaction), 4);
	assert.undefined(subject.findByTransactionId("100")?.meta?.transactionId);
});

test("#findByVersion", () => {
	assert.length(subject.keys(), 0);

	assert.undefined(subject.findByVersion("3.0.0")?.meta?.version);

	releaseNotifications.forEach((n) => subject.push(n));

	subject.push({
		type: INotificationTypes.Release,
	});

	assert.is(subject.findByVersion("3.0.0")?.meta?.version, releaseNotifications[0]?.meta.version);
	assert.undefined(subject.findByVersion("3.0.1")?.meta?.version);
});

test("should have meta info", () => {
	assert.length(subject.keys(), 0);

	stubNotifications.forEach((n) => subject.push(n));

	const last = stubNotifications[stubNotifications.length - 1];
	assert.object(subject.last().meta);
	assert.is(subject.last().meta, last.meta);
});

test("should have a type", () => {
	assert.length(subject.keys(), 0);

	stubNotifications.forEach((n) => subject.push(n));

	const last = stubNotifications[stubNotifications.length - 1];
	assert.is(subject.last().type, last.type);
});

test.run();
