import { assert, describe, stub, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { bootContainer } from "../test/mocking";
import { Profile } from "./profile";
import { CountAggregate } from "./count.aggregate";

let subject;

test.before(() => bootContainer());

test.before.each(async () => {
	subject = new CountAggregate(new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" }));
});

for (const method of ["contacts", "notifications", "wallets"]) {
	test(`should count ${method}`, () => {
		assert.number(subject[method]());
	});
}

test.run();
