import { Contracts, IoC, Services } from "@payvo/sdk";
import { UUID } from "@payvo/sdk-cryptography";

import { createSignedTransactionData } from "./crypto.js";

@IoC.injectable()
export class TransactionService extends Services.AbstractTransactionService {
	@IoC.inject(IoC.BindingType.AddressService)
	protected readonly addressService!: Services.AddressService;

	@IoC.inject(IoC.BindingType.KeyPairService)
	protected readonly keyPairService!: Services.KeyPairService;

	#networkId;

	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		if (input.signatory.signingKey() === undefined) {
			throw new Error("No mnemonic provided.");
		}

		const { address: senderAddress } = await this.addressService.fromMnemonic(input.signatory.signingKey());
		const keyPair = await this.keyPairService.fromMnemonic(input.signatory.signingKey());

		const { account_number, sequence } = (
			await this.clientService.wallet({ type: "address", value: senderAddress })
		)
			// @ts-ignore
			.raw();

		const signedTransaction = createSignedTransactionData(
			{
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
				chain_id: this.#networkId,
				fee: {
					amount: [
						{
							amount: String(5000), // todo: make this configurable or estimate it
							denom: "umuon", // todo: make this configurable
						},
					],
					gas: String(200000), // todo: make this configurable or estimate it
				},
				memo: "",
				account_number: String(account_number),
				sequence: String(sequence),
			},
			keyPair,
		);

		return this.dataTransferObjectService.signedTransaction(UUID.random(), signedTransaction, signedTransaction);
	}

	@IoC.postConstruct()
	private onPostConstruct() {
		this.#networkId = this.configRepository.get<number>("network.meta.networkId");
	}
}
