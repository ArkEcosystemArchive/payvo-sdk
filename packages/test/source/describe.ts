import { suite } from "uvu";

export const describe = (title: string, tests: Function): void => {
	const instance = suite(title);

	tests(instance);

	instance.run();
};
