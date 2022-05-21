const expect = require("chai").expect;
const mod = require("./");
const path = require('path')
;

describe("utils_renderAggregator", () => {
  let template;
  const myTestPath = path.normalize("stores/my/name")
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
