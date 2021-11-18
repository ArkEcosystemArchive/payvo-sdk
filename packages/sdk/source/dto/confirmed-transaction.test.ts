/* eslint-disable */

import "reflect-metadata";


import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import { MultiPaymentRecipient, UnspentTransactionData } from "../contracts.js";
import { AbstractConfirmedTransactionData } from "./confirmed-transaction.js";

test("#withDecimals", () => {
    assert.is(new Transaction().configure({ key: "value" }).withDecimals(2) instanceof Transaction);
    assert.is(new Transaction().configure({ key: "value" }).withDecimals("2") instanceof Transaction);
});

test("#id", () => {
    assert.is(new Transaction().configure({ key: "value" }).id(), "id");
});

test("#blockId", () => {
    assert.is(new Transaction().configure({ key: "value" }).blockId(), "blockId");
});

test("#type", () => {
    const subject = new Transaction().configure({ key: "value" });

    assert.is(subject.type(), "transfer");

    jest.spyOn(subject, "isMagistrate").mockReturnValue(true);

    assert.is(subject.type(), "magistrate");
});

test("#timestamp", () => {
    assert.is(new Transaction().configure({ key: "value" }).timestamp()), "undefined");
});

test("#confirmations", () => {
    assert.is(new Transaction().configure({ key: "value" }).confirmations(), BigNumber.ZERO);
});

test("#sender", () => {
    assert.is(new Transaction().configure({ key: "value" }).sender(), "sender");
});

test("#recipient", () => {
    assert.is(new Transaction().configure({ key: "value" }).recipient(), "recipient");
});

test("#recipients", () => {
    assert.is(new Transaction().configure({ key: "value" }).recipients(), []);
});

test("#amount", () => {
    assert.is(new Transaction().configure({ key: "value" }).amount(), BigNumber.ZERO);
});

test("#fee", () => {
    assert.is(new Transaction().configure({ key: "value" }).fee(), BigNumber.ZERO);
});

test("#memo", () => {
    assert.is(new Transaction().configure({ key: "value" }).memo(), "memo");
    assert.is(new Transaction().configure({ memo: "" }).memo()), "undefined");
assert.is(new Transaction().configure({ memo: "pedo" }).memo(), "****");
assert.is(new Transaction().configure({ memo: "pedophile" }).memo(), "*********");
assert.is(new Transaction().configure({ memo: "zyva.org" }).memo()), "undefined");
});

test("#asset", () => {
    assert.is(new Transaction().configure({ key: "value" }).asset(), {});
});

test("#isConfirmed", () => {
    assert.is(new Transaction().configure({ key: "value" }).isConfirmed(), false);
});

test("#isSent", () => {
    assert.is(new Transaction().configure({ key: "value" }).isSent(), false);
});

test("#isReceived", () => {
    assert.is(new Transaction().configure({ key: "value" }).isReceived(), false);
});

test("#isTransfer", () => {
    assert.is(new Transaction().configure({ key: "value" }).isTransfer(), false);
});

test("#isSecondSignature", () => {
    assert.is(new Transaction().configure({ key: "value" }).isSecondSignature(), false);
});

test("#isDelegateRegistration", () => {
    assert.is(new Transaction().configure({ key: "value" }).isDelegateRegistration(), false);
});

test("#isVoteCombination", () => {
    assert.is(new Transaction().configure({ key: "value" }).isVoteCombination(), false);
});

test("#isVote", () => {
    assert.is(new Transaction().configure({ key: "value" }).isVote(), false);
});

test("#isUnvote", () => {
    assert.is(new Transaction().configure({ key: "value" }).isUnvote(), false);
});

test("#isMultiSignatureRegistration", () => {
    assert.is(new Transaction().configure({ key: "value" }).isMultiSignatureRegistration(), false);
});

test("#isIpfs", () => {
    assert.is(new Transaction().configure({ key: "value" }).isIpfs(), false);
});

