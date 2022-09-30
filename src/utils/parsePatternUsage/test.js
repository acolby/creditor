const expect = require("chai").expect;
const mod = require("./");

describe("utils_parsePatternUsage", () => {
  it("should parse a wide variety of strings", () => {
    const expected = {
      "export const dodos_main_item()": ["dodos/main/item"],
      'import {dodos_user} from "#src/dodos/user"': ["dodos/user"],
      'await dodos_user.actions.fetch("userId");': ["dodos/user"],
      "const user = useSelector((select) => select.dodos_user);": [
        "dodos/user",
      ],
      'from "#src/dodos/user"': ["dodos/user"],
      "export { selector () => dodos_user, other: true };": ["dodos/user"],
    };

    Object.entries(expected).forEach(([given, output]) => {
      const res = mod({ templates: { dodos: {} } }, given);
      expect(res[0]).to.equal(output[0]);
    });
  });

  it("should return multiple matches", () => {
    const expected = {
      'import {dodos_user} from "#src/dodos/user"': [
        "dodos/user",
        "dodos/user",
      ],
      'import {dodos_user} from "#src/dingos/user/access"': [
        "dodos/user",
        "dingos/user/access",
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
        "dodos/user",
        "dodos/user",
      ],
      'const dingos_user_access = requrie("#src/dingos/user/access/index.js")':
        ["dingos/user/access", "dingos/user/access"],
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
        { usage: "dodos/user", col_start: 8, col_end: 18, delimiter: "_" },
        { usage: "dodos/user", col_start: 31, col_end: 41, delimiter: "/" },
      ],
      'const dingos_user_access = requrie("#src/dingos/user/access/index.js")':
        [
          {
            usage: "dingos/user/access",
            col_start: 6,
            col_end: 24,
            delimiter: "_",
          },
          {
            usage: "dingos/user/access",
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

  it("should terminate string if there is a double delimiter", () => {
    const expected = {
      "import {dodos_user__meta} ": ["dodos/user"],
    };

    Object.entries(expected).forEach(([given, output]) => {
      const res = mod({ templates: { dodos: {}, dingos: {} } }, given);
      expect(res[0]).to.equal(output[0]);
    });
  });
});
