import { describe } from "@payvo/sdk-test";

import { Container } from "./container.js";
import { BindingType } from "./service-provider.contract.js";

describe("Container", ({ assert, it, nock, loader }) => {
	it("should prevent multiple bindings of the same key", () => {
		const container = new Container();

		assert.not.throws(() => container.constant(BindingType.AddressService, "value"), "Duplicate binding attempted");
		assert.throws(() => container.constant(BindingType.AddressService, "value"), "Duplicate binding attempted");
		assert.throws(() => container.constant(BindingType.AddressService, "value"), "Duplicate binding attempted");
	});

	it("should bind values independent from container instances", () => {
		const container1 = new Container();

		assert.not.throws(
			() => container1.constant(BindingType.AddressService, "value"),
			"Duplicate binding attempted",
		);

		const container2 = new Container();

		assert.not.throws(
			() => container2.constant(BindingType.AddressService, "value"),
			"Duplicate binding attempted",
		);
	});

	it("should bind a value and be able to retrieve it", () => {
		const container = new Container();

		assert.is(container.missing("key"), true);
		assert.throws(() => container.get("key"));

		container.constant("key", "value");

		assert.is(container.has("key"), true);
		assert.is(container.get("key"), "value");
	});

	it("should forget a value", () => {
		const container = new Container();

		assert.throws(() => container.unbind("key"));

		container.constant("key", "value");

		assert.not.throws(() => container.unbind("key"));
	});

	it("should flush all bindings", () => {
		const container = new Container();

		assert.throws(() => container.unbind("key"));

		container.constant("key", "value");

		assert.not.throws(() => container.unbind("key"));

		container.flush();

		assert.throws(() => container.unbind("key"));
	});
});
