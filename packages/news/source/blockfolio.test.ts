import { Request } from "@payvo/sdk-fetch";
import { describe } from "@payvo/sdk-test";

import { Blockfolio } from "./blockfolio.js";

describe("FeedService", async ({ assert, beforeEach, it, nock }) => {
	beforeEach((context) => {
		context.subject = new Blockfolio(new Request());
	});

	it("should retrieve the feed and findByCoin it", async (context) => {
		nock.fake("https://news.payvo.com")
			.get("/api")
			.query(true)
			.reply(200, {
				data: [
					{
						author: { name: "Travis Walker", team: "Team Ark", title: "Co-Founder" },
						category: "Technical",
						created_at: "2020-07-21T17:54:34.000000Z",
						id: 952,
						is_featured: false,
						links: [
							"https://blog.ark.io/ark-platform-sdk-modernization-of-blockchain-network-interactions-b5a7d70c2461",
						],
						text: "Recently we released our all-in-one toolkit the ARK Platform SDK, along with an overview and what blockchain projects it will initially support. Today we are going into more details on a technical level. https://blog.ark.io/ark-platform-sdk-modernization-of-blockchain-network-interactions-b5a7d70c2461",
						updated_at: "2020-07-21T17:54:34.000000Z",
					},
					{
						author: { name: "Travis Walker", team: "Team Ark", title: "Co-Founder" },
						category: "Marketing",
						created_at: "2020-07-03T16:20:04.000000Z",
						id: 921,
						is_featured: false,
						links: ["https://blog.ark.io/ark-monthly-update-june-2020-edition-279a3dd47a36"],
						text: "June is over and it's time for the Monthly Update. This blog post will cover last month\u2019s highlights, activities, development, partner activities, news and updates of our upcoming releases. https://blog.ark.io/ark-monthly-update-june-2020-edition-279a3dd47a36",
						updated_at: "2020-07-03T16:20:04.000000Z",
					},
					{
						author: { name: "Travis Walker", team: "Team Ark", title: "Co-Founder" },
						category: "Community",
						created_at: "2020-07-15T17:43:57.000000Z",
						id: 941,
						is_featured: false,
						links: [
							"https://blog.ark.io/new-anti-encryption-bill-is-the-largest-threat-to-our-privacy-today-68a85216ed2d",
						],
						text: "Government representatives want to attack encryption and implement mandatory backdoors to access your information, what does this mean for you? https://blog.ark.io/new-anti-encryption-bill-is-the-largest-threat-to-our-privacy-today-68a85216ed2d",
						updated_at: "2020-07-15T17:43:57.000000Z",
					},
					{
						author: { name: "Travis Walker", team: "Team Ark", title: "Co-Founder" },
						category: "Community",
						created_at: "2020-07-13T16:15:17.000000Z",
						id: 938,
						is_featured: false,
						links: ["https://youtu.be/AslAEyPZnXQ"],
						text: "With the recent ARK Desktop Wallet updates for v2.9.3, we want to go over some changes and features with a new walk through video. https://youtu.be/AslAEyPZnXQ",
						updated_at: "2020-07-13T16:15:17.000000Z",
					},
					{
						author: { name: "Travis Walker", team: "Team Ark", title: "Co-Founder" },
						category: "Marketing",
						created_at: "2020-07-03T18:57:10.000000Z",
						id: 922,
						is_featured: false,
						links: ["https://ark.io/podcast/ark-crypto-podcast-082-arkio-monthly-update-june-2020"],
						text: "The 82nd episode of the ARK Crypto Podcast is here! This week, we go over everything you might have missed that happened recently for ARK. https://ark.io/podcast/ark-crypto-podcast-082-arkio-monthly-update-june-2020",
						updated_at: "2020-07-03T18:57:10.000000Z",
					},
					{
						author: { name: "Travis Walker", team: "Team Ark", title: "Co-Founder" },
						category: "Technical",
						created_at: "2020-07-02T15:59:52.000000Z",
						id: 919,
						is_featured: false,
						links: ["https://blog.ark.io/ark-development-report-june-2020-20c2a42857a5"],
						text: "June is behind us and it is time once again for the Monthly Development Report. With over 250k lines of code added, June was very productive. Let's go deep into detail in the blog post. https://blog.ark.io/ark-development-report-june-2020-20c2a42857a5",
						updated_at: "2020-07-02T15:59:52.000000Z",
					},
					{
						author: { name: "Travis Walker", team: "Team Ark", title: "Co-Founder" },
						category: "Marketing",
						created_at: "2020-06-04T19:29:15.000000Z",
						id: 875,
						is_featured: false,
						links: ["https://blog.ark.io/ark-monthly-update-may-2020-edition-af9ccd426e9b"],
						text: "May is over and it's time for the Monthly Update. This blog post will cover last month\u2019s highlights, activities, development, partner activities, news and updates of our upcoming releases. https://blog.ark.io/ark-monthly-update-may-2020-edition-af9ccd426e9b",
						updated_at: "2020-06-04T19:29:15.000000Z",
					},
					{
						author: { name: "Travis Walker", team: "Team Ark", title: "Co-Founder" },
						category: "Marketing",
						created_at: "2020-06-19T14:25:57.000000Z",
						id: 915,
						is_featured: false,
						links: [
							"https://ark.io/podcast/ark-crypto-podcast-080-protokol-enterprise-solutions-soft-launch-interview-part-1",
						],
						text: "The 80th episode of the ARK Crypto Podcast is here! This week we welcome Protokol, ARK's new enterprise entity, to the show. We introduce the team, dive into Protokol's mission and answer community questions. https://ark.io/podcast/ark-crypto-podcast-080-protokol-enterprise-solutions-soft-launch-interview-part-1",
						updated_at: "2020-06-19T14:25:57.000000Z",
					},
					{
						author: { name: "Travis Walker", team: "Team Ark", title: "Co-Founder" },
						category: "Technical",
						created_at: "2020-05-05T14:04:27.000000Z",
						id: 502,
						is_featured: false,
						links: ["https://blog.ark.io/ark-development-report-april-2020-dbf050601d62"],
						text: "The April Development Report is here. With over 31,000 lines of code added and 1,000 files changed, it was a very productive month. Let's go into more detail and cover everything that happened in the entire ARK Ecosystem Public GitHub Repository in this blog post. https://blog.ark.io/ark-development-report-april-2020-dbf050601d62",
						updated_at: "2020-05-05T14:04:27.000000Z",
					},
					{
						author: { name: "Travis Walker", team: "Team Ark", title: "Co-Founder" },
						category: "Technical",
						created_at: "2020-04-29T16:41:55.000000Z",
						id: 507,
						is_featured: false,
						links: [
							"https://blog.ark.io/launching-html5-games-in-the-ark-desktop-wallet-part-six-ad887fd2e888",
						],
						text: "The final part of our game developer tutorial is here. This 6 part series will help you convert HTML5 games into ARK Desktop Wallet Plugins. In this part, we finalize our plugin to run in the ARK Wallet and play our game! https://blog.ark.io/launching-html5-games-in-the-ark-desktop-wallet-part-six-ad887fd2e888",
						updated_at: "2020-04-29T16:41:55.000000Z",
					},
					{
						author: { name: "Travis Walker", team: "Team Ark", title: "Co-Founder" },
						category: "Technical",
						created_at: "2020-04-27T16:38:57.000000Z",
						id: 508,
						is_featured: false,
						links: [
							"https://blog.ark.io/launching-html5-games-in-the-ark-desktop-wallet-part-five-a2cf1d32be20",
						],
						text: "Part 5 of our game developer tutorial is here! This series will help you convert HTML5 games into ARK Desktop Wallet Plugins. In this part, we implement prize logic and payouts utilizing multipayments. https://blog.ark.io/launching-html5-games-in-the-ark-desktop-wallet-part-five-a2cf1d32be20",
						updated_at: "2020-04-27T16:38:57.000000Z",
					},
					{
						author: { name: "Travis Walker", team: "Team Ark", title: "Co-Founder" },
						category: "Community",
						created_at: "2020-04-14T16:40:25.000000Z",
						id: 516,
						is_featured: false,
						links: [
							"https://blog.ark.io/ark-is-now-available-on-the-swipe-app-with-visa-card-and-in-app-exchange-for-europe-and-beyond-ecf9e8374aef",
						],
						text: "ARK was recently added to Swipe Wallet and Swipe Visa Card. Let's go over what that means, where it's available and what Swipe is. https://blog.ark.io/ark-is-now-available-on-the-swipe-app-with-visa-card-and-in-app-exchange-for-europe-and-beyond-ecf9e8374aef",
						updated_at: "2020-04-14T16:40:25.000000Z",
					},
					{
						author: { name: "Travis Walker", team: "Team Ark", title: "Co-Founder" },
						category: "Marketing",
						created_at: "2020-04-09T17:50:33.000000Z",
						id: 518,
						is_featured: false,
						links: ["https://youtu.be/FpB64_timVM"],
						text: "With ARK Core 2.6 live and running let's quickly go over newly developed features and transaction types in this animated video. https://youtu.be/FpB64_timVM",
						updated_at: "2020-04-09T17:50:33.000000Z",
					},
					{
						author: { name: "Travis Walker", team: "Team Ark", title: "Co-Founder" },
						category: "Technical",
						created_at: "2018-08-07T18:16:36.000000Z",
						id: 845,
						is_featured: false,
						links: ["https://blog.ark.io/ark-core-v2-progress-update-b1c5d5f19a23"],
						text: "As we near open DevNet v2 release we want to give everyone a quick Core v2 progress update. https://blog.ark.io/ark-core-v2-progress-update-b1c5d5f19a23",
						updated_at: "2019-04-01T20:51:15.000000Z",
					},
					{
						author: { name: "Travis Walker", team: "Team Ark", title: "Co-Founder" },
						category: "Technical",
						created_at: "2020-04-02T18:23:18.000000Z",
						id: 525,
						is_featured: false,
						links: ["https://blog.ark.io/lets-explore-core-part-4-extensibility-c60522f1b700"],
						text: "Let's Explore ARK Core v3 Part 4. Diving into a technical breakdown of the upcoming ARK Core v3. In this part, we\u2019ll learn about the extensibility and testability of Core packages and why this is important. https://blog.ark.io/lets-explore-core-part-4-extensibility-c60522f1b700",
						updated_at: "2020-04-02T18:23:18.000000Z",
					},
				],
				links: {
					first: "https://platform.ark.io/api/coins/ark/signals?page=1",
					last: "https://platform.ark.io/api/coins/ark/signals?page=27",
					next: "https://platform.ark.io/api/coins/ark/signals?page=2",
					prev: null,
				},
				meta: {
					current_page: 1,
					from: 1,
					last_page: 27,
					path: "https://platform.ark.io/api/coins/ark/signals",
					per_page: 15,
					to: 15,
					total: 399,
				},
			});

		const result = await context.subject.findByCoin({ coins: ["ARK"] });

		assert.type(result, "object");
		assert.ok(Array.isArray(result.data));
		assert.type(result.meta, "object");
	});
});
