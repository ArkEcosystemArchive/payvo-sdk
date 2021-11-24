import "jest-extended";

import { IoC, Services, Signatories } from "@payvo/sdk";
import nock from "nock";

import { createService, requireModule } from "../test/mocking";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { KeyPairService } from "./key-pair.service";
import { PublicKeyService } from "./public-key.service";
import { TransactionService } from "./transaction.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";
import CardanoWasm from "@emurgo/cardano-serialization-lib-nodejs";
import { convertString } from "../../helpers/source";

let subject: TransactionService;

beforeAll(async () => {
	subject = await createService(TransactionService, undefined, (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
	});
});

afterEach(() => nock.cleanAll());

beforeAll(async () => {
	nock.disableNetConnect();
});

describe("TransactionService", () => {
	describe("#transfer", () => {
		it("is correct", async () => {
			nock(/.+/)
				.post("/")
				.reply(200, requireModule(`../test/fixtures/transaction/transactions-page-1.json`))
				.post("/")
				.reply(200, requireModule(`../test/fixtures/transaction/transactions-page-2.json`))
				.post("/")
				.reply(200, requireModule(`../test/fixtures/transaction/utxos.json`))
				.post("/")
				.reply(200, requireModule(`../test/fixtures/transaction/expiration.json`));

			const result = await subject.transfer({
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey:
							"excess behave track soul table wear ocean cash stay nature item turtle palm soccer lunch horror start stumble month panic right must lock dress",
						address:
							"aec30330deaecdd7503195a0d730256faef87027022b1bdda7ca0a61bca0a55e4d575af5a93bdf4905a3702fadedf451ea584791d233ade90965d608bac57304",
						publicKey: "publicKey",
						privateKey: "privateKey",
					}),
				),
				data: {
					amount: 1,
					to: "addr_test1qpz03ezdyda8ag724zp3n5fqulay02dp7j9mweyeylcaapsxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknscw3xw7",
				},
			});

			CardanoWasm.Transaction.from_bytes(convertString(result.toBroadcast()));

			expect(result).toBeInstanceOf(SignedTransactionData);
			expect(result.id()).toBe("e2e75b04c4b1dc4d4b3db14166fb02cb26f5b9ed3c49b1e1c8379a21502dc77c");
			expect(result.amount().toString()).toBe("1000000");
			expect(result.toBroadcast()).toBe(
				"83a40081825820844def3c505ec24317f8f539a001989951c37a9dea5764e87e60654a86358a4d0001828258390044f8e44d237a7ea3caa88319d120e7fa47a9a1f48bb7649927f1de8606e2ae44dff6770dc0f4ada3cf4cf2605008e27aecdb332ad349fda71a000f4240825839009324efcaacd8500b53493a8dc9f2570211c68813280ce4f0f54e571bf63ad603a628ea1f7397b90b0d13274543fe50a4ef5819ec332ffc631a3b74159e021a00029151031a016c301ea10081825820f9162b91126212b71500e89dc7da31111dfc1466a9f24f48a34e7ea529d2d3385840df186965621768ce54cbe83493e8c5e3feba56f24c15f9033802254e566afc1eadb15af83068dc76cdb243fc7b3d58dd9849bf9d7a83fa2a1b7499f96a723c01f6",
			);
		});
	});
});
