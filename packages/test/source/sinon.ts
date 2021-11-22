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
    public resolvedValue(value: unknown): Mockery {
        this.#subject.resolves(value);

        return this;
    }

    // @TODO: rename
    public returnValue(value: unknown): Mockery {
        this.#subject.returns(value);

        return this;
    }

    // @TODO: rename
    public returnValueOnce(value: unknown): Mockery {
        this.#subject.onFirstCall().returns(value);

        return this;
    }

    // @TODO: rename
    public callsFake(value: Function): Mockery {
        this.#subject.callsFake(value);

        return this;
    }

    // @TODO: rename
    public restore(): void {
        this.#subject.restore();
    }

    public calledTimes(times: number): void {
        ok(this.#subject.callCount === times);
    }
}

// If you want to watch that something happens.
export const spy = (owner: object, method: string): Mockery => Mockery.spy(owner, method);

// If you want to specify how something will work.
export const stub = (owner: object, method: string): Mockery => Mockery.stub(owner, method);

// If you want both of the above.
export const mock = (owner: object, method: string): Mockery => Mockery.mock(owner, method);
