import sinon from "sinon";
import { ok } from "uvu/assert";

export class Mockery {
	readonly #stub;

	private constructor(stub) {
		this.#stub = stub;
	}

	public static stub(owner: object, method: string): Mockery {
		return new Mockery(sinon.stub(owner, method));
	}

	public calledWith(message: string | object): void {
		ok(this.#stub.calledWith(message));
	}

	public mockResolvedValue(value: unknown): Mockery {
		this.#stub.resolves(value);

		return this;
	}

	public mockReturnValue(value: unknown): Mockery {
		this.#stub.returns(value);

		return this;
	}

	public mockReturnValueOnce(value: unknown): Mockery {
		this.#stub.onFirstCall().returns(value);

		return this;
	}

	public mockImplementation(value: Function): Mockery {
		this.#stub.callsFake(value);

		return this;
	}

	public mockRestore(): void {
		this.#stub.restore();
	}

	public calledTimes(times: number): void {
		ok(this.#stub.callCount === times);
	}
}

export const mockery = (owner: object, method: string): Mockery => Mockery.stub(owner, method);
