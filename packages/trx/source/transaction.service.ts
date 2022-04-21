import { Contracts, Exceptions, IoC, Services } from "@payvo/sdk";
import TronWeb from "tronweb";

export class TransactionService extends Services.AbstractTransactionService {
	readonly #addressService: Services.AddressService;
	readonly #privateKeyService: Services.PrivateKeyService;
	readonly #connection: TronWeb;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#addressService = container.get(IoC.BindingType.AddressService);
		this.#privateKeyService = container.get(IoC.BindingType.PrivateKeyService);
		this.#connection = new TronWeb({ fullHost: this.hostSelector(this.configRepository).host });
	}

	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		if (input.signatory.signingKey() === undefined) {
			throw new Exceptions.MissingArgument(this.constructor.name, this.transfer.name, "input.signatory");
		}

		const { address: senderAddress } = await this.#addressService.fromMnemonic(input.signatory.signingKey());

		if (senderAddress === input.data.to) {
			throw new Exceptions.InvalidRecipientException("Cannot transfer TRX to the same account.");
		}

		let transaction = await this.#connection.transactionBuilder.sendTrx(
			input.data.to,
			this.toSatoshi(input.data.amount).toString(),
			senderAddress,
			1,
		);

		if (input.data.memo) {
			transaction = await this.#connection.transactionBuilder.addUpdateData(transaction, input.data.memo, "utf8");
		}

		const response = await this.#connection.trx.sign(
			transaction,
			(
				await this.#privateKeyService.fromMnemonic(input.signatory.signingKey())
			).privateKey,
		);

		return this.dataTransferObjectService.signedTransaction(response.txID, response, response);
	}
}
