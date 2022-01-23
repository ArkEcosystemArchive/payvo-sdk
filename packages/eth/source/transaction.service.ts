import Common from "@ethereumjs/common";
import eth from "@ethereumjs/tx";
import { Contracts, Helpers, IoC, Services } from "@payvo/sdk";
import { Buffoon } from "@payvo/sdk-cryptography";
import { Contract } from "web3-eth-contract";

import { toWei } from "./units.js";

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
		this.#peer = Helpers.randomHostFromConfig(this.configRepository);
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

		let data: object;

		if (input.contract && input.contract.address) {
			data = {
				data: this.#createContract(input.contract.address)
					.methods.transfer(input.data.to, input.data.amount)
					.encodeABI(),
				gasLimit: this.#toHex(input.feeLimit!),
				gasPrice: this.#toHex(input.fee!),
				nonce: this.#toHex(BigInt(nonce) + 1n),
				to: input.contract.address,
				value: "0x0",
			};
		} else {
			data = {
				gasLimit: this.#toHex(input.feeLimit!),
				gasPrice: this.#toHex(input.fee!),
				nonce: this.#toHex(BigInt(nonce) + 1n),
				to: input.data.to,
				value: this.#toHex(toWei(`${input.data.amount}`, "wei")),
			};

			if (input.data.memo) {
				// @ts-ignore
				data.data = Buffoon.fromUTF8(input.data.memo);
			}
		}

		const transaction: eth.Transaction = new eth.Transaction(data, {
			common: Common.forCustomChain(this.#chain, {}),
		});

		transaction.sign(Buffoon.fromHex(privateKey));

		return this.dataTransferObjectService.signedTransaction(
			transaction.hash().toString("hex"),
			"0x" + transaction.serialize().toString("hex"),
			"0x" + transaction.serialize().toString("hex"),
		);
	}

	async #get(path: string, query?: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		const response = await this.httpClient.get(`${this.#peer}/${path}`, query);

		return response.json();
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

	#fromHex(value: string) : bigint | number {
		return parseInt(value, 16);
	}
}
