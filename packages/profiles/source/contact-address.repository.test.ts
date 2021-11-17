import "jest-extended";
import "reflect-metadata";

import { UUID } from "@payvo/sdk-cryptography";

import { bootContainer } from "../test/mocking.js";
import { IContactAddressInput } from "./contact-address.contract";
import { ContactAddressRepository } from "./contact-address.repository";
import { Profile } from "./profile.js";

let subject: ContactAddressRepository;
let profile: Profile;

const stubData: IContactAddressInput = {
    address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
    coin: "ARK",
    network: "ark.devnet",
};

beforeEach(() => {
    profile = new Profile({ avatar: "avatar", data: "", id: "uuid", name: "name" });
    subject = new ContactAddressRepository(profile);
});

beforeAll(() => {
    bootContainer();
});

test("#create", () => {
    expect(subject.keys()).toHaveLength(0);

    subject.create(stubData);

    expect(subject.keys()).toHaveLength(1);

    expect(subject.first().toObject()).toEqual({
        id: expect.any(String),
        ...stubData,
    });
});

test("#all", () => {
    expect(subject.all()).toBeObject();
});

test("#first", () => {
    const address = subject.create(stubData);

    expect(subject.first()).toBe(address);
});

test("#last", () => {
    const address = subject.create(stubData);

    expect(subject.last()).toBe(address);
});

test("#count", () => {
    subject.create(stubData);

    expect(subject.count()).toBe(1);
});

test("#fill", () => {
    const id: string = UUID.random();

    subject.fill([{ id, ...stubData }]);

    expect(subject.findById(id)).toBeObject();
});

test("#toArray", () => {
    const address = subject.create(stubData);

    expect(subject.toArray()).toStrictEqual([address.toObject()]);
});

test("#find", () => {
    expect(() => subject.findById("invalid")).toThrowError("Failed to find");

    const address = subject.create(stubData);

    expect(subject.findById(address.id())).toBeObject();
});

test("#update invalid", () => {
    expect(() => subject.update("invalid", { address: stubData.address })).toThrowError("Failed to find");
});

test("#update address", () => {
    const address = subject.create(stubData);

    subject.update(address.id(), { address: "new address" });

    expect(subject.findByAddress("new address")[0].address()).toEqual("new address");
    expect(profile.status().isDirty()).toBeTrue();
});

test("#update without address", () => {
    const address = subject.create(stubData);

    subject.update(address.id(), {});

    expect(subject.findByAddress("new address")).toEqual([]);
});

test("#forget", () => {
    expect(() => subject.forget("invalid")).toThrowError("Failed to find");

    const address = subject.create(stubData);

    subject.forget(address.id());

    expect(() => subject.findById(address.id())).toThrowError("Failed to find");
});

test("#findByAddress", () => {
    const address = subject.create(stubData);

    expect(subject.findByAddress(address.address())).toHaveLength(1);
    expect(subject.findByAddress("invalid")).toHaveLength(0);
});

test("#findByCoin", () => {
    const address = subject.create(stubData);

    expect(subject.findByCoin(address.coin())).toHaveLength(1);
    expect(subject.findByCoin("invalid")).toHaveLength(0);
});

test("#findByNetwork", () => {
    const address = subject.create(stubData);

    expect(subject.findByNetwork(address.network())).toHaveLength(1);
    expect(subject.findByNetwork("invalid")).toHaveLength(0);
});

test("#flush", () => {
    subject.create(stubData);

    expect(subject.keys()).toHaveLength(1);

    subject.flush();

    expect(subject.keys()).toHaveLength(0);
});

test("#exists", () => {
    subject.create(stubData);

    expect(subject.exists(stubData)).toBeTrue();

    expect(
        subject.exists({
            address: "DAWdHfDFEvvu57cHjAhs5K5di33B2DdCu1",
            coin: "ARK",
            network: "ark.devnet",
        }),
    ).toBeFalse();
});
