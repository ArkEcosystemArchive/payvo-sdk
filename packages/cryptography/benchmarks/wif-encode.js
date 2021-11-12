const Benchmark = require("benchmark");
const { encode } = require("wif");
const { WIF } = require("../distribution");

const suite = new Benchmark.Suite();

suite
	.add("bitcoin", function () {
		encode(170, Buffer.from("d8839c2432bfd0a67ef10a804ba991eabba19f154a3d707917681d45822a5712", "hex"), true);
	})
	.add("payvohq", function () {
		WIF.encode({
			version: 170,
			privateKey: "d8839c2432bfd0a67ef10a804ba991eabba19f154a3d707917681d45822a5712",
			compressed: true,
		});
	})
	.on("cycle", function (event) {
		console.log(String(event.target));
	})
	.on("complete", function () {
		console.log("Fastest is " + this.filter("fastest").map("name"));
	})
	.run({ async: true });
