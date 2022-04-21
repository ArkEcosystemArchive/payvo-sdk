import CardanoWasm from "@emurgo/cardano-serialization-lib-nodejs";
import { IoC, Services, Signatories } from "@payvo/sdk";
import { convertString } from "@payvo/sdk-helpers";
import { describe } from "@payvo/sdk-test";

import { createService } from "../test/mocking";
import { AddressService } from "./address.service.js";
import { ClientService } from "./client.service.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { KeyPairService } from "./key-pair.service.js";
import { PublicKeyService } from "./public-key.service.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { TransactionService } from "./transaction.service.js";
import { WalletData } from "./wallet.dto.js";

describe("TransactionService", async ({ assert, beforeAll, nock, loader, it }) => {
	beforeAll(async (context) => {
		context.subject = await createService(TransactionService, undefined, (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.constant(IoC.BindingType.DataTransferObjects, {
				ConfirmedTransactionData,
				SignedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
			container.singleton(IoC.BindingType.AddressService, AddressService);
			container.singleton(IoC.BindingType.ClientService, ClientService);
			container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
			container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
		});
	});

	it("#transfer should succeed", async (context) => {
		nock.fake(/.+/)
			.post("/")
			.reply(200, loader.json(`test/fixtures/transaction/transactions-page-1.json`))
			.post("/")
			.reply(200, loader.json(`test/fixtures/transaction/transactions-page-2.json`))
			.post("/")
			.reply(200, loader.json(`test/fixtures/transaction/utxos.json`))
			.post("/")
			.reply(200, loader.json(`test/fixtures/transaction/expiration.json`));

		const result = await context.subject.transfer({
			data: {
				amount: 1,
				to: "addr_test1qpz03ezdyda8ag724zp3n5fqulay02dp7j9mweyeylcaapsxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknscw3xw7",
			},
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					address:
						"aec30330deaecdd7503195a0d730256faef87027022b1bdda7ca0a61bca0a55e4d575af5a93bdf4905a3702fadedf451ea584791d233ade90965d608bac57304",
					privateKey: "privateKey",
					publicKey: "publicKey",
					signingKey:
						"excess behave track soul table wear ocean cash stay nature item turtle palm soccer lunch horror start stumble month panic right must lock dress",
				}),
			),
		});

		console.log(CardanoWasm.Transaction.from_bytes(convertString(result.toBroadcast())));

		assert.instance(result, SignedTransactionData);
		assert.is(result.id(), "2320a48ac62f19f6a5e028cc8b33e4ffce8dc2684d20b1cb7b703e534a3bf454");
		assert.is(result.amount().toString(), "1000000");
		assert.is(
			result.toBroadcast(),
			"84a400818258204dc971406792e2c7eac907743043148868fb73d1931476f55abe3a0fc08749c40101828258390044f8e44d237a7ea3caa88319d120e7fa47a9a1f48bb7649927f1de8606e2ae44dff6770dc0f4ada3cf4cf2605008e27aecdb332ad349fda71a000f4240825839009324efcaacd8500b53493a8dc9f2570211c68813280ce4f0f54e571bf63ad603a628ea1f7397b90b0d13274543fe50a4ef5819ec332ffc631a3a6d5286021a0002917d031a029624a0a10081825820a39421323978b0c5a0d481701b185a70f147e298f760f6082a3b0b44245c841c5840b74e9732a261b834a35b624c9cc146423fd97212c5bddcc40aaab20792ca86ab84fc522e4785f099a309e9e132c70056745c446e111de85b18da0ab245f24b07f5f6",
		);
	});
});
