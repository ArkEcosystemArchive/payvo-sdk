import "reflect-metadata";

import { describe } from "@payvo/sdk-test";

import { bootContainer } from "../test/mocking";
import { CountAggregate } from "./count.aggregate";
import { Profile } from "./profile";

describe("CountAggregate", async ({ beforeEach, assert, each }) => {
	beforeEach(async (context) => {
		bootContainer({ flush: true });

		context.subject = new CountAggregate(new Profile({ avatar: "avatar", data: "", id: "uuid", name: "name" }));
	});

	each("should count %s", ({ context, dataset }) => {
		assert.number(context.subject[dataset]());
	}, ["contacts", "notifications", "wallets"]);
});
