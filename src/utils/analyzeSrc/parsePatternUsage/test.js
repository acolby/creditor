const expect = require('chai').expect;
const mod = require('./');

describe('utils_analyzeSrc_parsePatternUsage', () => {
  it('should find a usage patten in a given string', () => {
    const res = mod({ templates: { 'dodos': {} }}, 'export const dodos_main_item()');
    expect(res).to.equal('dodos/main/item')
  })
});
