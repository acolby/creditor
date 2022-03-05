const expect = require('chai').expect;
const mod = require('./');

describe('utils_analyzeSrc_parsePatternUsage', () => {
  it('should parse a wide variety of strings', () => {

    const expected = {
      'export const dodos_main_item()': ['dodos/main/item'],
      'import {dodos_user} from "#src/dodos/user"': ['dodos/user'],
      'await dodos_user.actions.fetch("userId");': ['dodos/user'],
      'from "#src/dodos/user"': ['dodos/user'],
    };

    Object.entries(expected)
    .forEach(([given, output]) => {
      const res = mod({ templates: { 'dodos': {} }}, given);
      expect(res[0]).to.equal(output[0])
    })
    
  });

  it('should return multiple matches', () => {

    const expected = {
      'import {dodos_user} from "#src/dodos/user"': ['dodos/user', 'dodos/user'],
      'import {dodos_user} from "#src/dingos/user/access"': ['dodos/user', 'dingos/user/access'],
    };

    Object.entries(expected)
    .forEach(([given, output]) => {
      const res = mod({ templates: { 'dodos': {}, 'dingos': {}, }}, given);
      expect(res[0]).to.equal(output[0])
      expect(res[1]).to.equal(output[1])
    })
    
  });

  it('should properly remove files if the delimiter is /', () => {

    const expected = {
      'import {dodos_user} from "#src/dodos/user/index.js"': ['dodos/user', 'dodos/user'],
      'const dingos_user_access = requrie("#src/dingos/user/access/index.js")': ['dingos/user/access', 'dingos/user/access'],
    };

    Object.entries(expected)
    .forEach(([given, output]) => {
      const res = mod({ templates: { 'dodos': {}, 'dingos': {}, }}, given);
      expect(res[0]).to.equal(output[0])
      expect(res[1]).to.equal(output[1])
    })
    
  });

});
