const expect = require("chai").expect;
const mod = require("./");
const utils_normalizePath = require("#src/utils/normalizePath/index.js");


describe("utils_parsePatternUsage", () => {
  it("should parse a wide variety of strings", () => {
    const expected = {
      "export const dodos_main_item()": [utils_normalizePath("dodos/main/item")],
      'import {dodos_user} from "#src/dodos/user"': [utils_normalizePath("dodos/user")],
      'await dodos_user.actions.fetch("userId");': [utils_normalizePath("dodos/user")],
      "const user = useSelector((select) => select.dodos_user);": [
        utils_normalizePath("dodos/user"),
      ],
      'from "#src/dodos/user"': [utils_normalizePath("dodos/user")],
      "export { selector () => dodos_user, other: true };": [utils_normalizePath("dodos/user")],
    };

    Object.entries(expected).forEach(([given, output]) => {
      const res = mod({ templates: { dodos: {} } }, given);
      expect(res[0]).to.equal(output[0]);
    });
  });

  it("should return multiple matches", () => {
    const expected = {
      'import {dodos_user} from "#src/dodos/user"': [
        utils_normalizePath("dodos/user"),
        utils_normalizePath("dodos/user"),
      ],
      'import {dodos_user} from "#src/dingos/user/access"': [
        utils_normalizePath("dodos/user"),
        utils_normalizePath("dingos/user/access"),
      ],
    };

    Object.entries(expected).forEach(([given, output]) => {
      const res = mod({ templates: { dodos: {}, dingos: {} } }, given);
      expect(res[0]).to.equal(output[0]);
      expect(res[1]).to.equal(output[1]);
    });
  });

  it("should properly remove files if the delimiter is /", () => {
    const expected = {
      'import {dodos_user} from "#src/dodos/user/index.js"': [
        utils_normalizePath("dodos/user"),
        utils_normalizePath("dodos/user"),
      ],
      'const dingos_user_access = requrie("#src/dingos/user/access/index.js")':
        [utils_normalizePath("dingos/user/access"), utils_normalizePath("dingos/user/access")],
    };

    Object.entries(expected).forEach(([given, output]) => {
      const res = mod({ templates: { dodos: {}, dingos: {} } }, given);
      expect(res[0]).to.equal(output[0]);
      expect(res[1]).to.equal(output[1]);
    });
  });

  it("should provide attional information if verbose is set to true", () => {
    const expected = {
      'import {dodos_user} from "#src/dodos/user/index.js"': [
        { usage: utils_normalizePath("dodos/user"), col_start: 8, col_end: 18, delimiter: "_" },
        { usage: utils_normalizePath("dodos/user"), col_start: 31, col_end: 41, delimiter: "/" },
      ],
      'const dingos_user_access = require("#src/dingos/user/access/index.js")':
        [
          {
            usage: utils_normalizePath("dingos/user/access"),
            col_start: 6,
            col_end: 24,
            delimiter: "_",
          },
          {
            usage: utils_normalizePath("dingos/user/access"),
            col_start: 41,
            col_end: 59,
            delimiter: "/",
          },
        ],
    };

    Object.entries(expected).forEach(([given, output]) => {
      const res = mod({ templates: { dodos: {}, dingos: {} } }, given, true);
      expect(JSON.stringify(res[0])).to.equal(JSON.stringify(output[0]));
      expect(JSON.stringify(res[1])).to.equal(JSON.stringify(output[1]));
    });
  });
});
