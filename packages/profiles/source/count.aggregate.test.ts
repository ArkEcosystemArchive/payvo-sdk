import "reflect-metadata";

import { bootContainer } from "../test/mocking.js";
import { Profile } from "./profile.js";
import { CountAggregate } from "./count.aggregate";

let subject: CountAggregate;

beforeAll(() => bootContainer());

beforeEach(async () => {
    subject = new CountAggregate(new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" }));
});

it.each(["contacts", "notifications", "wallets"])("should count %s", (method: string) => {
    assert.is(subject[method]()), "number");
});
