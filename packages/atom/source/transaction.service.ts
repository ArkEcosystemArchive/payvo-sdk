import { Contracts, IoC, Services } from "@payvo/sdk";
import { UUID } from "@payvo/sdk-cryptography";

import { createSignedTransactionData } from "./crypto.js";

export class TransactionService extends Services.AbstractTransactionService {
	readonly #addressService: Services.AddressService;
	readonly #keyPairService: Services.KeyPairService;

	#networkId;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#addressService = container.get(IoC.BindingType.AddressService);
		this.#keyPairService = container.get(IoC.BindingType.KeyPairService);
		this.#networkId = this.configRepository.get<number>("network.meta.networkId");
	}

	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		if (input.signatory.signingKey() === undefined) {
			throw new Error("No mnemonic provided.");
		}

		const { address: senderAddress } = await this.#addressService.fromMnemonic(input.signatory.signingKey());
		const keyPair = await this.#keyPairService.fromMnemonic(input.signatory.signingKey());

		const wallet = await this.clientService.wallet({ type: "address", value: senderAddress });
		// @ts-ignore
		const { account_number, sequence } = wallet.raw();

		const signedTransaction = createSignedTransactionData(
			{
				account_number: String(account_number),
				chain_id: this.#networkId,
				fee: {
					amount: [
						{
							amount: String(5000), // todo: make this configurable or estimate it
							denom: "umuon", // todo: make this configurable
						},
					],
					gas: String(200_000), // todo: make this configurable or estimate it
				},
				memo: "",
				msgs: [
					{
						type: "cosmos-sdk/MsgSend",
						value: {
							amount: [
								{
									amount: `${input.data.amount}`,
									denom: "umuon", // todo: make this configurable
								},
							],
							from_address: senderAddress,
							to_address: input.data.to,
						},
					},
				],
				sequence: String(sequence),
			},
			keyPair,
		);

		return this.dataTransferObjectService.signedTransaction(UUID.random(), signedTransaction, signedTransaction);
	}
}
