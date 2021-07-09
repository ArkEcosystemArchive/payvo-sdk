import { Contracts, IoC, Services } from "@payvo/sdk";
import { getAddressFromBase32Address } from "@liskhq/lisk-cryptography";
import { convertLSKToBeddows, getBytes, signTransaction } from "@liskhq/lisk-transactions-beta";
import { DateTime } from "@payvo/intl";

@IoC.injectable()
export class TransactionServiceThree extends Services.AbstractTransactionService {
	@IoC.inject(IoC.BindingType.ClientService)
	private readonly clientService!: Services.ClientService;

	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("token:transfer", {
			amount: BigInt(this.toSatoshi(input.data.amount).toString()),
			recipientAddress: getAddressFromBase32Address(input.data.to),
			data: input.data.memo || '',
		}, input);
	}

	async #createFromData<T>(
		type: string,
		asset: object,
		input: Services.TransactionInput,
	): Promise<Contracts.SignedTransactionData> {
		const wallet: Contracts.WalletData = await this.clientService.wallet(input.signatory.address());

		const { assetID, assetSchema, moduleID } = this.configRepository.get<object>("network.meta.assets")[type];

		const signedTransaction: any = signTransaction(
			assetSchema,
			{
				moduleID,
				assetID,
				nonce: BigInt(wallet.nonce().toString()),
				// @TODO: The estimates are currently under processing. Please retry in 30 seconds.
				// https://testnet-service.lisk.io/api/v2/fees
				fee: BigInt(convertLSKToBeddows(String(input.fee || 0.1))),
				senderPublicKey: Buffer.from(input.signatory.publicKey(), "hex"),
				asset,
			},
			Buffer.from(this.configRepository.get<string>("network.meta.networkId"), "hex"),
			input.signatory.signingKey(),
		);

		// console.log(JSON.stringify({
		// 	transaction: getBytes(assetSchema, signedTransaction).toString('hex'),
		// }));

		return this.dataTransferObjectService.signedTransaction(
			signedTransaction.id,
			{
				senderId: signedTransaction.senderPublicKey.toString("hex"),
				recipientId: signedTransaction.asset.recipientAddress,
				amount: signedTransaction.asset.amount,
				fee: signedTransaction.fee,
				timestamp: DateTime.make(),
			},
			getBytes(assetSchema, signedTransaction).toString('hex'),
		);
	}
}
