import { test } from "uvu";
import nock from "nock";
import sinon from "sinon";

import { assert } from "./assert.js";
// @TODO: deprecate once all tests are refactored
import { describe } from "./describe.js";
import { loader } from "./loader.js";
import { mockery } from "./mockery.js";

// @TODO: deprecate once all tests are refactored
const it = test;

export { assert, describe, it, loader, mockery, nock, sinon, test };
