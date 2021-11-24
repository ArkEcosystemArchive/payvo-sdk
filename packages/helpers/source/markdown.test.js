import { describe } from "@payvo/sdk-test";

import { Markdown } from "./markdown";

describe("Markdown", async ({ assert, it }) => {
	it("should parse the markdown into an object", () => {
		assert.equal(
			Markdown.parse(`---
title: Just hack'n
description: Nothing to see here
---

# Remarkable rulezz!`),
			{
				meta: {
					description: "Nothing to see here",
					title: "Just hack'n",
				},
				content: "<h1>Remarkable rulezz!</h1>",
			},
		);
	});
});
