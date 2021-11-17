import "jest-extended";

import { identity } from "../test/fixtures/identity.js";
import { createService, requireModule } from "../test/mocking.js";
import { PublicKeyService } from "./public-key.service";

let subject: PublicKeyService;

beforeEach(async () => {
    subject = await createService(PublicKeyService);
});

describe("PublicKey", () => {
    it("should generate an output from a mnemonic", async () => {
        const result = await subject.fromMnemonic(identity.mnemonic);

        expect(result).toEqual({ publicKey: identity.publicKey });
    });

    it("should fail to generate an output from an invalid mnemonic", async () => {
        await expect(subject.fromMnemonic(identity.mnemonic.slice(0, 10))).rejects.toThrowError();
    });
});
