/* eslint-disable unicorn/no-array-push-push */
import { describeWithContext } from "@payvo/sdk-test";

import { bootContainer } from "../test/mocking.js";
import { HostRepository } from "./host.repository.js";
import { Profile } from "./profile.js";

describeWithContext(
	"HostRepository",
	{
		explorer: {
			host: "https://explorer.ark.io",
			type: "explorer",
		},
		full: {
			host: "https://ark-live.payvo.com/api",
			type: "full",
		},
		musig: {
			host: "https://ark-live-musig.payvo.com",
			type: "musig",
		},
	},
	({ beforeEach, assert, it }) => {
		beforeEach((context) => {
			bootContainer();

			context.subject = new HostRepository(new Profile({ avatar: "avatar", data: "", id: "uuid", name: "name" }));
		});

		it("#all", (context) => {
			assert.length(Object.keys(context.subject.all()), 0);

			context.subject.push("ark.mainnet", context.full);
			context.subject.push("ark.mainnet", context.musig);
			context.subject.push("ark.mainnet", context.explorer);

			assert.length(Object.keys(context.subject.all()), 1);
		});

		it("#allByNetwork", (context) => {
			assert.length(context.subject.allByNetwork("ark.mainnet"), 0);

			context.subject.push("ark.mainnet", context.full);

			assert.array(context.subject.allByNetwork("ark.mainnet"));
		});

		it("#push", (context) => {
			assert.length(Object.keys(context.subject.all()), 0);

			context.subject.push("ark.mainnet", context.full);

			assert.length(context.subject.all().ark.mainnet, 1);

			context.subject.push("ark.mainnet", context.full);

			assert.length(context.subject.all().ark.mainnet, 2);
		});

		it("#fill", (context) => {
			assert.length(Object.keys(context.subject.all()), 0);

			context.subject.push("ark.mainnet", context.full);
			context.subject.push("ark.mainnet", context.full);
			context.subject.push("ark.mainnet", context.full);

			assert.length(Object.keys(context.subject.all().ark.mainnet), 3);

			context.subject.fill(context.subject.all());

			assert.length(Object.keys(context.subject.all().ark.mainnet), 3);
		});

		it("#forget", (context) => {
			assert.length(context.subject.allByNetwork("ark.mainnet"), 0);

			context.subject.push("ark.mainnet", context.full);

			assert.length(context.subject.allByNetwork("ark.mainnet"), 1);

			context.subject.forget("ark.mainnet", 0);

			assert.length(context.subject.allByNetwork("ark.mainnet"), 0);
		});
	},
);
