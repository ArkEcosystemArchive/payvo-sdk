import "reflect-metadata";
import nock from "nock";

import { identity } from "../test/fixtures/identity.js";
import { bootContainer, importByMnemonic } from "../test/mocking.js";
import { Profile } from "./profile.js";

import { NotificationRepository } from "./notification.repository";
import { ProfileTransactionNotificationService } from "./notification.transactions.service.js";
import { INotificationTypes, IProfileTransactionNotificationService } from "./notification.repository.contract.js";
import { IProfile } from "./profile.contract.js";
import { ExtendedConfirmedTransactionData } from "./transaction.dto.js";
import { ProfileSetting } from "./profile.enum.contract.js";
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

        assert.is(subject.recent()).toHaveLength(2);
        assert.is(subject.recent(10)).toHaveLength(2);

        await subject.sync();
        assert.is(subject.recent(1)).toHaveLength(1);
    });

    test("#sync", async () => {
        nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

        profile.settings().set(ProfileSetting.UseTestNetworks, true);

        await subject.sync({ limit: 10 });

        assert.is(subject.transactions()).toHaveLength(2);
        assert.is(subject.has(excludedTransactionNotificationId), false);
        assert.is(subject.has(includedTransactionNotificationId), true);
    });

    test("should return empty responses for test networks", async () => {
        nock(/.+/)
            .get("/api/transactions")
            .query(true)
            .reply(200, require("../test/fixtures/client/transactions-empty.json"));

        profile.settings().set(ProfileSetting.UseTestNetworks, false);

        await subject.sync();

        assert.is(subject.transactions()).toHaveLength(0);
        assert.is(subject.has(excludedTransactionNotificationId), false);
        assert.is(subject.has(includedTransactionNotificationId), false);
    });

    test("#has", async () => {
        nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

        await subject.sync();

        assert.is(subject.has(excludedTransactionNotificationId), false);
        assert.is(subject.has(includedTransactionNotificationId), true);
    });

    test("#findByTransactionId", async () => {
        nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

        await subject.sync();

        assert.is(subject.findByTransactionId(includedTransactionNotificationId)).toBeTruthy();
        assert.is(subject.findByTransactionId("unknown")), "undefined");
});

test("#forget", async () => {
    nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

    await subject.sync();

    assert.is(subject.findByTransactionId(includedTransactionNotificationId)).toBeTruthy();

    subject.forget("unknown");
    subject.forget(includedTransactionNotificationId);

    assert.is(subject.findByTransactionId(includedTransactionNotificationId)), "undefined");
    });

test("#forgetByRecipient", async () => {
    nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures).persist();

    await subject.sync({ limit: 20 });
    const wallet = profile.wallets().first();
    assert.is(subject.has(includedTransactionNotificationId), true);
    assert.is(subject.transactions()).toHaveLength(2);

    subject.forgetByRecipient("unknown");

    assert.is(subject.has(includedTransactionNotificationId), true);

    subject.forgetByRecipient(wallet.address());

    assert.is(subject.has(includedTransactionNotificationId), false);
    assert.is(subject.transactions()).toHaveLength(0);
});

test("#markAsRead", async () => {
    nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

    await subject.sync({ limit: 20 });

    const notification = subject.findByTransactionId(includedTransactionNotificationId);
    assert.is(notification?.read_at), "undefined");

subject.markAsRead("unknown");
subject.markAsRead(includedTransactionNotificationId);

assert.is(subject.findByTransactionId(includedTransactionNotificationId)?.read_at).toBeTruthy();
    });

test("#transactions", async () => {
    nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

    await subject.sync({ limit: 20 });

    assert.is(subject.transactions()).toHaveLength(2);
    assert.is(subject.transactions(1)).toHaveLength(1);
});

test("#transactions", async () => {
    nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

    await subject.sync({ limit: 20 });

    assert.is(subject.transaction(includedTransactionNotificationId) instanceof ExtendedConfirmedTransactionData);
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
    assert.is(subject.recent(10)).toHaveLength(2);
    assert.is(subject.recent()).toHaveLength(2);
    assert.is(subject.transactions()).toHaveLength(2);

    jest.restoreAllMocks();

    await subject.sync();
    assert.is(subject.recent(10)).toHaveLength(2);
    assert.is(subject.recent()).toHaveLength(2);
});

test("#markAllAsRead", async () => {
    nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

    await subject.sync({ limit: 20 });
    notificationsRepository.push({
        type: INotificationTypes.Release,
        meta: { version: "3.0.0" },
    });

    assert.is(notificationsRepository.unread()).toHaveLength(3);
    assert.is(subject.recent()).toHaveLength(2);
    subject.markAllAsRead();
    assert.is(notificationsRepository.unread()).toHaveLength(1);
});

test("#isSyncing", async () => {
    nock(/.+/).get("/api/transactions").query(true).reply(200, NotificationTransactionFixtures);

    assert.is(subject.isSyncing(), false);
    await subject.sync({ limit: 20 });
});
});
