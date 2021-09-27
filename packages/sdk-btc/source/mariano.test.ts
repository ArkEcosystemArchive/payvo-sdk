import "jest-extended";
import { Exceptions } from "@payvo/sdk";
import * as bitcoin from "bitcoinjs-lib";
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid-singleton";
import logger from "@ledgerhq/logs";
import { jest } from "@jest/globals";
import { Bip44Address } from "./contracts";
import BtcApp from "@ledgerhq/hw-app-btc";

const network = bitcoin.networks.testnet;

let ledger: BtcApp;

beforeEach(async () => {
	logger.listen((log) => console.info(log.type + ": " + log.message));
	// @ts-ignore
	const transport = await TransportNodeHid.default.create();

	// @ts-ignore
	ledger = new BtcApp.default(transport);
});

afterEach(async () => {
	// @ts-ignore
	await TransportNodeHid.default.disconnect();
});

jest.setTimeout(60_000);

const splitTransaction = (ledger: BtcApp, tx: bitcoin.Transaction) =>
	ledger.splitTransaction(tx.toHex(), tx.hasWitnesses());

const getOutputScript = async (network: bitcoin.networks.Network, outputs: any[]): Promise<string> => {
	const psbt = new bitcoin.Psbt({ network: network });
	outputs.forEach((output) =>
		psbt.addOutput({
			address: output.address,
			value: output.value,
		}),
	);
	// @ts-ignore
	const newTx: bitcoin.Transaction = psbt.__CACHE.__TX;
	const outLedgerTx = splitTransaction(ledger, newTx);

	return await ledger.serializeTransactionOutputs(outLedgerTx).toString("hex");
};

