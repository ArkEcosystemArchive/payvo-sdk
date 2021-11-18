import "reflect-metadata";

import { RegistryPlugin } from "./plugin-registry.dto";

describe("RegistryPlugin", () => {
    describe("sourceProvider", () => {
        it.each([
            ["company", "project"],
            ["COMPANY", "PROJECT"],
        ])("should handle github source provider", async (company, project) => {
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

        it.each([
            ["company", "project"],
            ["COMPANY", "PROJECT"],
        ])("should handle bitbucket source provider", async (company, project) => {
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

        it.each([
            ["company", "project"],
            ["COMPANY", "PROJECT"],
        ])("should handle gitlab source provider", async (company, project) => {
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

        test("should handle unknown source provider", async () => {
            const subject = new RegistryPlugin(
                {
                    links: {
                        repository: "https://mycompany.com/project",
                    },
                },
                {},
            );

            assert.is(subject.sourceProvider()).toBeNull();
        });
    });

    describe("getMetadata", () => {
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

            assert.is(subject.logo()), "undefined");
    });

    test("should miss the requested key", async () => {
        const subject = new RegistryPlugin(
            {},
            {
                title: "someValue",
            },
        );

        assert.is(subject.logo()), "undefined");
});
    });
});
