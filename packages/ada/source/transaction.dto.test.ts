import { DTO } from "@payvo/sdk";

import Fixture from "../test/fixtures/client/transaction.json";
import { createService, requireModule } from "../test/mocking.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";

let subject: ConfirmedTransactionData;

test.before.each(async () => {
    subject = await createService(ConfirmedTransactionData);
    subject.configure(Fixture.data.transactions[0]);
});

describe("ConfirmedTransactionData", () => {
    it("#id", () => {
        assert.is(subject.id(), "35b40547f04963d3b41478fc27038948d74718802c486d9125f1884d8c83a31d");
    });

    it("#blockId", () => {
        assert.is(subject.blockId()), "undefined");
});

it("#timestamp", () => {
    assert.is(subject.timestamp().toISOString(), "2021-02-05T15:04:16.000Z");
});

it("#confirmations", () => {
    assert.is(subject.confirmations().toString(), "0");
});

it("#sender", () => {
    assert.is(subject.sender(),
        "addr_test1qrhvwtn8sa3duzkm93v5kjjxlv5lvg67j530wyeumngu23lk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33s4s8xvh",
    );
});

it("#recipient", () => {
    assert.is(subject.recipient(),
        "addr_test1qzct2hsralem3fqn8fupu90v3jkelpg4rfp4zqx06zgevpachk6az8jcydma5a6vgsuw5c37v0c8j6rlclpqajn2vxsq3rz4th",
    );
});

it("#recipients", () => {
    const actual = subject.recipients();
    assert.is(actual[0].address,
        "addr_test1qzct2hsralem3fqn8fupu90v3jkelpg4rfp4zqx06zgevpachk6az8jcydma5a6vgsuw5c37v0c8j6rlclpqajn2vxsq3rz4th",
    );
    assert.is(actual[0].amount.toString(), "25000000");
    assert.is(actual[1].address,
        "addr_test1qzfjfm724nv9qz6nfyagmj0j2uppr35gzv5qee8s7489wxlk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33scc4thv",
    );
    assert.is(actual[1].amount.toString(), "4831199");
});

it("#inputs", () => {
    const inputs = subject.inputs();
    assert.is(inputs).toBeArrayOfSize(1);
    assert.is(inputs[0] instanceof DTO.UnspentTransactionData);
    assert.is(inputs[0].id(), "6bf76f4380da8a389ae0a7ecccf1922b74ae11d773ba8b1b761d84a1b4474a4f");
    assert.is(inputs[0].amount().toString(), "30000000");
    assert.is(inputs[0].address(),
        "addr_test1qrhvwtn8sa3duzkm93v5kjjxlv5lvg67j530wyeumngu23lk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33s4s8xvh",
    );
});

it("#outputs", () => {
    const outputs = subject.outputs();
    assert.is(outputs).toBeArrayOfSize(2);
    assert.is(outputs[0] instanceof DTO.UnspentTransactionData);
    assert.is(outputs[0].amount().toString(), "25000000");
    assert.is(outputs[0].address(),
        "addr_test1qzct2hsralem3fqn8fupu90v3jkelpg4rfp4zqx06zgevpachk6az8jcydma5a6vgsuw5c37v0c8j6rlclpqajn2vxsq3rz4th",
    );
    assert.is(outputs[1] instanceof DTO.UnspentTransactionData);
    assert.is(outputs[1].amount().toString(), "4831199");
    assert.is(outputs[1].address(),
        "addr_test1qzfjfm724nv9qz6nfyagmj0j2uppr35gzv5qee8s7489wxlk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33scc4thv",
    );
});

it("#amount", () => {
    assert.is(subject.amount().toString(), "25000000");
});

it("#fee", () => {
    assert.is(subject.fee().toString(), "168801");
});

it("#asset", () => {
    assert.is(subject.asset(), {});
});

it("#isConfirmed", () => {
    assert.is(subject.isConfirmed(), false);
});

it("#isSent", () => {
    assert.is(subject.isSent(), false);
});

it("#isReceived", () => {
    assert.is(subject.isReceived(), false);
});

it("#isTransfer", () => {
    assert.is(subject.isTransfer(), true);
});

it("#isSecondSignature", () => {
    assert.is(subject.isSecondSignature(), false);
});

it("#isDelegateRegistration", () => {
    assert.is(subject.isDelegateRegistration(), false);
});

it("#isVoteCombination", () => {
    assert.is(subject.isVoteCombination(), false);
});

it("#isVote", () => {
    assert.is(subject.isVote(), false);
});

it("#isUnvote", () => {
    assert.is(subject.isUnvote(), false);
});

it("#isMultiSignatureRegistration", () => {
    assert.is(subject.isMultiSignatureRegistration(), false);
});

it("#isIpfs", () => {
    assert.is(subject.isIpfs(), false);
});

it("#isMultiPayment", () => {
    assert.is(subject.isMultiPayment(), false);
});

it("#isDelegateResignation", () => {
    assert.is(subject.isDelegateResignation(), false);
});

it("#isHtlcLock", () => {
    assert.is(subject.isHtlcLock(), false);
});

it("#isHtlcClaim", () => {
    assert.is(subject.isHtlcClaim(), false);
});

it("#isHtlcRefund", () => {
    assert.is(subject.isHtlcRefund(), false);
});

it("#isMagistrate", () => {
    assert.is(subject.isMagistrate(), false);
});
});
