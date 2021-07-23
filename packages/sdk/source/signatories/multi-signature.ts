import { MultiSignatureAsset } from "../services";

export class MultiSignatureSignatory {
	readonly #signature: MultiSignatureAsset;
	readonly #identifier: string | undefined;

	public constructor(signature: MultiSignatureAsset, identifier?: string) {
		this.#signature = signature;
		this.#identifier = identifier;
	}

	public signingList(): MultiSignatureAsset {
		return this.#signature;
	}

	public identifier(): string | undefined {
		return this.#identifier;
	}
}
