import "reflect-metadata";

import { bootContainer } from "../test/mocking.js";
import { PluginRegistry } from "./plugin-registry.service.js";
import { PluginRepository } from "./plugin.repository";

const stubPlugin = {
    name: "@hello/world",
    version: "1.0.0",
    isEnabled: true,
    permissions: ["something"],
    urls: ["https://google.com"],
};

let subject: PluginRepository;

beforeAll(() => bootContainer());

test.before.each(() => {
    subject = new PluginRepository();
});

it("should return all data", () => {
    assert.is(subject.all()), "object");
});

it("should return the first item", () => {
    assert.is(subject.first()).toMatchInlineSnapshot(`undefined`);
});

it("should return the last item", () => {
    assert.is(subject.last()).toMatchInlineSnapshot(`undefined`);
});

it("should return all data keys", () => {
    assert.is(subject.keys()).toBeArray();
});

it("should return all data values", () => {
    assert.is(subject.values()).toBeArray();
});

it("should find a plugin by its ID", () => {
    const { id } = subject.push(stubPlugin);

    assert.is(subject.findById(id).name, stubPlugin.name);
});

it("should throw if a plugin cannot be found by its ID", () => {
    assert.is(() => subject.findById("fake")).toThrow(`Failed to find a plugin for [fake].`);
});

it("should restore previously created data", () => {
    subject.fill({ ["fake"]: stubPlugin });

    assert.is(subject.findById("fake"), stubPlugin);
});

it("should forget specific data", () => {
    const { id } = subject.push(stubPlugin);

    assert.is(subject.count(), 1);

    subject.forget(id);

    assert.is(subject.count(), 0);
});

it("should flush the data", () => {
    subject.push(stubPlugin);

    assert.is(subject.count(), 1);

    assert.is(subject.flush()), "undefined");

assert.is(subject.count(), 0);
});

it("should count the data", () => {
    assert.is(subject.count(), 0);
});

it("should access the plugin registry", () => {
    assert.is(subject.registry() instanceof PluginRegistry);
});
