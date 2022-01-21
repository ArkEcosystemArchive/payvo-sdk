import { describe } from "@payvo/sdk-test";

import {
	BadMethodDependencyException,
	BadStateException,
	BadVariableDependencyException,
	InvalidArguments,
	MissingArgument,
	NotImplemented,
	NotSupported,
} from "./exceptions.js";

describe("Exceptions", ({ assert, it, nock, loader }) => {
	it("should throw an exception with the type NotImplemented", () => {
		assert.throws(() => {
			throw new NotImplemented("klass", "method");
		}, `Method klass#method is not implemented.`);
	});

	it("should throw an exception with the type NotSupported", () => {
		assert.throws(() => {
			throw new NotSupported("klass", "method");
		}, `Method klass#method is not supported.`);
	});

	it("should throw an exception with the type InvalidArguments", () => {
		assert.throws(() => {
			throw new InvalidArguments("klass", "method");
		}, `Method klass#method does not accept the given arguments.`);
	});

	it("should throw an exception with the type MissingArgument", () => {
		assert.throws(() => {
			throw new MissingArgument("klass", "method", "argument");
		}, `Method klass#method expects the argument [argument] but it was not given.`);
	});

	it("should throw an exception with the type BadMethodDependencyException", () => {
		assert.throws(() => {
			throw new BadMethodDependencyException("klass", "method", "dependency");
		}, "Method klass#method depends on klass#dependency being called first.");
	});

	it("should throw an exception with the type BadVariableDependencyException", () => {
		assert.throws(() => {
			throw new BadVariableDependencyException("klass", "method", "dependency");
		}, "Method klass#method depends on klass#dependency being declared first.");
	});

	it("should throw an exception with the type BadStateException", () => {
		assert.throws(() => {
			throw new BadStateException("method", "error");
		}, "Method [method] has entered a bad state: error");
	});
});
