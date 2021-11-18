import "reflect-metadata";

import { UUID } from "@payvo/sdk-cryptography";

import { bootContainer } from "../test/mocking.js";
import { IContactAddressInput } from "./contact-address.contract.js";
import { ContactAddressRepository } from "./contact-address.repository";
import { Profile } from "./profile.js";

let subject: ContactAddressRepository;
let profile: Profile;

const stubData: IContactAddressInput = {
    address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
    coin: "ARK",
    network: "ark.devnet",
};

test.before.each(() => {
    profile = new Profile({ avatar: "avatar", data: "", id: "uuid", name: "name" });
    subject = new ContactAddressRepository(profile);
});

beforeAll(() => {
    bootContainer();
});

test("#create", () => {
    assert.is(subject.keys()).toHaveLength(0);

    subject.create(stubData);

    assert.is(subject.keys()).toHaveLength(1);

    assert.is(subject.first().toObject(), {
        id: expect.any(String),
        ...stubData,
    });
});

test("#all", () => {
    assert.is(subject.all()), "object");
});

test("#first", () => {
    const address = subject.create(stubData);

    assert.is(subject.first(), address);
});

test("#last", () => {
    const address = subject.create(stubData);

    assert.is(subject.last(), address);
});

test("#count", () => {
    subject.create(stubData);

    assert.is(subject.count(), 1);
});

test("#fill", () => {
    const id: string = UUID.random();

    subject.fill([{ id, ...stubData }]);

    assert.is(subject.findById(id)), "object");
});

test("#toArray", () => {
    const address = subject.create(stubData);

    assert.is(subject.toArray()).toStrictEqual([address.toObject()]);
});

test("#find", () => {
    assert.is(() => subject.findById("invalid")).toThrowError("Failed to find");

    const address = subject.create(stubData);

    assert.is(subject.findById(address.id())), "object");
});

test("#update invalid", () => {
    assert.is(() => subject.update("invalid", { address: stubData.address })).toThrowError("Failed to find");
});

test("#update address", () => {
    const address = subject.create(stubData);

    subject.update(address.id(), { address: "new address" });

    assert.is(subject.findByAddress("new address")[0].address(), "new address");
    assert.is(profile.status().isDirty(), true);
});

test("#update without address", () => {
    const address = subject.create(stubData);

    subject.update(address.id(), {});

    assert.is(subject.findByAddress("new address"), []);
});

test("#forget", () => {
    assert.is(() => subject.forget("invalid")).toThrowError("Failed to find");

    const address = subject.create(stubData);

    subject.forget(address.id());

    assert.is(() => subject.findById(address.id())).toThrowError("Failed to find");
});

test("#findByAddress", () => {
    const address = subject.create(stubData);

    assert.is(subject.findByAddress(address.address())).toHaveLength(1);
    assert.is(subject.findByAddress("invalid")).toHaveLength(0);
});

test("#findByCoin", () => {
    const address = subject.create(stubData);

    assert.is(subject.findByCoin(address.coin())).toHaveLength(1);
    assert.is(subject.findByCoin("invalid")).toHaveLength(0);
});

test("#findByNetwork", () => {
    const address = subject.create(stubData);

    assert.is(subject.findByNetwork(address.network())).toHaveLength(1);
    assert.is(subject.findByNetwork("invalid")).toHaveLength(0);
});

test("#flush", () => {
    subject.create(stubData);

    assert.is(subject.keys()).toHaveLength(1);

    subject.flush();

    assert.is(subject.keys()).toHaveLength(0);
});

test("#exists", () => {
    subject.create(stubData);

    assert.is(subject.exists(stubData), true);

    assert.is(
        subject.exists({
            address: "DAWdHfDFEvvu57cHjAhs5K5di33B2DdCu1",
            coin: "ARK",
            network: "ark.devnet",
        }),
    , false);
});
