import { stub, SinonStub } from "sinon";
import { ok } from "uvu/assert";

export class Mockery {
	readonly #subject: SinonStub;

	private constructor(subject) {
		this.#subject = subject;
	}

	public static stub(owner: object, method: string): Mockery {
		return new Mockery(stub(owner, method as never));
	}

	public calledWith(message: string | object): void {
		ok(this.#subject.calledWith(message));
	}

	public resolvedValue(value: unknown): Mockery {
		this.#subject.resolves(value);

		return this;
	}

	public returnValue(value: unknown): Mockery {
		this.#subject.returns(value);

		return this;
	}

	public returnValueOnce(value: unknown): Mockery {
		this.#subject.onFirstCall().returns(value);

		return this;
	}

	public callsFake(value: (...args: any[]) => any): Mockery {
		this.#subject.callsFake(value);

		return this;
	}

	public restore(): void {
		this.#subject.restore();
	}

	public neverCalled(): void {
		this.calledTimes(0);
	}

	public calledOnce(): void {
		this.calledTimes(1);
	}

	public calledTimes(times: number): void {
		ok(this.#subject.callCount === times);
	}
}
