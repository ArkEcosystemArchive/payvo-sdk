import * as assert from "uvu/assert";
import sinon from "sinon";

export class Mockery {
	readonly #stub;

	private constructor(stub) {
		this.#stub = stub;
	}

	public static stub(owner: object, method: string): Mockery {
		return new Mockery(sinon.stub(owner, method));
	}

	public calledWith(message: string | object): void {
		assert.ok(this.#stub.calledWith(message));
	}

	public mockResolvedValue(value: unknown): void {
		this.#stub.resolves(value);
	}

	public mockReturnValue(value: unknown): void {
		this.#stub.returns(value);
	}

	public mockReturnValueOnce(value: unknown): void {
		this.#stub.onFirstCall().returns(value);
	}
}

export const mockery = (owner: object, method: string): Mockery => Mockery.stub(owner, method);
