import "jest-extended";

import { IoC, Services } from "@payvo/sdk";
import nock from "nock";

import { createService } from "../test/mocking";
import { FeeService } from "./fee.service";
import { DataTransferObjects } from "./coin.dtos";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { KeyPairService } from "./key-pair.service";
import { LedgerService } from "./ledger.service";
import { PublicKeyService } from "./public-key.service";
import { MultiSignatureService } from "./multi-signature.service";
import { TransactionSerializer } from "./transaction.serializer";
import { BindingType } from "./coin.contract";
import { AssetSerializer } from "./asset.serializer";

let subject: FeeService;

beforeAll(() => {
	nock.disableNetConnect();
});

beforeEach(async () => {
	subject = createService(FeeService, "lsk.testnet", (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		container.singleton(IoC.BindingType.LedgerService, LedgerService);
		container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
		container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
		container.singleton(BindingType.AssetSerializer, AssetSerializer);
		container.singleton(BindingType.TransactionSerializer, TransactionSerializer);
	});
});

describe("FeeService", () => {
	describe("#all", () => {
		it("should succeed", async () => {
			const result = await subject.all();

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

			expect(result.transfer.min.toString()).toBe("10000000");
			expect(result.transfer.avg.toString()).toBe("10000000");
			expect(result.transfer.max.toString()).toBe("10000000");
			expect(result.transfer.static.toString()).toBe("10000000");
		});
	});

	test("#calculate", async () => {
		nock(/.+/)
			.get("/api/v2/fees")
			.reply(200, require(`${__dirname}/../test/fixtures/client/fees.json`))
			.persist();

		const transaction = {
			moduleID: 4,
			assetID: 0,
			senderPublicKey: "5e93fd5cfe306ea2c34d7082a6c79692cf2f5c6e07aa6f9b4a11b4917d33f16b",
			nonce: "2",
			fee: "314000",
			asset: {
				numberOfSignatures: 2,
				mandatoryKeys: [
					"5e93fd5cfe306ea2c34d7082a6c79692cf2f5c6e07aa6f9b4a11b4917d33f16b",
					"c4fbe7dbc9cc52dd33b2b10cddd8d023c1ff30e1bcbb45fc813550540668295c",
				],
				optionalKeys: [],
			},
		};

		const slow = await subject.calculate(transaction, { priority: "slow" });
		const average = await subject.calculate(transaction, { priority: "average" });
		const fast = await subject.calculate(transaction, { priority: "fast" });

		expect(slow.toHuman()).toBeNumber();
		expect(slow.toHuman()).toBe(0.00314);
		expect(average.toHuman()).toBeNumber();
		expect(average.toHuman()).toBe(0.00314);
		expect(fast.toHuman()).toBeNumber();
		expect(fast.toHuman()).toBe(0.00314);
	});
});
