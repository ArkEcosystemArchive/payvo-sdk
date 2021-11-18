/* eslint-disable promise/always-return */

/**
 * Based on https://github.com/Dobby89/promise-all-settled-by-key/blob/master/source/__tests__/index.test.js.
 */

import { promiseAllSettledByKey } from "./promise";

const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, "foo error"));
const promise3 = new Promise((resolve, reject) => setTimeout(reject, 100));

test("promiseAllSettledByKey", () => {
    test("should return all resolved and rejected promises by their key", () =>
        promiseAllSettledByKey({
            getFoo: promise2,
            nope: promise3,
            theNumberThree: promise1,
        }).then(({ theNumberThree, getFoo, nope }) => {
            assert.is(theNumberThree, { status: "fulfilled", value: 3 });
            assert.is(getFoo, { status: "rejected", value: "foo error" });
            assert.is(nope, { status: "rejected", value: undefined });
        }));

    test("should return an empty object if no promises object supplied", () =>
        promiseAllSettledByKey().then((settled) => {
            assert.is(settled, {});
        }));

    test("should return ONLY resolved promises", () =>
        promiseAllSettledByKey(
            {
                getFoo: promise2,
                nope: promise3,
                theNumberThree: promise1,
            },
            { onlyResolved: true },
        ).then((results) => {
            assert.is(Object.keys(results)).toHaveLength(1);
            assert.is(results, {
                theNumberThree: { status: "fulfilled", value: 3 },
            });
        }));

    test("should return undefined if given ONLY rejected promises", () =>
        promiseAllSettledByKey(
            {
                getFoo: promise2,
                nope: promise3,
            },
            { onlyResolved: true },
        ).then((results) => {
            assert.is(results), "undefined");
}));

test("should return ONLY rejected promises", () =>
    promiseAllSettledByKey(
        {
            getFoo: promise2,
            nope: promise3,
            theNumberThree: promise1,
        },
        { onlyRejected: true },
    ).then((results) => {
        assert.is(Object.keys(results)).toHaveLength(2);
        assert.is(results, {
            getFoo: { status: "rejected", value: "foo error" },
            nope: { status: "rejected", value: undefined },
        });
    }));

test("should return undefined if given ONLY resolved promises", () =>
    promiseAllSettledByKey(
        {
            theNumberThree: promise1,
        },
        { onlyRejected: true },
    ).then((results) => {
        assert.is(results), "undefined");
        }));
});
