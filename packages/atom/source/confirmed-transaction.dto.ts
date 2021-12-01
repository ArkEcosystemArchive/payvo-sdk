import { DTO, IoC } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";
import { DateTime } from "@payvo/sdk-intl";

@IoC.injectable()
export class ConfirmedTransactionData extends DTO.AbstractConfirmedTransactionData {
	public override id(): string {
		return this.data.txhash;
	}

	public override blockId(): string | undefined {
		return undefined;
	}

	public override timestamp(): DateTime | undefined {
		return DateTime.make(this.data.timestamp);
	}

	public override sender(): string {
		const event = this.data.events.find(({ type }) => type === "message");
		const attribute = event.attributes.find(({ key }) => key === "sender");

		return attribute.value;
	}

	public override recipient(): string {
		const event = this.data.events.find(({ type }) => type === "transfer");
		const attribute = event.attributes.find(({ key }) => key === "recipient");

		return attribute.value;
	}

	// @ts-ignore
	public amount(): BigNumber {
		const event = this.data.events.find(({ type }) => type === "transfer");
		const attribute = event.attributes.find(({ key }) => key === "amount");

		return this.bigNumberService.make(attribute.value.replace(/\D/g, ""));
	}

	public override fee(): BigNumber {
		return this.bigNumberService.make(this.data.gas_used);
	}

	public override memo(): string | undefined {
		return this.data.tx.value.memo;
	}
}
