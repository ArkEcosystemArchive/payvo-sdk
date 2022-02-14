# Testing

Writing automated tests for your software is important to ensure no regressions sneak in, everything works as expected and that you're not corrupting user data.

The Platform SDK is designed in such a way that testing it is quite simple because everything can be mocked and some core components can even be completely replaced with custom implementations.

## Prerequisites

We recommend to use [Jest](https://jestjs.io/) for testing but any other framework will do. You will also need [PNPM](https://pnpm.io/) and [Rush](https://rushjs.io/) to install and build the mono-repository.

## Example

We will use the [Portfolio](https://github.com/PayvoHQ/profiles/blob/master/source/portfolio.test.ts) class as an example as it exposes a few underlying components of the Platform SDK.

### Mocking Network Requests

This one isn't specific to the Platform SDK but we do recommend to use [nock](https://github.com/nock/nock) for mocking of network requests. This will make your life a lot easier when you are bootstrapping a coin in tests because a coin will always try to connect to a network to gather some information.

```ts
beforeAll(() => nock.disableNetConnect());

beforeEach(async () => {
    nock.cleanAll();

    nock(/.+/)
        .get("/api/node/configuration")
        .reply(200, require("test/fixtures/client/configuration.json"))
        .get("/api/peers")
        .reply(200, require("test/fixtures/client/peers.json"))
        .get("/api/node/configuration/crypto")
        .reply(200, require("test/fixtures/client/cryptoConfiguration.json"))
        .get("/api/node/syncing")
        .reply(200, require("test/fixtures/client/syncing.json"));
});
```

This is what a typical network mocking setup would look like if you are writing a test that would involve the `platform-sdk-ark` integration when bootstrapping the environment. This ensures that the tests won't be able to use your real network connection which will ensure that your tests throw an exception if you are missing any mocks.

If you are missing any mocks you should make sure that you add them to guarantee consistent results when running your tests but also ensure that they are as fast as they possibly can be.

### Mocking Implementations

Every now and then you'll find yourself in a situation where you need to test that a function behaves differently depending on certain variables like the type of network or kind of configuration it is using.

This is where Jest comes in handy with the ability to [mock return values](https://jestjs.io/docs/mock-functions#mock-return-values) or even [mock the implementation](https://jestjs.io/docs/mock-functions#mock-implementations) of a function.

```ts
it("should aggregate the balances of all wallets", async () => {
    const [a, b, c] = await Promise.all([
        profile.wallets().importByMnemonic("a", "ARK", "ark.devnet"),
        profile.wallets().importByMnemonic("b", "ARK", "ark.devnet"),
        profile.wallets().importByMnemonic("c", "ARK", "ark.devnet"),
    ]);
    a.data().set(WalletData.Balance, 1e8);
    b.data().set(WalletData.Balance, 1e8);
    c.data().set(WalletData.Balance, 1e8);

    jest.spyOn(a.network(), "isLive").mockReturnValue(true);
    jest.spyOn(a.network(), "isTest").mockReturnValue(false);
    jest.spyOn(a.network(), "ticker").mockReturnValue("ARK");

    jest.spyOn(b.network(), "isLive").mockReturnValue(true);
    jest.spyOn(b.network(), "isTest").mockReturnValue(false);
    jest.spyOn(b.network(), "ticker").mockReturnValue("ARK");

    jest.spyOn(c.network(), "isLive").mockReturnValue(true);
    jest.spyOn(c.network(), "isTest").mockReturnValue(false);
    jest.spyOn(c.network(), "ticker").mockReturnValue("ARK");

    await container.get<IExchangeRateService>(Identifiers.ExchangeRateService).syncAll(profile, "ARK");

    expect(profile.portfolio().breakdown()[0].source).toBe(3);
    expect(profile.portfolio().breakdown()[0].target).toBe(0.00015144);
    expect(profile.portfolio().breakdown()[0].shares).toBe(100);
});
```

In the above example we are testing that the portfolio of a profile can be calculated. There is one rule that needs to be kept in mind when aggregating the portfolio. That rule is that only wallets from production networks should be taken into account which means ARK will be part of your portfolio but DARK won't be because it isn't a real coin.

To achieve this we import 3 wallets that all belong to the same network so that we don't require duplicate network mocks. Then we mock them to be all wallets that use a live network and finally try to access to our portfolio to see that all our data matches what we would expect it to be.

### Swapping Implementations

Mocking is a handy tool when you quickly want to modify smaller behaviours or functions but what if you want to change how a whole class behaves? That's where swapping implementations comes in.

```ts
export class StubStorage implements Storage {
    readonly #storage;

    public constructor() {
        try {
            this.#storage = JSON.parse(readFileSync(resolve(__dirname, "env.json")).toString());
        } catch {
            this.#storage = {};
        }
    }

    public async all<T = Record<string, unknown>>(): Promise<T> {
        return this.#storage;
    }

    public async get<T = any>(key: string): Promise<T | undefined> {
        return this.#storage[key];
    }

    public async set(key: string, value: string | object): Promise<void> {
        this.#storage[key] = value;

        writeFileSync(resolve(__dirname, "env.json"), JSON.stringify(this.#storage));
    }

    public async has(key: string): Promise<boolean> {
        return Object.keys(this.#storage).includes(key);
    }

    public async forget(key: string): Promise<void> {
        //
    }

    public async flush(): Promise<void> {
        //
    }

    public async count(): Promise<number> {
        return 0;
    }

    public async snapshot(): Promise<void> {
        //
    }

    public async restore(): Promise<void> {
        //
    }
}

// Ensure that we are overwriting the existing binding!
container.rebind(Identifiers.Storage, new StubStorage());
```

The above example is taken from the test suite of the `profiles` package and shows you how to swap out a core component of the package with your own implementation. This example implements a storage that is mostly a stub and will only keep data in-memory for the duration of the test it is used in.

This is useful because it means we won't have to deal with any kind of persistence issues or overlaps between tests and can preload a fixture for the storage if it is available.
