import "reflect-metadata";

import { bootContainer } from "../test/mocking";
import { PluginRegistry } from "./plugin-registry.service";
import { PluginRepository } from "./plugin.repository";

const stubPlugin = {
    name: "@hello/world",
    version: "1.0.0",
    isEnabled: true,
    permissions: ["something"],
    urls: ["https://google.com"],
};

let subject: PluginRepository;

test.before(() => bootContainer());

test.before.each(() => {
    subject = new PluginRepository();
});

test("should return all data", () => {
    assert.is(subject.all(), "object");
});

test("should return the first item", () => {
    assert.is(subject.first(), undefined`);
});

test("should return the last item", () => {
    assert.is(subject.last(), undefined`);
});

test("should return all data keys", () => {
    assert.is(subject.keys()).toBeArray();
});

test("should return all data values", () => {
    assert.is(subject.values()).toBeArray();
});

test("should find a plugin by its ID", () => {
    const { id } = subject.push(stubPlugin);

    assert.is(subject.findById(id).name, stubPlugin.name);
});

test("should throw if a plugin cannot be found by its ID", () => {
    assert.is(() => subject.findById("fake")).toThrow(`Failed to find a plugin for [fake].`);
});

test("should restore previously created data", () => {
    subject.fill({ ["fake"]: stubPlugin });

    assert.is(subject.findById("fake"), stubPlugin);
});

test("should forget specific data", () => {
    const { id } = subject.push(stubPlugin);

    assert.is(subject.count(), 1);

    subject.forget(id);

    assert.is(subject.count(), 0);
});

test("should flush the data", () => {
    subject.push(stubPlugin);

    assert.is(subject.count(), 1);

    assert.is(subject.flush()), "undefined");

assert.is(subject.count(), 0);
});

test("should count the data", () => {
    assert.is(subject.count(), 0);
});

test("should access the plugin registry", () => {
    assert.is(subject.registry() instanceof PluginRegistry);
});
