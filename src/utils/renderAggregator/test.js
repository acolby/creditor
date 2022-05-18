const expect = require("chai").expect;
const mod = require("./");
const utils_normalizePath = require("#src/utils/normalizePath/index.js");

describe("utils_renderAggregator", () => {
  let template;
  const myTestPath = utils_normalizePath("stores/my/name")
  beforeEach(() => {
    aggregator = (package, helpers) => {
      return `rendered`;
    };
    uses = { myTestPath  : true };
  });

  it("should properly render the given aggregator", () => {
    const res = mod(aggregator, "stores", { uses });
    expect(res).to.equal(`rendered`);
  });
});
