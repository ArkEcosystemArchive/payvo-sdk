import { Contracts, DTO, IoC } from "@payvo/sdk";
import { DateTime } from "@payvo/intl";
import { BigNumber } from "@payvo/helpers";

@IoC.injectable()
export class ConfirmedTransactionData extends DTO.AbstractConfirmedTransactionData {
	public override id(): string {
		return this.data.txid;
	}

	public override blockId(): string | undefined {
		return this.data.block_id;
	}

	public override timestamp(): DateTime | undefined {
		return DateTime.make(this.data.blockTime);
	}

	public override confirmations(): BigNumber {
		return BigNumber.ZERO;
	}

	public override sender(): string {
		return this.data.vin[0].address;
	}

	public override senders(): Contracts.MultiPaymentRecipient[] {
		return this.data.vin.map(({ address, amount }) => ({ address, amount }));
	}

	public override recipient(): string {
		return this.data.vout[0].address;
	}

	public override recipients(): Contracts.MultiPaymentRecipient[] {
		return this.data.vout.map(({ address, amount }) => ({ address, amount }));
	}

	public override amount(): BigNumber {
		return this.bigNumberService.make(this.data.amount);
	}

	public override fee(): BigNumber {
		return this.bigNumberService.make(this.data.fee);
	}

	public override isConfirmed(): boolean {
		return true;
	}

	public override inputs(): Contracts.UnspentTransactionData[] {
		return this.data.vin.map(
			({ address, amount, input_txid }) =>
				new DTO.UnspentTransactionData({
					id: input_txid,
					timestamp: this.timestamp(),
					amount,
					address,
				}),
		);
	}

	public override outputs(): Contracts.UnspentTransactionData[] {
		return this.data.vin.map(
			({ address, amount, output_txid }) =>
				new DTO.UnspentTransactionData({
					id: output_txid,
					timestamp: this.timestamp(),
					amount,
					address,
				}),
		);
	}
}
