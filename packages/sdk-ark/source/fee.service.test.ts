import "jest-extended";

import nock from "nock";

import { createService, require } from "../test/mocking";
import { FeeService } from "./fee.service";

const matchSnapshot = (transaction): void =>
	expect({
		min: transaction.min.toString(),
		avg: transaction.avg.toString(),
		max: transaction.max.toString(),
		static: transaction.static.toString(),
	}).toMatchSnapshot();

afterEach(() => nock.cleanAll());

beforeAll(() => nock.disableNetConnect());

describe("FeeService", () => {
	it("should get the fees for ARK", async () => {
		nock(/.+/)
			.get("/api/node/fees")
			.reply(200, await require(`../test/fixtures/client/feesByNode.json`))
			.get("/api/transactions/fees")
			.reply(200, await require(`../test/fixtures/client/feesByType.json`));

		const result = await (await createService(FeeService, "ark.devnet")).all();

		expect(result).toContainAllKeys([
			"transfer",
			"secondSignature",
			"delegateRegistration",
			"vote",
			"multiSignature",
			"ipfs",
			"multiPayment",
			"delegateResignation",
			"htlcLock",
			"htlcClaim",
			"htlcRefund",
		]);

		matchSnapshot(result.transfer);
		matchSnapshot(result.secondSignature);
		matchSnapshot(result.delegateRegistration);
		matchSnapshot(result.vote);
		matchSnapshot(result.multiSignature);
		matchSnapshot(result.ipfs);
		matchSnapshot(result.multiPayment);
		matchSnapshot(result.delegateResignation);
		matchSnapshot(result.htlcLock);
		matchSnapshot(result.htlcClaim);
		matchSnapshot(result.htlcRefund);
	});

	it("should get the fees for BIND", async () => {
		nock(/.+/)
			.get("/api/node/fees")
			.reply(200, await require(`../test/fixtures/client/feesByNode-bind.json`))
			.get("/api/transactions/fees")
			.reply(200, await require(`../test/fixtures/client/feesByType-bind.json`));

		const result = await (await createService(FeeService, "bind.testnet")).all();

		expect(result).toContainAllKeys([
			"transfer",
			"secondSignature",
			"delegateRegistration",
			"vote",
			"multiSignature",
			"ipfs",
			"multiPayment",
			"delegateResignation",
			"htlcLock",
			"htlcClaim",
			"htlcRefund",
		]);

		matchSnapshot(result.transfer);
		matchSnapshot(result.secondSignature);
		matchSnapshot(result.delegateRegistration);
		matchSnapshot(result.vote);
		matchSnapshot(result.multiSignature);
		matchSnapshot(result.ipfs);
		matchSnapshot(result.multiPayment);
		matchSnapshot(result.delegateResignation);
		matchSnapshot(result.htlcLock);
		matchSnapshot(result.htlcClaim);
		matchSnapshot(result.htlcRefund);
	});

	it("should calculate the fees for ARK", async () => {
		nock(/.+/)
			.get("/api/node/fees")
			.reply(200, await require(`../test/fixtures/client/feesByNode.json`))
			.get("/api/transactions/fees")
			.reply(200, await require(`../test/fixtures/client/feesByType.json`))
			.persist();

		const a = await (
			await createService(FeeService, "ark.devnet")
		).calculate({
			type: 4,
			asset: { multiSignature: { publicKeys: ["a", "b", "c"] } },
		});
		const b = await (await createService(FeeService, "ark.devnet")).calculate({ type: 1 });

		expect(a.toHuman()).toBe(20);
		expect(b.toHuman()).toBe(0);
	});
});
