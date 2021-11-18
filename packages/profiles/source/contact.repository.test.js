import "reflect-metadata";

import { bootContainer } from "../test/mocking";
import { ContactRepository } from "./contact.repository";
import { Profile } from "./profile";

let subject: ContactRepository;

const name = "John Doe";
const addr = { coin: "ARK", network: "ark.devnet", address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW" };
const addr2 = { coin: "ARK", network: "ark.devnet", address: "DAWdHfDFEvvu57cHjAhs5K5di33B2DdCu1" };

test.before(() => bootContainer());

test.before.each(() => {
    const profile = new Profile({ id: "profile-id", name: "name", avatar: "avatar", data: "" });

    subject = new ContactRepository(profile);

    subject.flush();
});

test("#first | #last", () => {
    const john = subject.create("John", [addr]);
    const jane = subject.create("Jane", [addr]);

    assert.is(subject.first(), john);
    assert.is(subject.last(), jane);
});

test("#create", () => {
    assert.is(subject.keys()).toHaveLength(0);

    const result = subject.create(name, [addr]);

    assert.is(subject.keys()).toHaveLength(1);

    assert.is(result.toObject()).toStrictEqual({
        id: result.id(),
        name,
        starred: false,
        addresses: [{ id: expect.any(String), ...addr }],
    });

    assert.is(() => subject.create(name, [addr])).toThrowError(`The contact [${name}] already exists.`);
    assert.is(() => subject.create("Jane Doe", [])).toThrowError('"addresses" must contain at least 1 items');
    assert.is(subject.count(), 1);

    assert.is(() =>
        subject.create("InvalidAddress", [
            {
                coin: "ARK",
                network: "ark.devnet",
                // @ts-ignore
                address: undefined,
            },
        ]),
    ).toThrowError('addresses[0].address" is required');

    assert.is(subject.count(), 1);

    assert.is(() =>
        subject.create("InvalidAddress", [
            {
                // @ts-ignore
                coin: undefined,
                network: "ark.devnet",
                address: "a",
            },
        ]),
    ).toThrowError('addresses[0].coin" is required');

    assert.is(subject.count(), 1);

    assert.is(() =>
        subject.create("InvalidAddress", [
            {
                coin: "ARK",
                // @ts-ignore
                network: undefined,
                address: "a",
            },
        ]),
    ).toThrowError('addresses[0].network" is required');

    assert.is(subject.count(), 1);
});

test("#find", () => {
    assert.is(() => subject.findById("invalid")).toThrowError("Failed to find");

    const contact = subject.create(name, [addr]);

    assert.is(subject.findById(contact.id()), "object");
});

test("#update", () => {
    assert.is(() => subject.update("invalid", { name: "Jane Doe" })).toThrowError("Failed to find");

    const contact = subject.create(name, [addr]);

    subject.update(contact.id(), { name: "Jane Doe" });

    assert.is(subject.findById(contact.id()).name(), "Jane Doe");

    const anotherContact = subject.create("Another name", [addr]);

    assert.is(() => subject.update(anotherContact.id(), { name: "Dorothy" })).not.toThrow();

    const newContact = subject.create("Another name", [addr]);

    assert.is(() => subject.update(newContact.id(), { name: "Jane Doe" })).toThrowError(
        "The contact [Jane Doe] already exists.",
    );
});

test("#update with addresses", () => {
    const contact = subject.create(name, [addr]);

    assert.is(() => subject.update(contact.id(), { addresses: [] })).toThrowError(
        '"addresses" must contain at least 1 items',
    );

    assert.is(subject.findById(contact.id()).addresses().keys()).toHaveLength(1);

    subject.update(contact.id(), { addresses: [addr2] });

    assert.is(contact.toObject().addresses, [{ id: expect.any(String), ...addr2 }]);
});

test("#forget", () => {
    assert.is(() => subject.forget("invalid")).toThrowError("Failed to find");

    const contact = subject.create(name, [addr]);

    subject.forget(contact.id());

    assert.is(() => subject.findById(contact.id())).toThrowError("Failed to find");
});

test("#findByAddress", () => {
    subject.create(name, [addr]);

    assert.is(subject.findByAddress(addr.address)).toHaveLength(1);
    assert.is(subject.findByAddress("invalid")).toHaveLength(0);
});

test("#findByCoin", () => {
    subject.create(name, [addr]);

    assert.is(subject.findByCoin(addr.coin)).toHaveLength(1);
    assert.is(subject.findByCoin("invalid")).toHaveLength(0);
});

test("#findByNetwork", () => {
    subject.create(name, [addr]);

    assert.is(subject.findByNetwork(addr.network)).toHaveLength(1);
    assert.is(subject.findByNetwork("invalid")).toHaveLength(0);
});

test("#flush", () => {
    subject.create(name, [addr]);

    assert.is(subject.keys()).toHaveLength(1);

    subject.flush();

    assert.is(subject.keys()).toHaveLength(0);
});
