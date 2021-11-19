import { assert, describe, mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { bootContainer } from "../test/mocking";
import { Profile } from "./profile";
import { CountAggregate } from "./count.aggregate";

let subject;

test.before(() => bootContainer());

test.before.each(async () => {
	subject = new CountAggregate(new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" }));
});

// it.each(["contacts", "notifications", "wallets"])("should count %s", (method) => {
// 	assert.number(subject[method]());
// });

test.run();
