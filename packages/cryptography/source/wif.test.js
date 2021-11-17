import { test } from "uvu";
import * as assert from 'uvu/assert';

import { WIF } from "./wif";

test("#encode", () => {
	assert.type(
		WIF.encode({
			compressed: true,
			privateKey: "d8839c2432bfd0a67ef10a804ba991eabba19f154a3d707917681d45822a5712",
			version: 170,
		}),
		"string",
	);
});

test("#decode", () => {
	assert.equal(WIF.decode("SGq4xLgZKCGxs7bjmwnBrWcT4C1ADFEermj846KC97FSv1WFD1dA"), {
		"compressed": true,
		"privateKey": "d8839c2432bfd0a67ef10a804ba991eabba19f154a3d707917681d45822a5712",
		"version": 170,
	});
});

test.run();
