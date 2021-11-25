/* istanbul ignore file */

export type ContainerKey = string | symbol;

export type Cradle = Map<ContainerKey, any>;

export class Container {
	readonly #cradle: Cradle;

	public constructor() {
		this.#cradle = new Map();
	}

	public get<T>(key: ContainerKey): T {
		return this.#cradle.get(key);
	}

	public constant(key: ContainerKey, value: unknown): void {
		if (this.has(key)) {
			throw new Error(`Duplicate binding attempted for ${key.toString()}`);
		}

		this.#cradle.set(key, value);
	}

	public singleton(key: ContainerKey, value: new (...arguments_: never[]) => unknown): void {
		if (this.has(key)) {
			throw new Error(`Duplicate binding attempted for ${key.toString()}`);
		}

		this.constant(key, this.resolve(value));
	}

	public has(key: ContainerKey): boolean {
		return this.#cradle.has(key);
	}

	public resolve<T>(constructorFunction: any): T {
		const instance = new constructorFunction(this);

		if (typeof instance.onPostConstruct === "function") {
			instance.onPostConstruct();
		}

		return instance;
	}

	public missing(key: ContainerKey): boolean {
		return !this.has(key);
	}

	public unbind(key: ContainerKey): boolean {
		return this.#cradle.delete(key);
	}

	public async unbindAsync(key: ContainerKey): Promise<void> {
		const instance = this.#cradle.get(key);

		if (typeof instance.onPreDestroy === "function") {
			instance.onPreDestroy();
		}
	}

	public flush(): void {
		for (const key of this.#cradle.keys()) {
			this.unbind(key);
		}
	}
}
