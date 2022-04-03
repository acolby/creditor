const expect = require("chai").expect;
const mod = require("./");

describe("utils_renderAggregator", () => {
  let template;

  beforeEach(() => {
    aggregator = (package, helpers) => {
      return `rendered`;
    };
    uses = { "stores/my/name": true };
  });

  it("should properly render the given aggregator", () => {
    const res = mod(aggregator, "stores", { uses });
    expect(res).to.equal(`rendered`);
  });
});
