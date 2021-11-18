import {
	BadMethodDependencyException,
	BadStateException,
	BadVariableDependencyException,
	InvalidArguments,
	MissingArgument,
	NotImplemented,
	NotSupported,
} from "./exceptions";

test("NotImplemented", () => {
	assert
		.is(() => {
			throw new NotImplemented("klass", "method");
		})
		.toThrow(`Method klass#method is not implemented.`);
});

test("NotSupported", () => {
	assert
		.is(() => {
			throw new NotSupported("klass", "method");
		})
		.toThrow(`Method klass#method is not supported.`);
});

test("InvalidArguments", () => {
	assert
		.is(() => {
			throw new InvalidArguments("klass", "method");
		})
		.toThrow(`Method klass#method does not accept the given arguments.`);
});

test("MissingArgument", () => {
	assert
		.is(() => {
			throw new MissingArgument("klass", "method", "argument");
		})
		.toThrow(`Method klass#method expects the argument [argument] but it was not given.`);
});

test("BadMethodDependencyException", () => {
	assert
		.is(() => {
			throw new BadMethodDependencyException("klass", "method", "dependency");
		})
		.toThrow("Method klass#method depends on klass#dependency being called first.");
});

test("BadVariableDependencyException", () => {
	assert
		.is(() => {
			throw new BadVariableDependencyException("klass", "method", "dependency");
		})
		.toThrow("Method klass#method depends on klass#dependency being declared first.");
});

test("BadStateException", () => {
	assert
		.is(() => {
			throw new BadStateException("method", "error");
		})
		.toThrow("Method [method] has entered a bad state: error");
});
