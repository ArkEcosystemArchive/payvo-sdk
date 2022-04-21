import Common from "@ethereumjs/common";
import eth from "@ethereumjs/tx";
import { Contracts, IoC, Services } from "@payvo/sdk";
import { Buffoon } from "@payvo/sdk-cryptography";
import { Contract } from "web3-eth-contract";

import { toWei } from "./units.js";

interface TransactionPayload {
	data?: string;
	to: string;
	nonce: string; // hexadecimal
	value: string; // hexadecimal
	gasLimit: string; // hexadecimal
	gasPrice: string; // hexadecimal
}

export class TransactionService extends Services.AbstractTransactionService {
	readonly #addressService: Services.AddressService;
	readonly #privateKeyService: Services.PrivateKeyService;

	#chain!: string;
	#peer!: string;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#addressService = container.get(IoC.BindingType.AddressService);
		this.#privateKeyService = container.get(IoC.BindingType.PrivateKeyService);
		this.#chain = this.configRepository.get("network");
		this.#peer = this.hostSelector(this.configRepository).host;
	}

	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		const senderData = await this.#addressService.fromMnemonic(input.signatory.signingKey());

		let privateKey: string;
		if (input.signatory.actsWithPrivateKey()) {
			privateKey = input.signatory.signingKey();
		} else {
			privateKey = (await this.#privateKeyService.fromMnemonic(input.signatory.signingKey())).privateKey;
		}

		const { nonce } = await this.#get(`wallets/${senderData.address}`);

		const data = this.#generateTransactionPayload(input, nonce);

		const transaction: eth.Transaction = new eth.Transaction(data, {
			common: Common.forCustomChain(this.#chain, {}),
		});

		transaction.sign(Buffoon.fromHex(privateKey));

		const signedData = {
			amount: input.contract && input.contract.address ? input.data.amount : this.#fromHex(data.value),
			fee: input.feeLimit! * input.fee!,
			memo: data.data,
			recipient: data.to,
			sender: senderData.address,
			timestamp: new Date(),
		};

		return this.dataTransferObjectService.signedTransaction(
			transaction.hash().toString("hex"),
			signedData,
			"0x" + transaction.serialize().toString("hex"),
		);
	}

	async #get(path: string, query?: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		const response = await this.httpClient.get(`${this.#peer}/${path}`, query);

		return response.json();
	}

	#generateTransactionPayload(input: Services.TransferInput, nonce: number): TransactionPayload {
		const nextNonce = BigInt(nonce) + 1n;

		if (input.contract && input.contract.address) {
			return {
				data: this.#generateContractTransferMemo(input.data.to, input.data.amount, input.contract.address),
				gasLimit: this.#toHex(input.feeLimit!),
				gasPrice: this.#toHex(input.fee!),
				nonce: this.#toHex(nextNonce),
				to: input.contract.address,
				value: "0x0",
			};
		}

		const data: TransactionPayload = {
			gasLimit: this.#toHex(input.feeLimit!),
			gasPrice: this.#toHex(input.fee!),
			nonce: this.#toHex(nextNonce),
			to: input.data.to,
			value: this.#toHex(toWei(`${input.data.amount}`, "wei")),
		};

		if (input.data.memo) {
			// @ts-ignore
			data.data = Buffoon.fromUTF8(input.data.memo);
		}

		return data;
	}

	#generateContractTransferMemo(recipient: string, amount: number, contractAddress: string) {
		return this.#createContract(contractAddress).methods.transfer(recipient, amount).encodeABI();
	}

	#createContract(contractAddress: string) {
		return new Contract(
			[
				{
					constant: false,
					inputs: [
						{
							name: "_to",
							type: "address",
						},
						{
							name: "_value",
							type: "uint256",
						},
					],
					name: "transfer",
					outputs: [
						{
							name: "success",
							type: "bool",
						},
					],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
			],
			contractAddress,
		);
	}

	#toHex(value: bigint | number): string {
		return `0x${value.toString(16)}`;
	}

	#fromHex(value: string): bigint | number {
		return Number.parseInt(value, 16);
	}
}
