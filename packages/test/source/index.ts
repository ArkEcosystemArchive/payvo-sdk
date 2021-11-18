import { test } from "uvu";
import nock from "nock";

import { assert } from "./assert.js";
import { describe } from "./describe.js";
import { loader } from "./loader.js";
import { mockery } from "./mockery.js";

const it = test;

export { assert, describe, it, loader, mockery, nock, test };
