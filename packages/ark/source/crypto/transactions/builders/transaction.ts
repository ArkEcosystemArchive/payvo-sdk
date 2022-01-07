import { BigNumber } from "@payvo/sdk-helpers";

import { TransactionTypeGroup } from "../../enums";
import { MissingTransactionSignatureError, VendorFieldLengthExceededError } from "../../errors";
import { Address } from "../../identities/address.js";
import { Keys } from "../../identities/keys.js";
import { IKeyPair, ITransaction, ITransactionData } from "../../interfaces";
import { maxVendorFieldLength } from "../../utils.js";
import { TransactionFactory } from "../factory.js";
import { Signer } from "../signer";
import { Utils } from "../utils.js";
import { Verifier } from "../verifier.js";

export abstract class TransactionBuilder<TBuilder extends TransactionBuilder<TBuilder>> {
	public data: ITransactionData;

	protected signWithSenderAsRecipient = false;

	private disableVersionCheck = false;

	public constructor() {
		this.data = {
			id: undefined,
			nonce: BigNumber.ZERO,
			typeGroup: TransactionTypeGroup.Test,
			version: 0x02,
		} as ITransactionData;
	}

	public build(data: Partial<ITransactionData> = {}): ITransaction {
		return TransactionFactory.fromData({ ...this.data, ...data }, false);
	}

	public version(version: number): TBuilder {
		this.data.version = version;
		this.disableVersionCheck = true;
		return this.instance();
	}

	public typeGroup(typeGroup: number): TBuilder {
		this.data.typeGroup = typeGroup;

		return this.instance();
	}

	public nonce(nonce: string): TBuilder {
		if (nonce) {
			this.data.nonce = BigNumber.make(nonce);
		}

		return this.instance();
	}

	public network(network: number): TBuilder {
		this.data.network = network;

		return this.instance();
	}

	public fee(fee: string): TBuilder {
		if (fee) {
			this.data.fee = BigNumber.make(fee);
		}

		return this.instance();
	}

	public amount(amount: string): TBuilder {
		this.data.amount = BigNumber.make(amount);

		return this.instance();
	}

	public recipientId(recipientId: string): TBuilder {
		this.data.recipientId = recipientId;

		return this.instance();
	}

	public senderPublicKey(publicKey: string): TBuilder {
		this.data.senderPublicKey = publicKey;

		return this.instance();
	}

	public vendorField(vendorField: string): TBuilder {
		const limit: number = maxVendorFieldLength();

		if (vendorField) {
			if (Buffer.from(vendorField).length > limit) {
				throw new VendorFieldLengthExceededError(limit);
			}

			this.data.vendorField = vendorField;
		}

		return this.instance();
	}

	public sign(passphrase: string): TBuilder {
		const keys: IKeyPair = Keys.fromPassphrase(passphrase);
		return this.signWithKeyPair(keys);
	}

	public signWithWif(wif: string, networkWif?: number): TBuilder {
		const keys: IKeyPair = Keys.fromWIF(wif);

		return this.signWithKeyPair(keys);
	}

	public secondSign(secondPassphrase: string): TBuilder {
		return this.secondSignWithKeyPair(Keys.fromPassphrase(secondPassphrase));
	}

	public secondSignWithWif(wif: string, networkWif?: number): TBuilder {
		const keys = Keys.fromWIF(wif);

		return this.secondSignWithKeyPair(keys);
	}

	public multiSign(passphrase: string, index: number): TBuilder {
		const keys: IKeyPair = Keys.fromPassphrase(passphrase);
		return this.multiSignWithKeyPair(index, keys);
	}

	public multiSignWithWif(index: number, wif: string, networkWif?: number): TBuilder {
		const keys = Keys.fromWIF(wif);

		return this.multiSignWithKeyPair(index, keys);
	}

	public verify(): boolean {
		return Verifier.verifyHash(this.data, this.disableVersionCheck);
	}

	public getStruct(): ITransactionData {
		if (!this.data.senderPublicKey || (!this.data.signature && !this.data.signatures)) {
			throw new MissingTransactionSignatureError();
		}

		const struct: ITransactionData = {
			fee: this.data.fee,
			id: Utils.getId(this.data).toString(),
			network: this.data.network,
			nonce: this.data.nonce,
			secondSignature: this.data.secondSignature,
			senderPublicKey: this.data.senderPublicKey,
			signature: this.data.signature,
			type: this.data.type,
			typeGroup: this.data.typeGroup,
			version: this.data.version,
		} as ITransactionData;

		if (Array.isArray(this.data.signatures)) {
			struct.signatures = this.data.signatures;
		}

		return struct;
	}

	private signWithKeyPair(keys: IKeyPair): TBuilder {
		this.data.senderPublicKey = keys.publicKey;

		if (this.signWithSenderAsRecipient) {
			this.data.recipientId = Address.fromPublicKey(keys.publicKey);
		}

		this.data.signature = Signer.sign(this.getSigningObject(), keys, {
			disableVersionCheck: this.disableVersionCheck,
		});

		return this.instance();
	}

	private secondSignWithKeyPair(keys: IKeyPair): TBuilder {
		this.data.secondSignature = Signer.secondSign(this.getSigningObject(), keys);
		return this.instance();
	}

	private multiSignWithKeyPair(index: number, keys: IKeyPair): TBuilder {
		if (!this.data.signatures) {
			this.data.signatures = [];
		}

		Signer.multiSign(this.getSigningObject(), keys, index);

		return this.instance();
	}

	private getSigningObject(): ITransactionData {
		const data: ITransactionData = {
			...this.data,
		};

		for (const key of Object.keys(data)) {
			if (["model", "network", "id"].includes(key)) {
				delete data[key];
			}
		}

		return data;
	}

	protected abstract instance(): TBuilder;
}
