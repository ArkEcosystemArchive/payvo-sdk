import sinon from "sinon";
import { ok } from "uvu/assert";

export class Mockery {
	readonly #subject;

	private constructor(subject) {
		this.#subject = subject;
	}

	public static spy(owner: object, method: string): Mockery {
		return new Mockery(sinon.spy(owner, method));
	}

	public static stub(owner: object, method: string): Mockery {
		return new Mockery(sinon.subject(owner, method));
	}

	public static mock(owner: object, method: string): Mockery {
		return new Mockery(sinon.mock(owner, method));
	}

	public calledWith(message: string | object): void {
		ok(this.#subject.calledWith(message));
	}

	// @TODO: rename
	public mockResolvedValue(value: unknown): Mockery {
		this.#subject.resolves(value);

		return this;
	}

	// @TODO: rename
	public mockReturnValue(value: unknown): Mockery {
		this.#subject.returns(value);

		return this;
	}

	// @TODO: rename
	public mockReturnValueOnce(value: unknown): Mockery {
		this.#subject.onFirstCall().returns(value);

		return this;
	}

	// @TODO: rename
	public mockImplementation(value: Function): Mockery {
		this.#subject.callsFake(value);

		return this;
	}

	// @TODO: rename
	public mockRestore(): void {
		this.#subject.restore();
	}

	public calledTimes(times: number): void {
		ok(this.#subject.callCount === times);
	}
}
