import { Buffer } from "buffer";
import CardanoWasm, {
	Address,
	BigNum,
	Bip32PrivateKey,
	Bip32PublicKey,
	TransactionBuilder,
	TransactionInput,
} from "@emurgo/cardano-serialization-lib-nodejs";
import { Coins, Http, Networks } from "@payvo/sdk";

import { fetchUsedAddressesData } from "./graphql-helpers.js";
import {
	addressFromAccountExtPublicKey as addressFromAccountExtensionPublicKey,
	deriveAddress,
	deriveChangeKey,
	deriveSpendKey,
} from "./shelley.js";
import { createValue } from "./transaction.factory.js";
import { UnspentTransaction } from "./transaction.models.js";

export const usedAddressesForAccount = async (
	config: Coins.ConfigRepository,
	httpClient: Http.HttpClient,
	hostSelector: Networks.NetworkHostSelector,
	accountPublicKey: string,
) => {
	const networkId: string = config.get<string>("network.meta.networkId");
	const usedSpendAddresses: Set<string> = new Set<string>();
	const usedChangeAddresses: Set<string> = new Set<string>();

	let offset = 0;
	let exhausted = false;
	do {
		const spendAddresses: string[] = await addressesChunk(networkId, accountPublicKey, false, offset);
		const changeAddresses: string[] = await addressesChunk(networkId, accountPublicKey, true, offset);

		const allAddresses = spendAddresses.concat(changeAddresses);
		const usedAddresses: string[] = await fetchUsedAddressesData(config, httpClient, hostSelector, allAddresses);

		for (const sa of spendAddresses.filter((sa) => usedAddresses.find((ua) => ua === sa) !== undefined)) {
			usedSpendAddresses.add(sa);
		}
		for (const sa of changeAddresses.filter((sa) => usedAddresses.find((ua) => ua === sa) !== undefined)) {
			usedChangeAddresses.add(sa);
		}

		exhausted = usedAddresses.length === 0;
		offset += 20;
	} while (!exhausted);
	return { usedChangeAddresses, usedSpendAddresses };
};

const addressesChunk = async (
	networkId: string,
	accountPublicKey: string,
	isChange: boolean,
	offset: number,
): Promise<string[]> => {
	const publicKey = Buffer.from(accountPublicKey, "hex");

	const addresses: string[] = [];
	for (let index = offset; index < offset + 20; ++index) {
		addresses.push(addressFromAccountExtensionPublicKey(publicKey, isChange, index, networkId));
	}
	return addresses;
};

export const addUtxoInput = (
	txBuilder: TransactionBuilder,
	input: UnspentTransaction,
): { added: boolean; amount: BigNum; fee: BigNum } => {
	const wasmAddr = Address.from_bech32(input.address);
	const txInput = utxoToTxInput(input);
	const wasmAmount = createValue(input.value);

	// ignore UTXO that contribute less than their fee if they also don't contribute a token
	const feeForInput = txBuilder.fee_for_input(wasmAddr, txInput, wasmAmount);

	const skipped = feeForInput.compare(BigNum.from_str(input.value)) > 0;
	if (!skipped) {
		txBuilder.add_input(wasmAddr, txInput, wasmAmount);
	}
	return { added: !skipped, amount: BigNum.from_str(input.value), fee: feeForInput };
};

const utxoToTxInput = (utxo: UnspentTransaction): TransactionInput =>
	CardanoWasm.TransactionInput.new(
		CardanoWasm.TransactionHash.from_bytes(Buffer.from(utxo.txHash, "hex")),
		Number.parseInt(utxo.index),
	);

export const deriveAddressesAndSigningKeys = async (
	publicKey: Bip32PublicKey,
	networkId,
	accountKey: Bip32PrivateKey,
) => {
	const addresses: { [index: number]: {} } = { 0: {}, 1: {} };
	for (let index = 0; index < 20; ++index) {
		addresses[0][deriveAddress(publicKey, false, index, networkId)] = deriveSpendKey(accountKey, index);
		addresses[1][deriveAddress(publicKey, true, index, networkId)] = deriveChangeKey(accountKey, index);
	}
	return addresses;
};
