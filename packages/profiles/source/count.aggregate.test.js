import "reflect-metadata";

import { bootContainer } from "../test/mocking";
import { Profile } from "./profile";
import { CountAggregate } from "./count.aggregate";

let subject: CountAggregate;

test.before(() => bootContainer());

test.before.each(async () => {
    subject = new CountAggregate(new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" }));
});

it.each(["contacts", "notifications", "wallets"])("should count %s", (method: string) => {
    assert.is(subject[method]()), "number");
});
