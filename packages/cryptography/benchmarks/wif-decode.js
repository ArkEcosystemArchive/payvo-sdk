const Benchmark = require("benchmark");
const { decode } = require("wif");
const { WIF } = require("../distribution");

const suite = new Benchmark.Suite();

suite
	.add("bitcoin", function () {
		decode("SGq4xLgZKCGxs7bjmwnBrWcT4C1ADFEermj846KC97FSv1WFD1dA");
	})
	.add("payvohq", function () {
		WIF.decode("SGq4xLgZKCGxs7bjmwnBrWcT4C1ADFEermj846KC97FSv1WFD1dA");
	})
	.on("cycle", function (event) {
		console.log(String(event.target));
	})
	.on("complete", function () {
		console.log("Fastest is " + this.filter("fastest").map("name"));
	})
	.run({ async: true });