test("#isMultiPayment", () => {
    assert.is(new Transaction().configure({ key: "value" }).isMultiPayment(), false);
});

test("#isDelegateResignation", () => {
    assert.is(new Transaction().configure({ key: "value" }).isDelegateResignation(), false);
});

test("#isHtlcLock", () => {
    assert.is(new Transaction().configure({ key: "value" }).isHtlcLock(), false);
});

test("#isHtlcClaim", () => {
    assert.is(new Transaction().configure({ key: "value" }).isHtlcClaim(), false);
});

test("#isHtlcRefund", () => {
    assert.is(new Transaction().configure({ key: "value" }).isHtlcRefund(), false);
});

test("#isMagistrate", () => {
    assert.is(new Transaction().configure({ key: "value" }).isMagistrate(), false);
});

test("#isUnlockToken", () => {
    assert.is(new Transaction().configure({ key: "value" }).isUnlockToken(), false);
});

test("#toObject", () => {
    assert.is(new Transaction().configure({ key: "value" }).toObject()).toMatchInlineSnapshot(`
		Object {
		  "amount": BigNumber {},
		  "asset": Object {},
		  "confirmations": BigNumber {},
		  "fee": BigNumber {},
		  "id": "id",
		  "recipient": "recipient",
		  "sender": "sender",
		  "timestamp": undefined,
		  "type": "transfer",
		}
	`);
});

test("#raw", () => {
    assert.is(new Transaction().configure({ key: "value" }).raw()).toMatchInlineSnapshot(`
		Object {
		  "key": "value",
		}
	`);
});

test("#hasPassed", () => {
    assert.is(new Transaction().configure({ key: "value" }).hasPassed(), true);
    assert.is(new Transaction().configure({}).hasPassed(), false);
});

test("#hasFailed", () => {
    assert.is(new Transaction().configure({}).hasFailed(), true);
    assert.is(new Transaction().configure({ key: "value" }).hasFailed(), false);
});

test("#getMeta | #setMeta", () => {
    const subject = new Transaction().configure({});

    assert.is(subject.getMeta("key")), "undefined");

subject.setMeta("key", "value");

assert.is(subject.getMeta("key"), "value");
});

class Transaction extends AbstractConfirmedTransactionData {
    // @ts-ignore
    public id(): string {
        return "id";
    }

    // @ts-ignore
    public blockId(): string | undefined {
        return "blockId";
    }

    // @ts-ignore
    public timestamp(): DateTime | undefined {
        return undefined;
    }

    // @ts-ignore
    public confirmations(): BigNumber {
        return BigNumber.ZERO;
    }

    // @ts-ignore
    public sender(): string {
        return "sender";
    }

    // @ts-ignore
    public recipient(): string {
        return "recipient";
    }

    // @ts-ignore
    public recipients(): MultiPaymentRecipient[] {
        return [];
    }

    // @ts-ignore
    public amount(): BigNumber {
        return BigNumber.ZERO;
    }

    // @ts-ignore
    public fee(): BigNumber {
        return BigNumber.ZERO;
    }

    // @ts-ignore
    public memo(): string | undefined {
        if (this.data.hasOwnProperty("memo")) {
            return this.censorMemo(this.data.memo);
        }

        return this.censorMemo("memo");
    }

    // @ts-ignore
    public asset(): Record<string, unknown> {
        return {};
    }

    // @ts-ignore
    public inputs(): UnspentTransactionData[] {
        return [];
    }

    // @ts-ignore
    public outputs(): UnspentTransactionData[] {
        return [];
    }

    // @ts-ignore
    public isConfirmed(): boolean {
        return false;
    }

    // @ts-ignore
    public isSent(): boolean {
        return false;
    }

    // @ts-ignore
    public isReceived(): boolean {
        return false;
    }

    // @ts-ignore
    public isTransfer(): boolean {
        return false;
    }
}
