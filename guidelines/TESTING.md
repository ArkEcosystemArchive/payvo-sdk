# Testing Guidelines

## Gotchas

### Network connectivity is disabled for all tests

Tests should never send real requests unless they specifically designed to. In these cases you usually won't run them on CI but by hand to not hit rate limits. For that reason all network requests are disabled by default and appropriate mocks need to be provided.

### Avoid the use of `describe` for labelling or nesting

With **jest** the `describe` function really has no function at all. It's purely there for grouping tests which often results in developers writing half a description in it, then nesting a test or another describe and going 2-3 levels into nesting because the jest output will create an output that is somewhat readable when it combines all of the describe block titles.

With **uvu** there's more to `describe` than just labelling or grouping a set of tests. It is a decorator around `https://github.com/lukeed/uvu/blob/master/docs/api.uvu.md#suites` which are groups of tests that have their own local state. Any global hooks or other suites are unable to affect them. This creates more robust tests because you don't need to worry about some global state or other test messing with your values in the context of your specific suite.

### Avoid the use of `describe` for unnecessary grouping

With **jest** you will often see that people wrap their tests into a describe block at the root because it makes the input easier to digest but there's no real technical reason to do it. With **uvu** the output does not show test names unless they fail, thus the grouping of tests is somewhat redundant. Try to keep tests at the root describe as much as possible and avoid falling into trap of nesting to multiple levels. If you do have to nest because you run multiple suites in a single file you should keep it to a single level of nesting with separate describe blocks.

### Avoid combining single/multi-level nesting of `describe` blocks

When writing tests you should decide what kind of tests you are going to write before you write them. If you are just going to write a few tests that don't require any grouping then use a single `describe` that indicates the class, function or entity you are testing and keep them at root of the file. If you are going to write tests that require grouping because there's a lot of cases you have two options.

-   Give them expressive titles that make it clear what they test. These should be written for humans so they don't need to contain the function names in the form of `#function` or alike.
-   Organise all of them in separate suites by using `describe` to ensure they have their own local state.

Both of those options are valid and which you choose depends on how you want to organise the tests because of their size.

### Avoid the use of file scope variables when using `describe`

When using uvu you will be either working with file scope variables when using `test` or context variables when using `describe`. This is an important distinction to make because with jest everything is global scope by default and the local scope behaviour of `describe` will make your tests brittle if you mix file scope and local scope variables.

Take a look at https://github.com/lukeed/uvu/blob/master/docs/api.uvu.md#context-1 to see how to use the context that uvu exposes. Everything that needs to be shared between tests should be stored in the context rather than creating variables that are spread out throughout the test file. This keeps things neatly organised and ensures we have a single place from which we can grab things.

## Suites

### `describe(title: string, callback: Function)`

This function creates an instance of an [uvu suite](https://github.com/lukeed/uvu/blob/master/docs/api.uvu.md#suites). Suites are a collection of tests that can have their own hooks. These suites have their own context and state, which provides some guarantees that nothing leaks into another suite.

### `describeWithContext(title: string, context: Context | ContextFunction | ContextPromise, callback: Function)`

This function behaves the same as `describe` but additionally allows you to provide an initial context. This works like calling `beforeAll` in a suite but without having to add an additional call for it.

### Object

```ts
describeWithContext("Context (Object)", { hello: "world" }, ({ assert, it }) => {});
```

### Function

```ts
describeWithContext(
	"Context (Function)",
	() => ({ hello: "world" }),
	({ assert, it }) => {},
);
```

### Async Function

```ts
describeWithContext(
	"Context (Promise Function)",
	async () => Promise.resolve({ hello: "world" }),
	({ assert, it }) => {},
);
```

## Hooks

### `beforeAll(callback: Function)`

The `beforeAll` hook can be used to set up the environment before all of your tests run.

### `beforeEach(callback: Function)`

The `beforeEach` hook can be used to set up the environment before each test that runs.

### `afterAll(callback: Function)`

The `afterAll` hook can be used to tear down the environment after all of your tests have passed.

### `afterEach(callback: Function)`

The `afterEach` hook can be used to tear down the environment after each test that runs. If it passes or fails does not matter.

## Testing

### `it(title: string, callback: Function)`

This function allows you to create a single test.

### `only(title: string, callback: Function)`

This function allows you to indicate that only this test should be run.

### `skip(title: string, callback: Function)`

This function allows you to indicate that this test should be skipped.

### `each(name: string, callback: Function, datasets: unknown[])`

This function allows you to create many tests at once based on a dataset. The title can be written like you would be using [sprintf](https://www.cplusplus.com/reference/cstdio/sprintf/) to fill in properties from your dataset.

## Mocking

### `nock(host: string)`

This function is a wrapper around [nock](https://github.com/nock/nock) to provide some sane defaults that are repeated a lot throughout the tests of the project.

### `stub(target: object, method: string)`

This function is proxy to [Mockery.stub](https://github.com/PayvoHQ/sdk/blob/develop/packages/test/source/mockery.ts) which is a wrapper around [sinon](https://sinonjs.org/).

### Properties

### `assert`

This property is an extension of [uvu/assert](https://github.com/lukeed/uvu/blob/master/docs/api.assert.md). It provides a lot of shorthand versions of assertions that would otherwise be tedious to type and repeat.

### `loader`

This property provides a function called `json` to load the contents of a JSON file into memory.

### `zod`

This property exposes [zod](https://github.com/colinhacks/zod) which can be used to create schemas for object matching.
