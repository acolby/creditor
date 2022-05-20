const expect = require("chai").expect;
var os = require('os')
const eol = (os.EOL)
const creditor = require("./");

const testutils_mountTestDir = require("#test/testutils/mountTestDir/index.js");
const utils_normalizePath = require("./utils/normalizePath");

describe("creditor", () => {
  let options;
  let instance;

  beforeEach(() => {
    options = testutils_mountTestDir();
    instance = creditor(options);
  });

  describe("init", () => {
    it("Should properly init", async () => {
      const data = await instance.init(options);

      expect(data.rel_src).to.equal(utils_normalizePath("/src"));
      expect(data.package.uses[utils_normalizePath("comps/root")][utils_normalizePath("stores/user")]).to.equal(true);
      expect(data.package.usedBy[utils_normalizePath("stores/user")][utils_normalizePath("comps/root")]).to.equal(true);
    });
  });

  describe("actions", () => {
    beforeEach(async () => {
      await instance.init();
    });

    describe("actions_create", () => {
      it("should properly create the specified pattern in the specified location", async () => {
        const name = "users/login/mainButton";
        const nameN = utils_normalizePath("users/login/mainButton");
        const dir = utils_normalizePath("src/comps/users/login/mainButton")
        const { files } = await instance.create({
          template: "comps",
          name: nameN,
        });
        const index_expected =
          `export const comps_users_login_mainButton = {${eol}` +
          `  onMount: async () => {},${eol}` +
          `${eol}` +
          `  render: () => {${eol}` +
          `    return <div>comps_users_login_mainButton placeholder</div>;${eol}` +
          `  },${eol}` +
          `};${eol}`;
        const test_expected =
          `import mod from "@src/comps/users/login/mainButton";${eol}` +
          `import expect from "chai";${eol}` +
          `${eol}` +
          `describe("comps_users_login_mainButton", () => {${eol}` +
          `  it("should properly be called", () => {${eol}` +
          `    mod();${eol}` +
          `  });${eol}` +
          `});${eol}`;

        expect(files[utils_normalizePath(`comps/${name}/index.js`)]).to.equal(index_expected);
        expect(files[utils_normalizePath(`comps/${name}/test.js`)]).to.equal(test_expected);
      });

      it("should return an empty object when the pattern doesnt exist", async () => {
        const name = utils_normalizePath("users/login/mainButton");
        const expectedErrorMessage = `the template "nonexsistant" is not defined in the templates dir`;
        let actualErrorMessage;
        try {
          await instance.create({ template: "nonexsistant", name });
        } catch (e) {
           actualErrorMessage = e.message;
        }
        expect(actualErrorMessage).to.equal(expectedErrorMessage);
      });
    });

    describe("actions_move", () => {
      it("should properly move all items in directory", async () => {
        const { files } = await instance.move({
          template: "stores",
          name: "user",
          name_to: "profile",
        });
        expect(!!files.toCreate[utils_normalizePath("stores/profile/access/index.js")]).to.equal(
          true
        );
        expect(!!files.toCreate[utils_normalizePath("stores/profile/index.js")]).to.equal(true);
        expect(!!files.toDelete[utils_normalizePath("stores/user/access/index.js")]).to.equal(true);
        expect(!!files.toDelete[utils_normalizePath("stores/user/index.js")]).to.equal(true);
        expect(!!files.toUpdate[utils_normalizePath("comps/root/index.js")]).to.equal(true);
        expect(!!files.toUpdate[utils_normalizePath("comps/root/test.js")]).to.equal(false);
      });~

      it("should properly update the template files", async () => {
        const { templates } = await instance.move({
          template: "stores",
          name: "user",
          name_to: "profile",
        });
        expect(!!templates.toUpdate[utils_normalizePath("stores/index.js")]).to.equal(true);
        expect(!!templates.toUpdate[utils_normalizePath("comps/index.js")]).to.equal(false);
      });
    });
  });
});
