import "jest-extended";

import { Services } from "@payvo/sdk";

import { createService } from "../test/mocking";

let subject: Services.AbstractLinkService;

describe("ark.mainnet", () => {
    beforeAll(async () => {
        subject = await createService(Services.AbstractLinkService, "ark.mainnet");
    });

    it("should generate a link for a block", async () => {
        expect(subject.block("id")).toMatchInlineSnapshot(`"https://explorer.ark.io/block/id"`);
    });

    it("should generate a link for a transaction", async () => {
        expect(subject.transaction("id")).toMatchInlineSnapshot(`"https://explorer.ark.io/transaction/id"`);
    });

    it("should generate a link for a wallet", async () => {
        expect(subject.wallet("id")).toMatchInlineSnapshot(`"https://explorer.ark.io/wallets/id"`);
    });
});

describe("ark.devnet", () => {
    beforeAll(async () => {
        subject = await createService(Services.AbstractLinkService, "ark.devnet");
    });

    it("should generate a link for a block", async () => {
        expect(subject.block("id")).toMatchInlineSnapshot(`"https://dexplorer.ark.io/block/id"`);
    });

    it("should generate a link for a transaction", async () => {
        expect(subject.transaction("id")).toMatchInlineSnapshot(`"https://dexplorer.ark.io/transaction/id"`);
    });

    it("should generate a link for a wallet", async () => {
        expect(subject.wallet("id")).toMatchInlineSnapshot(`"https://dexplorer.ark.io/wallets/id"`);
    });
});

describe("bind.mainnet", () => {
    beforeAll(async () => {
        subject = await createService(Services.AbstractLinkService, "bind.mainnet");
    });

    it("should generate a link for a block", async () => {
        expect(subject.block("id")).toMatchInlineSnapshot(`"https://bindscan.io/block/id"`);
    });

    it("should generate a link for a transaction", async () => {
        expect(subject.transaction("id")).toMatchInlineSnapshot(`"https://bindscan.io/transaction/id"`);
    });

    it("should generate a link for a wallet", async () => {
        expect(subject.wallet("id")).toMatchInlineSnapshot(`"https://bindscan.io/wallets/id"`);
    });
});

describe("bind.testnet", () => {
    beforeAll(async () => {
        subject = await createService(Services.AbstractLinkService, "bind.testnet");
    });

    it("should generate a link for a block", async () => {
        expect(subject.block("id")).toMatchInlineSnapshot(`"https://testnet.bindscan.io/block/id"`);
    });

    it("should generate a link for a transaction", async () => {
        expect(subject.transaction("id")).toMatchInlineSnapshot(`"https://testnet.bindscan.io/transaction/id"`);
    });

    it("should generate a link for a wallet", async () => {
        expect(subject.wallet("id")).toMatchInlineSnapshot(`"https://testnet.bindscan.io/wallets/id"`);
    });
});

describe("xqr.mainnet", () => {
    beforeAll(async () => {
        subject = await createService(Services.AbstractLinkService, "xqr.mainnet");
    });

    it("should generate a link for a block", async () => {
        expect(subject.block("id")).toMatchInlineSnapshot(`"https://explorer.sh/qredit/block/id"`);
    });

    it("should generate a link for a transaction", async () => {
        expect(subject.transaction("id")).toMatchInlineSnapshot(`"https://explorer.sh/qredit/transaction/id"`);
    });

    it("should generate a link for a wallet", async () => {
        expect(subject.wallet("id")).toMatchInlineSnapshot(`"https://explorer.sh/qredit/wallet/id"`);
    });
});

describe("xqr.testnet", () => {
    beforeAll(async () => {
        subject = await createService(Services.AbstractLinkService, "xqr.testnet");
    });

    it("should generate a link for a block", async () => {
        expect(subject.block("id")).toMatchInlineSnapshot(`"https://explorer.sh/qredit-testnet/block/id"`);
    });

    it("should generate a link for a transaction", async () => {
        expect(subject.transaction("id")).toMatchInlineSnapshot(`"https://explorer.sh/qredit-testnet/transaction/id"`);
    });

    it("should generate a link for a wallet", async () => {
        expect(subject.wallet("id")).toMatchInlineSnapshot(`"https://explorer.sh/qredit-testnet/wallet/id"`);
    });
});

describe("bpl.mainnet", () => {
    beforeAll(async () => {
        subject = await createService(Services.AbstractLinkService, "bpl.mainnet");
    });

    it("should generate a link for a block", async () => {
        expect(subject.block("id")).toMatchInlineSnapshot(`"https://explorer.blockpool.io/#/block/id"`);
    });

    it("should generate a link for a transaction", async () => {
        expect(subject.transaction("id")).toMatchInlineSnapshot(`"https://explorer.blockpool.io/#/transaction/id"`);
    });

    it("should generate a link for a wallet", async () => {
        expect(subject.wallet("id")).toMatchInlineSnapshot(`"https://explorer.blockpool.io/#/wallets/id"`);
    });
});
