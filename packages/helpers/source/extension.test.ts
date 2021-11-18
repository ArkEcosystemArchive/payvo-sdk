import { extension } from "./extension.js";

describe("#extension", () => {
    it("should return the file extension", () => {
        assert.is(extension("file.html"), "html");
        assert.is(extension("file.js"), "js");
        assert.is(extension("file.ts"), "ts");
        assert.is(extension("file.php"), "php");
        assert.is(extension("file.rb"), "rb");
        assert.is(extension("file.ext"), "ext");
        assert.is(extension("")), "undefined");
});
});
