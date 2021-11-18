import { DTO } from "@payvo/sdk";

import Fixture from "../test/fixtures/client/transaction.json";
import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";

let subject: ConfirmedTransactionData;

test.before.each(async () => {
    subject = await createService(ConfirmedTransactionData);
    subject.configure(Fixture.data.transactions[0]);
});

describe("ConfirmedTransactionData", () => {
    test("#id", () => {
        assert.is(subject.id(), "35b40547f04963d3b41478fc27038948d74718802c486d9125f1884d8c83a31d");
    });

    test("#blockId", () => {
        assert.is(subject.blockId()), "undefined");
});

test("#timestamp", () => {
    assert.is(subject.timestamp().toISOString(), "2021-02-05T15:04:16.000Z");
});

test("#confirmations", () => {
    assert.is(subject.confirmations().toString(), "0");
});

test("#sender", () => {
    assert.is(subject.sender(),
        "addr_test1qrhvwtn8sa3duzkm93v5kjjxlv5lvg67j530wyeumngu23lk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33s4s8xvh",
    );
});

test("#recipient", () => {
    assert.is(subject.recipient(),
        "addr_test1qzct2hsralem3fqn8fupu90v3jkelpg4rfp4zqx06zgevpachk6az8jcydma5a6vgsuw5c37v0c8j6rlclpqajn2vxsq3rz4th",
    );
});

test("#recipients", () => {
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

test("#inputs", () => {
    const inputs = subject.inputs();
    assert.is(inputs).toBeArrayOfSize(1);
    assert.is(inputs[0] instanceof DTO.UnspentTransactionData);
    assert.is(inputs[0].id(), "6bf76f4380da8a389ae0a7ecccf1922b74ae11d773ba8b1b761d84a1b4474a4f");
    assert.is(inputs[0].amount().toString(), "30000000");
    assert.is(inputs[0].address(),
        "addr_test1qrhvwtn8sa3duzkm93v5kjjxlv5lvg67j530wyeumngu23lk8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33s4s8xvh",
    );
});

test("#outputs", () => {
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

test("#amount", () => {
    assert.is(subject.amount().toString(), "25000000");
});

test("#fee", () => {
    assert.is(subject.fee().toString(), "168801");
});

test("#asset", () => {
    assert.is(subject.asset(), {});
});

test("#isConfirmed", () => {
    assert.is(subject.isConfirmed(), false);
});

test("#isSent", () => {
    assert.is(subject.isSent(), false);
});

test("#isReceived", () => {
    assert.is(subject.isReceived(), false);
});

test("#isTransfer", () => {
    assert.is(subject.isTransfer(), true);
});

test("#isSecondSignature", () => {
    assert.is(subject.isSecondSignature(), false);
});

test("#isDelegateRegistration", () => {
    assert.is(subject.isDelegateRegistration(), false);
});

test("#isVoteCombination", () => {
    assert.is(subject.isVoteCombination(), false);
});

test("#isVote", () => {
    assert.is(subject.isVote(), false);
});

test("#isUnvote", () => {
    assert.is(subject.isUnvote(), false);
});

test("#isMultiSignatureRegistration", () => {
    assert.is(subject.isMultiSignatureRegistration(), false);
});

test("#isIpfs", () => {
    assert.is(subject.isIpfs(), false);
});

test("#isMultiPayment", () => {
    assert.is(subject.isMultiPayment(), false);
});

test("#isDelegateResignation", () => {
    assert.is(subject.isDelegateResignation(), false);
});

test("#isHtlcLock", () => {
    assert.is(subject.isHtlcLock(), false);
});

test("#isHtlcClaim", () => {
    assert.is(subject.isHtlcClaim(), false);
});

test("#isHtlcRefund", () => {
    assert.is(subject.isHtlcRefund(), false);
});

test("#isMagistrate", () => {
    assert.is(subject.isMagistrate(), false);
});
});
