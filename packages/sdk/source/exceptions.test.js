import { assert, test } from "@payvo/sdk-test";
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
	assert.throws(() => {
		throw new NotImplemented("klass", "method");
	}, `Method klass#method is not implemented.`);
});

test("NotSupported", () => {
	assert.throws(() => {
		throw new NotSupported("klass", "method");
	}, `Method klass#method is not supported.`);
});

test("InvalidArguments", () => {
	assert.throws(() => {
		throw new InvalidArguments("klass", "method");
	}, `Method klass#method does not accept the given arguments.`);
});

test("MissingArgument", () => {
	assert.throws(() => {
		throw new MissingArgument("klass", "method", "argument");
	}, `Method klass#method expects the argument [argument] but it was not given.`);
});

test("BadMethodDependencyException", () => {
	assert.throws(() => {
		throw new BadMethodDependencyException("klass", "method", "dependency");
	}, "Method klass#method depends on klass#dependency being called first.");
});

test("BadVariableDependencyException", () => {
	assert.throws(() => {
		throw new BadVariableDependencyException("klass", "method", "dependency");
	}, "Method klass#method depends on klass#dependency being declared first.");
});

test("BadStateException", () => {
	assert.throws(() => {
		throw new BadStateException("method", "error");
	}, "Method [method] has entered a bad state: error");
});
