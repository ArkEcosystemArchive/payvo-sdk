import { Container } from "./container.js";
import { BindingType } from "./service-provider.contract.js";

it("should prevent multiple bindings of the same key", () => {
	const container = new Container();

	assert.is(() => container.constant(BindingType.AddressService, "value")).not.toThrow(/Duplicate binding attempted/);
	assert.is(() => container.constant(BindingType.AddressService, "value")).toThrow(/Duplicate binding attempted/);
	assert.is(() => container.constant(BindingType.AddressService, "value")).toThrow(/Duplicate binding attempted/);
});

it("should bind values independent from container instances", () => {
	const container1 = new Container();

	assert
		.is(() => container1.constant(BindingType.AddressService, "value"))
		.not.toThrow(/Duplicate binding attempted/);

	const container2 = new Container();

	assert
		.is(() => container2.constant(BindingType.AddressService, "value"))
		.not.toThrow(/Duplicate binding attempted/);
});

it("should bind a value and be able to retrieve it", () => {
	const container = new Container();

	assert.is(container.missing("key"), true);
	assert.is(() => container.get("key")).toThrow();

	container.constant("key", "value");

	assert.is(container.has("key"), true);
	assert.is(container.get("key"), "value");
});

it("should forget a value", () => {
	const container = new Container();

	assert.is(() => container.unbind("key")).toThrow();

	container.constant("key", "value");

	assert.is(() => container.unbind("key")).not.toThrow();
});

it("should flush all bindings", () => {
	const container = new Container();

	assert.is(() => container.unbind("key")).toThrow();

	container.constant("key", "value");

	assert.is(() => container.unbind("key")).not.toThrow();

	container.flush();

	assert.is(() => container.unbind("key")).toThrow();
});
