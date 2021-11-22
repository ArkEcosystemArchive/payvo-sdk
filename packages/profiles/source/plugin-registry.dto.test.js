import { assert, describe, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { RegistryPlugin } from "./plugin-registry.dto";

describe("RegistryPlugin", ({ afterEach, beforeEach, test }) => {
	describe("sourceProvider", ({ afterEach, beforeEach, test }) => {
		for (const [company, project] of [
			["company", "project"],
			["COMPANY", "PROJECT"],
		]) {
			test("should handle github source provider", async () => {
				const subject = new RegistryPlugin(
					{
						links: {
							repository: `https://github.com/${company}/${project}`,
						},
					},
					{},
				);

				assert.is(subject.sourceProvider().url, `https://github.com/${company}/${project}`);
			});
		}

		for (const [company, project] of [
			["company", "project"],
			["COMPANY", "PROJECT"],
		]) {
			test("should handle bitbucket source provider", async () => {
				const subject = new RegistryPlugin(
					{
						links: {
							repository: `https://bitbucket.com/${company}/${project}`,
						},
					},
					{},
				);

				assert.is(subject.sourceProvider().url, `https://bitbucket.com/${company}/${project}`);
			});
		}

		for (const [company, project] of [
			["company", "project"],
			["COMPANY", "PROJECT"],
		]) {
			test("should handle gitlab source provider", async () => {
				const subject = new RegistryPlugin(
					{
						links: {
							repository: `https://gitlab.com/${company}/${project}`,
						},
					},
					{},
				);

				assert.is(subject.sourceProvider().url, `https://gitlab.com/${company}/${project}`);
			});
		}

		test("should handle unknown source provider", async () => {
			const subject = new RegistryPlugin(
				{
					links: {
						repository: "https://mycompany.com/project",
					},
				},
				{},
			);

			assert.null(subject.sourceProvider());
		});
	});

	describe("getMetadata", ({ afterEach, beforeEach, test }) => {
		test("should find the requested key", async () => {
			const subject = new RegistryPlugin(
				{},
				{
					title: "someValue",
				},
			);

			assert.is(subject.alias(), "someValue");
		});

		test("should find the requested desktop-wallet key", async () => {
			const subject = new RegistryPlugin(
				{},
				{
					"desktop-wallet": {
						logo: "someValue",
					},
				},
			);

			assert.is(subject.logo(), "someValue");
		});

		test("should miss the requested desktop-wallet key", async () => {
			const subject = new RegistryPlugin(
				{},
				{
					"desktop-wallet": {
						title: "someValue",
					},
				},
			);

			assert.undefined(subject.logo());
		});

		test("should miss the requested key", async () => {
			const subject = new RegistryPlugin(
				{},
				{
					title: "someValue",
				},
			);

			assert.undefined(subject.logo());
		});
	});
});

test.run();
