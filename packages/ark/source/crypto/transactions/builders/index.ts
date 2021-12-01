import { DelegateRegistrationBuilder } from "./delegate-registration.js";
import { DelegateResignationBuilder } from "./delegate-resignation.js";
import { IPFSBuilder } from "./ipfs.js";
import { MultiPaymentBuilder } from "./multi-payment.js";
import { MultiSignatureBuilder } from "./multi-signature.js";
import { SecondSignatureBuilder } from "./second-signature.js";
import { TransferBuilder } from "./transfer.js";
import { VoteBuilder } from "./vote.js";

export * from "./transaction.js";

export class BuilderFactory {
	public static transfer(): TransferBuilder {
		return new TransferBuilder();
	}

	public static secondSignature(): SecondSignatureBuilder {
		return new SecondSignatureBuilder();
	}

	public static delegateRegistration(): DelegateRegistrationBuilder {
		return new DelegateRegistrationBuilder();
	}

	public static vote(): VoteBuilder {
		return new VoteBuilder();
	}

	public static multiSignature(): MultiSignatureBuilder {
		return new MultiSignatureBuilder();
	}

	public static ipfs(): IPFSBuilder {
		return new IPFSBuilder();
	}

	public static multiPayment(): MultiPaymentBuilder {
		return new MultiPaymentBuilder();
	}

	public static delegateResignation(): DelegateResignationBuilder {
		return new DelegateResignationBuilder();
	}
}
