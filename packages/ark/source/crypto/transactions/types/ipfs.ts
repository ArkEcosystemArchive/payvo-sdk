import { Base58 } from "@payvo/sdk-cryptography";
import { BigNumber, ByteBuffer } from "@payvo/sdk-helpers";

import { TransactionType, TransactionTypeGroup } from "../../enums.js";
import { ISerializeOptions } from "../../interfaces/index.js";
import { configManager } from "../../managers/index.js";
import * as schemas from "./schemas.js";
import { Transaction } from "./transaction.js";

export abstract class IpfsTransaction extends Transaction {
	public static override typeGroup: number = TransactionTypeGroup.Core;
	public static override type: number = TransactionType.Ipfs;
	public static override key = "ipfs";

	protected static override defaultStaticFee: BigNumber = BigNumber.make("500000000");

	public static override getSchema(): schemas.TransactionSchema {
		return schemas.ipfs;
	}

	public override verify(): boolean {
		return configManager.getMilestone().aip11 && super.verify();
	}

	public serialize(options?: ISerializeOptions): ByteBuffer | undefined {
		const { data } = this;

		if (data.asset) {
			const ipfsBuffer: Buffer = Buffer.from(Base58.decode(data.asset.ipfs!));
			const buff: ByteBuffer = new ByteBuffer(Buffer.alloc(ipfsBuffer.length));

			buff.writeBuffer(ipfsBuffer);

			return buff;
		}

		return undefined;
	}

	public deserialize(buf: ByteBuffer): void {
		const { data } = this;

		const hashFunction: number = buf.readUInt8();
		const ipfsHashLength: number = buf.readUInt8();
		const ipfsHash: Buffer = buf.readBuffer(ipfsHashLength);

		const buff: Buffer = Buffer.alloc(ipfsHashLength + 2);
		buff.writeUInt8(hashFunction, 0);
		buff.writeUInt8(ipfsHashLength, 1);
		buff.fill(ipfsHash, 2);

		data.asset = {
			ipfs: Base58.encode(buff),
		};
	}
}
