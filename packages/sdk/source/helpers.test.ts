import "jest-extended";

import { jest } from "@jest/globals";

import { ConfigRepository } from "./coins/index.js";
import { filterHostsFromConfig, pluckAddress, randomNetworkHostFromConfig, randomHostFromConfig } from "./helpers.js";

afterEach(() => jest.restoreAllMocks());

const configMock = {
    get: () => [
        {
            type: "full",
            host: "https://wallets.ark.io",
        },
        {
            type: "musig",
            host: "https://musig1.ark.io",
        },
        {
            type: "explorer",
            host: "https://explorer.ark.io",
        },
    ],
} as unknown as ConfigRepository;

test("filterHostsFromConfig", () => {
    expect(filterHostsFromConfig(configMock, "explorer")).toEqual([
        {
            type: "explorer",
            host: "https://explorer.ark.io",
        },
    ]);
});

test("randomNetworkHostFromConfig", () => {
    expect(randomNetworkHostFromConfig(configMock, "explorer")).toEqual({
        type: "explorer",
        host: "https://explorer.ark.io",
    });
});

test("randomNetworkHostFromConfig default", () => {
    expect(randomNetworkHostFromConfig(configMock)).toEqual({
        type: "full",
        host: "https://wallets.ark.io",
    });
});

test("randomHostFromConfig default", () => {
    expect(randomHostFromConfig(configMock)).toBe("https://wallets.ark.io");
});

describe("pluckAddress", () => {
    test("senderId", () => {
        expect(pluckAddress({ senderId: "senderId" })).toBe("senderId");
    });

    test("recipientId", () => {
        expect(pluckAddress({ recipientId: "recipientId" })).toBe("recipientId");
    });

    test("addresses", () => {
        expect(pluckAddress({ identifiers: [{ value: "addresses" }] })).toBe("addresses");
    });

    test("addresses", () => {
        expect(() => pluckAddress({ key: "value" })).toThrow("Failed to pluck any address.");
    });
});