describe.skip("bip44 wallet", () => {
	const changeAddress: Bip44Address = {
		path: "m/44'/1'/0'/1/0",
		address: "n3LhrsyE8g1Ga2XPGuXfRkaPcipevENLre",
		status: "unused",
	};
	const to = "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn";

	const amount = 220_000; // sats
	const inputs: any[] = [
		{
			address: "mvVAfs3MCDYg7HokDhL6pPuef6KZLPdUUz",
			txId: "67c2cc6fe363bbf4a15083cc3c230f497a964049486b12b7815c5028ed19eca0",
			txRaw: "02000000000101e6946a967297d4d31622d2738fd5eb253dd641cd1e548ddfc8899c20d417edab0000000000feffffff022ddb60000000000017a914fd74bd3b653f0905ec955ff2d9d7a24d9910f9b487a0860100000000001976a914a43362c51b5ab6b2476c55e0a88452533e1a155a88ac0247304402207c1ea29f8b5a6104994d37f202364a15c398ae00fe8b27a01a89ea221a69fb11022013bbc97d646ec2d767e6f06e83781923cfb4d03168fdb10003a7b072a334e683012102c87c5c38f61500ea311a181b5dacd9d4d8c513b88875d8f8a7abe883c062d3dac09f1e00",
			script: "76a914a43362c51b5ab6b2476c55e0a88452533e1a155a88ac",
			vout: 1,
			value: 100000,
			signingKey: undefined,
			publicKey: Buffer.from("02c51a1a843e4661e603d7d28279dcf58c065f8a217818fa00202b666aa56faa8b", "hex"),
			path: "m/44'/1'/0'/0/0",
			nonWitnessUtxo: Buffer.from(
				"02000000000101e6946a967297d4d31622d2738fd5eb253dd641cd1e548ddfc8899c20d417edab0000000000feffffff022ddb60000000000017a914fd74bd3b653f0905ec955ff2d9d7a24d9910f9b487a0860100000000001976a914a43362c51b5ab6b2476c55e0a88452533e1a155a88ac0247304402207c1ea29f8b5a6104994d37f202364a15c398ae00fe8b27a01a89ea221a69fb11022013bbc97d646ec2d767e6f06e83781923cfb4d03168fdb10003a7b072a334e683012102c87c5c38f61500ea311a181b5dacd9d4d8c513b88875d8f8a7abe883c062d3dac09f1e00",
				"hex",
			),
			signer: undefined,
		},
		{
			address: "msy7ZqCfVFBuNAf4GJSEnrpc9HMpn6mPV2",
			txId: "a8ce11e894c7f5178d086584486efb836432c9e7eb1a7030aa4d3a4e39cdb394",
			txRaw: "010000000001011e28480a71d4bb1eafa75eb082fd97926c6542afd15678c98d1eca0a91b43a2a0000000000000000000230750000000000001976a91488941076e6adf6063892bf338783f805d582c9b388acde100100000000001600140ab1eb8e14afc44bfcbe551762186ebbabc5a7980247304402204b53cdb65d9604fd997d90106476aa8b72d1c8042d1e9a7c0248646a0cfdf53f02200802246764b7cc125c2180f5738d962a12373de554ed27cedcadab18cf1febe7012102823b744a0a42c15851c1d8cd6415a792474dad4a401d997f96c7185985164e2d00000000",
			script: "76a91488941076e6adf6063892bf338783f805d582c9b388ac",
			vout: 0,
			value: 30000,
			signingKey: undefined,
			publicKey: Buffer.from("02984ae876070ed2ed81cc9c5a8bddffea40e26d84b1982bb62ae6397753f5d465", "hex"),
			path: "m/44'/1'/0'/0/1",
			nonWitnessUtxo: Buffer.from(
				"010000000001011e28480a71d4bb1eafa75eb082fd97926c6542afd15678c98d1eca0a91b43a2a0000000000000000000230750000000000001976a91488941076e6adf6063892bf338783f805d582c9b388acde100100000000001600140ab1eb8e14afc44bfcbe551762186ebbabc5a7980247304402204b53cdb65d9604fd997d90106476aa8b72d1c8042d1e9a7c0248646a0cfdf53f02200802246764b7cc125c2180f5738d962a12373de554ed27cedcadab18cf1febe7012102823b744a0a42c15851c1d8cd6415a792474dad4a401d997f96c7185985164e2d00000000",
				"hex",
			),
			signer: undefined,
		},
		{
			address: "n4pMT65JrzLCfA6ErNX63yb6GvcA2oMwtA",
			txId: "285614f13fabd80bc50f32ef9fee4e3107e40f793e1ba16a1c81dda6c2327555",
			txRaw: "020000000001019404d857a439f2ef694e11ea4aae205227a944c4ada7feba006d499b65d6b19b0100000000feffffff0233fbb7000000000017a914390ad85a6b10a50ab02e0f8cee65dd9c33f8d69287a0860100000000001976a914ff954b38c974ae46f6908a496896c53a833330cb88ac0247304402202fad643d4b023d2e8f156a0e0723094760baaa0aa9fcd07271ea4de87d2193fd022025c246eeb104c52b77fb8b5abe7f6f6c45db96e4b73d1297e75f1f4c477509f20121032065b9938030e4c5eaa83594a0d83c4065c8cdd6380853793b4167af60a9278e6ff61f00",
			script: "76a914ff954b38c974ae46f6908a496896c53a833330cb88ac",
			vout: 1,
			value: 100000,
			signingKey: undefined,
			publicKey: Buffer.from("02a48d814cf59127b67de921a0fbaf5bbc97464b2335c62566c3a2265aad43860b", "hex"),
			path: "m/44'/1'/0'/0/2",
			nonWitnessUtxo: Buffer.from(
				"020000000001019404d857a439f2ef694e11ea4aae205227a944c4ada7feba006d499b65d6b19b0100000000feffffff0233fbb7000000000017a914390ad85a6b10a50ab02e0f8cee65dd9c33f8d69287a0860100000000001976a914ff954b38c974ae46f6908a496896c53a833330cb88ac0247304402202fad643d4b023d2e8f156a0e0723094760baaa0aa9fcd07271ea4de87d2193fd022025c246eeb104c52b77fb8b5abe7f6f6c45db96e4b73d1297e75f1f4c477509f20121032065b9938030e4c5eaa83594a0d83c4065c8cdd6380853793b4167af60a9278e6ff61f00",
				"hex",
			),
			signer: undefined,
		},
	];

	const outputs = [
		{
			address: to,
			value: amount,
		},
		{ address: changeAddress.address, value: 230000 - amount - 5000 },
	];

	it("should generate a transfer transaction and sign it with ledger nano using BtcApp", async () => {
		console.log("outputs", outputs);
		const outputScriptHex = await getOutputScript(network, outputs);
		console.log("outputScriptHex", outputScriptHex);
		const transactionHex = await ledger.createPaymentTransactionNew({
			inputs: inputs.map((input, index) => {
				console.log("input", input);
				const inLedgerTx = splitTransaction(ledger, bitcoin.Transaction.fromHex(input.txRaw));
				return [inLedgerTx, input.vout as number, undefined, undefined];
			}),
			associatedKeysets: inputs.map((input) => input.path),
			changePath: changeAddress.path,
			additionals: [],
			outputScriptHex,
			segwit: inputs.some((input) => input.path.match(/49|84'/) !== null),
		});

		expect(transactionHex).toBe(
			"0100000003a0ec19ed28505c81b7126b484940967a490f233ccc8350a1f4bb63e36fccc267010000006b483045022100cf729a6dca37e89f0b4a14896959e90317e9ef8fb146c4f4b618ca09dbc21d9702206d01754c6cb2a2aa3709df0d73fc17a93ada1308972d7f14f0b8950154c8387c012102c51a1a843e4661e603d7d28279dcf58c065f8a217818fa00202b666aa56faa8bffffffff94b3cd394e3a4daa30701aebe7c9326483fb6e488465088d17f5c794e811cea8000000006b4830450221008532c17f643addb017fd3620060418ba7ca8bb0ffd2c583cb4c7ec6f0b1ef882022003995d5340ab1b11ba1697c3cfee3fde511195165b3d2dfe73cc69b601cc5a9f012102984ae876070ed2ed81cc9c5a8bddffea40e26d84b1982bb62ae6397753f5d465ffffffff557532c2a6dd811c6aa11b3e790fe407314eee9fef320fc50bd8ab3ff1145628010000006a473044022070d94998c115fcc8dd7e0595e9c24b5bb8bbe0b35a6a31b170210d0e41ce3ca6022073655173947979fba0ddedc2b277868e8ec7593e42d0442ee3dc90769a8717d1012102a48d814cf59127b67de921a0fbaf5bbc97464b2335c62566c3a2265aad43860bffffffff02605b030000000000160014f3e9df76d5ccbfb4e29c047a942815a32a477ac488130000000000001976a914ef628f069100b9831b592ea20a1d446e5de2c01588ac00000000",
		);
	});

	it("should generate a transfer transaction and sign it with ledger nano using Pbtc + BtcApp", async () => {
		const psbt = new bitcoin.Psbt({ network });
		inputs.forEach((input) =>
			psbt.addInput({
				hash: input.txId,
				index: input.vout,
				...input,
			}),
		);
		outputs.forEach((output) =>
			psbt.addOutput({
				address: output.address,
				value: output.value,
			}),
		);

		const outputScriptHex = await getOutputScript(network, outputs);

		// @ts-ignore
		const newTx: bitcoin.Transaction = psbt.__CACHE.__TX;

		const inputsForSigning = inputs.map((input) => ({
			inLedgerTx: splitTransaction(ledger, bitcoin.Transaction.fromHex(input.txRaw)),
			index: input.vout,
			script: input.script,
			path: input.path,
		}));
		const signer: bitcoin.Signer = {
			network,
			publicKey: inputs[0].publicKey,
			// @ts-ignore
			sign: async ($hash: Buffer): Promise<Buffer> => {
				console.info("$hash", $hash);
				const ledgerTxSignatures = await ledger.signP2SHTransaction({
					inputs: inputsForSigning.map((input) => [input.inLedgerTx, input.index, input.script, undefined]),
					associatedKeysets: inputsForSigning.map((input) => input.path),
					outputScriptHex,
					segwit: newTx.hasWitnesses(),
				});
				const [ledgerSignature] = ledgerTxSignatures;
				const finalSignature = (() => {
					if (newTx.hasWitnesses()) {
						return Buffer.from(ledgerSignature, "hex");
					}
					return Buffer.concat([Buffer.from(ledgerSignature, "hex"), Buffer.from("01", "hex")]);
				})();
				console.log({
					finalSignature: finalSignature.toString("hex"),
				});
				const { signature } = bitcoin.script.signature.decode(finalSignature);
				return signature;
			},
		};

		// Sign and verify signatures
		await psbt.signAllInputsAsync(signer);
		// for (const input1 of inputs) {
		// 	const index = inputs.indexOf(input1);
		// 	await psbt.signInputAsync(index, input1.signer);
		// }

		if (!psbt.validateSignaturesOfAllInputs()) {
			throw new Exceptions.Exception("There was a problem signing the transaction locally.");
		}
		await psbt.finalizeAllInputs();

		expect(psbt.extractTransaction().toHex()).toBe("");
	});
});

describe.skip("bip49 wallet", () => {
	const changeAddress: Bip44Address = {
		path: "m/49'/1'/0'/1/1",
		address: "2NByjSULyMEkygcskxGSacykeAiPRYZuNwy",
		status: "unused",
	};
	const to = "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn";

	const amount = 70_000; // sats
	const inputs: any[] = [
		{
			address: "2Mx8BgV28sZNRfxej4LYwdQFxuAVFfomE5x",
			txId: "1e5d87c6d39346c50a71b48072b95c8e1618d0051d00c1b004d692a26a41c5ad",
			txRaw: "01000000000101d4e042fb27460be8d962578bf183d11a348517ea8a601e0395bfeaaac96e2942010000001716001471897d984468d8fb600b2eba60ee3d737c90ea6b0000000002409c00000000000016001459a4852c42177df1e9f8375a1b05f8e32825bfd7b8e900000000000017a9143583ca9ecbbc0243c04bb32a5c91dde5c131fc328702483045022100a3bbfb14c02491d4dd82529ce5d6022577dd4f02dcc0c0a58199f0c3ef0038e502205b8b97fe2fa274cf376f3b1b48e2630ce597d0e8975087e14c41e91382841b3d0121038bd2835af1ed447588b19d896ed4c550084bb3dc5f5e6b4998ed8b4774962f2900000000",
			script: "a9143583ca9ecbbc0243c04bb32a5c91dde5c131fc3287",
			vout: 1,
			value: 59832,
			signingKey: undefined,
			publicKey: "03de2db824354a86e663d615af1982e9ddf9a16565175961670f32091600ec1b28",
			path: "m/49'/1'/0'/1/0",
			witnessUtxo: {
				script: "a9143583ca9ecbbc0243c04bb32a5c91dde5c131fc3287",
				value: 59832,
			},
			redeemScript: Buffer.from("00148eb5fdd59771c49650cf7808784fe080d532b307", "hex"),
		},
		{
			address: "2N7r2MdRF8crWp9n31FGS4khEzbCxqyhyt8",
			txId: "de148feda978c203f529781f72ff1539fa5c82f033bd8c60ecf3861f75010eca",
			txRaw: "0200000000010154b852d5e2d9859206a99118503a4826e4d1fda1c44a53914992877b556641ed01000000171600143c2c9959f7ad65bcb64bce3a151a606720ce4162feffffff02bf7c60010000000017a914c2f58c308c2617a7ac64ab56902386861c3a7ed78750c300000000000017a914a0269c180ab12c2334ac5af78a585098c71a1aac870247304402204bef84ccc6a3f65a3cdf5245dbf2418c8f47c1a0e7258aad10999bb5457930e802204ebcc7ca62ebca9a54b2d72448778d97b0cf2172fc8680b015e88f8c76321cb60121033dcbec2ffb07ff25faf068a0985fd6696158c473b2a7b0e22ed6ee7bea3d984a5cfa1f00",
			script: "a914a0269c180ab12c2334ac5af78a585098c71a1aac87",
			vout: 1,
			value: 50000,
			signingKey: undefined,
			publicKey: "021e723637da0432ff9e9de6fdac2a070daaeaf6d6cb795ae42a965b81941e59ac",
			path: "m/49'/1'/0'/0/2",
			witnessUtxo: {
				script: "a914a0269c180ab12c2334ac5af78a585098c71a1aac87",
				value: 50000,
			},
			redeemScript: Buffer.from("00140f49ae97db28cee136efb9c15fbd9fa87df6cca5", "hex"),
		},
	];

	const outputs = [
		{
			address: to,
			value: amount,
		},
		{
			address: changeAddress.address,
			value: inputs.reduce((carry, item) => carry + item.value, 0) - amount - 2520,
		},
	];

	it("should generate a transfer transaction and sign it with ledger nano using BtcApp", async () => {
		console.log("outputs", outputs);
		const outputScriptHex = await getOutputScript(network, outputs);
		console.log("outputScriptHex", outputScriptHex);
		const isSegwit = inputs.some((input) => input.path.match(/49|84'/) !== null); //Always true as the wallet is bip49
		console.log("isSegwit", isSegwit);
		const transactionHex = await ledger.createPaymentTransactionNew({
			inputs: inputs.map((input, index) => {
				console.log("input", input);
				const inLedgerTx = splitTransaction(ledger, bitcoin.Transaction.fromHex(input.txRaw));
				return [inLedgerTx, input.vout as number, undefined, undefined];
			}),
			associatedKeysets: inputs.map((input) => input.path),
			changePath: changeAddress.path,
			additionals: [],
			outputScriptHex,
			sigHashType: bitcoin.Transaction.SIGHASH_ALL, // 1
			segwit: isSegwit,
		});
		console.log(bitcoin.Transaction.fromHex(transactionHex));

		expect(transactionHex).toBe(
			"01000000000102adc5416aa292d604b0c1001d05d018168e5cb97280b4710ac54693d3c6875d1e01000000171600148eb5fdd59771c49650cf7808784fe080d532b307ffffffffca0e01751f86f3ec608cbd33f0825cfa3915ff721f7829f503c278a9ed8f14de01000000171600140f49ae97db28cee136efb9c15fbd9fa87df6cca5ffffffff027011010000000000160014f3e9df76d5ccbfb4e29c047a942815a32a477ac4c09100000000000017a914cd7c51c3f3a5ad8533215c499e55fef1d07f852d87024730440220624fca06ae5bf584e37f0a252c0d9a56fbf6d672153a5e5305cfcbb0c4a255c90220589a693fe06609cfb35177962f31b5d1fd492a402041e9283118a0d5b79a4a36012103de2db824354a86e663d615af1982e9ddf9a16565175961670f32091600ec1b2802473044022061219ee1d48659620c33e0482912ea03cdc730fba3c4f1a4807d4f8bb921dd3402200553d1aa9a19d9604df6304e12ce288ad4a1b764ad5166df68afa3af9095dcbe0121021e723637da0432ff9e9de6fdac2a070daaeaf6d6cb795ae42a965b81941e59ac00000000",
		);
	});
});

describe.skip("bip84 wallet", () => {
	const changeAddress: Bip44Address = {
		path: "m/84'/1'/0'/1/1",
		address: "tb1q28sfszezu2m897hru9d74dh7ymuufq3qreqe74",
		status: "unused",
	};
	const to = "mvVAfs3MCDYg7HokDhL6pPuef6KZLPdUUz";

	const amount = 104_000; // sats
	const inputs: any[] = [
		{
			address: "tb1qp2c7hrs54lzyhl9725tkyxrwhw4utfucagjk62",
			txId: "a8ce11e894c7f5178d086584486efb836432c9e7eb1a7030aa4d3a4e39cdb394",
			txRaw: "010000000001011e28480a71d4bb1eafa75eb082fd97926c6542afd15678c98d1eca0a91b43a2a0000000000000000000230750000000000001976a91488941076e6adf6063892bf338783f805d582c9b388acde100100000000001600140ab1eb8e14afc44bfcbe551762186ebbabc5a7980247304402204b53cdb65d9604fd997d90106476aa8b72d1c8042d1e9a7c0248646a0cfdf53f02200802246764b7cc125c2180f5738d962a12373de554ed27cedcadab18cf1febe7012102823b744a0a42c15851c1d8cd6415a792474dad4a401d997f96c7185985164e2d00000000",
			script: "00140ab1eb8e14afc44bfcbe551762186ebbabc5a798",
			vout: 1,
			value: 69854,
			signingKey: undefined,
			publicKey: Buffer.from("023764fe32c78a9dea4cfdcf4682f0992d2724d65507dfe840d9f63a39dbe767c4", "hex"),
			path: "m/84'/1'/0'/1/0",
			witnessUtxo: {
				script: "00140ab1eb8e14afc44bfcbe551762186ebbabc5a798",
				value: 69854,
			},
		},
		{
			address: "tb1qtxjg2tzzza7lr60cxadpkp0cuv5zt07h0r2hxs",
			txId: "1e5d87c6d39346c50a71b48072b95c8e1618d0051d00c1b004d692a26a41c5ad",
			txRaw: "01000000000101d4e042fb27460be8d962578bf183d11a348517ea8a601e0395bfeaaac96e2942010000001716001471897d984468d8fb600b2eba60ee3d737c90ea6b0000000002409c00000000000016001459a4852c42177df1e9f8375a1b05f8e32825bfd7b8e900000000000017a9143583ca9ecbbc0243c04bb32a5c91dde5c131fc328702483045022100a3bbfb14c02491d4dd82529ce5d6022577dd4f02dcc0c0a58199f0c3ef0038e502205b8b97fe2fa274cf376f3b1b48e2630ce597d0e8975087e14c41e91382841b3d0121038bd2835af1ed447588b19d896ed4c550084bb3dc5f5e6b4998ed8b4774962f2900000000",
			script: "001459a4852c42177df1e9f8375a1b05f8e32825bfd7",
			vout: 0,
			value: 40000,
			signingKey: undefined,
			publicKey: Buffer.from("03ef85b0f883dbcfe5af7620703d5c3b810eb0ebf462102cd33ecd2f610dec6ede>", "hex"),
			path: "m/84'/1'/0'/0/1",
			witnessUtxo: {
				script: "001459a4852c42177df1e9f8375a1b05f8e32825bfd7",
				value: 40000,
			},
		},
	];

	const outputs = [
		{
			address: to,
			value: amount,
		},
		{
			address: changeAddress.address,
			value: inputs.reduce((carry, item) => carry + item.value, 0) - amount - 5000,
		},
	];

	it("should generate a transfer transaction and sign it with ledger nano using BtcApp", async () => {
		console.log("outputs", outputs);
		const outputScriptHex = await getOutputScript(network, outputs);
		console.log("outputScriptHex", outputScriptHex);
		const isSegwit = inputs.some((input) => input.path.match(/49|84'/) !== null); //Always true as the wallet is bip84
		console.log("isSegwit", isSegwit);
		const transactionHex = await ledger.createPaymentTransactionNew({
			inputs: inputs.map((input, index) => {
				console.log("input", input);
				const inLedgerTx = splitTransaction(ledger, bitcoin.Transaction.fromHex(input.txRaw));
				return [inLedgerTx, input.vout as number, undefined, undefined];
			}),
			associatedKeysets: inputs.map((input) => input.path),
			changePath: changeAddress.path,
			additionals: ["bech32"],
			outputScriptHex,
			useTrustedInputForSegwit: true,
			sigHashType: bitcoin.Transaction.SIGHASH_ALL, // 1
			segwit: isSegwit,
		});
		console.log(bitcoin.Transaction.fromHex(transactionHex));

		expect(transactionHex).toBe(
			"0100000000010294b3cd394e3a4daa30701aebe7c9326483fb6e488465088d17f5c794e811cea80100000000ffffffffadc5416aa292d604b0c1001d05d018168e5cb97280b4710ac54693d3c6875d1e0000000000ffffffff0240960100000000001976a914a43362c51b5ab6b2476c55e0a88452533e1a155a88ac560300000000000016001451e0980b22e2b672fae3e15beab6fe26f9c48220024730440220518cbdfe6a5ee03f5811996fcb3a196e69a8ed546a0bb6d4efc18cbcc7e9158602200e15e01c2dd69c0cd19f384931c4d0dc2c42c99cde67c3eabf52b1556d2e8b190121023764fe32c78a9dea4cfdcf4682f0992d2724d65507dfe840d9f63a39dbe767c40247304402206349141fda50c421fb7c519bad016e52e5ee806de7f53f98625d3156d9f8a0ad02205f688bc27dcb27bae0ec5490f00e6060656ad1bdbf14fb8666ef0a14ab0fc5a1012103ef85b0f883dbcfe5af7620703d5c3b810eb0ebf462102cd33ecd2f610dec6ede00000000",
		);
	});
});
