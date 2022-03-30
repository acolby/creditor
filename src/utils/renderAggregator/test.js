const expect = require('chai').expect;
const mod = require('./');

describe('utils_renderAggregator', () => {

  let template;
  let usage;

  beforeEach(() => {
    aggregator = (package, helpers) => {
      return `rendered`;
    }
    usage = 'stores/my/name';
  });

  it('should properly render the given aggregator', () => {
    const res = mod(aggregator, usage);
    expect(res).to.equal(`rendered`);
  });

});
