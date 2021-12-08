import { Contracts, Exceptions, Helpers, IoC, Services } from "@payvo/sdk";
import { DateTime } from "@payvo/sdk-intl";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { UUID } from "@payvo/sdk-cryptography";

import { derivePrivateKey, derivePublicKey } from "./keys.js";

export class TransactionService extends Services.AbstractTransactionService {
	#client!: Connection;
	#slip44!: number;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#client = new Connection(this.#host());
		this.#slip44 = this.configRepository.get<number>("network.constants.slip44");
	}

	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		if (input.signatory.signingKey() === undefined) {
			throw new Exceptions.MissingArgument(this.constructor.name, this.transfer.name, "signatory");
		}
		const amount = this.toSatoshi(input.data.amount).toNumber();

		const transaction = new Transaction();
		transaction.recentBlockhash = (await this.#client.getRecentBlockhash()).blockhash;
		transaction.feePayer = new PublicKey(input.signatory.publicKey());

		transaction.add(
			SystemProgram.transfer({
				fromPubkey: transaction.feePayer,
				toPubkey: new PublicKey(input.data.to),
				lamports: amount,
			}),
		);

		const signedTransaction = this.#sign(
			transaction,
			derivePrivateKey(input.signatory.signingKey(), 0, 0, this.#slip44),
		);

		return this.dataTransferObjectService.signedTransaction(
			UUID.random(),
			{
				from: input.signatory.address(),
				to: input.data.to,
				amount,
				timestamp: DateTime.make(),
			},
			signedTransaction.toString("hex"),
		);
	}

	#sign(transaction: Transaction, privateKey: Buffer): Buffer {
		transaction.sign(Keypair.fromSeed(derivePublicKey(privateKey)));

		return transaction.serialize({ requireAllSignatures: false, verifySignatures: false });
	}

	#host(): string {
		return `${Helpers.randomHostFromConfig(this.configRepository)}/api`;
	}
}
