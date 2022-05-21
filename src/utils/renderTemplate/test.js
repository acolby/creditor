const expect = require("chai").expect;
const mod = require("./");
const path = require('path')
;


describe("utils_renderTemplate", () => {
  let template;
  let usage;

  beforeEach(() => {
    template = `
      import item from './';
      export const CREDITOR_UNDERSCORE_NAME = item;
    `;
    usage = path.normalize("stores/my/name");
  });

  it("should properly render CREDITOR_UNDERSCORE_NAME", () => {
    const res = mod(template, usage);
    expect(res).to.equal(`
      import item from './';
      export const stores_my_name = item;
    `);
  });

  it("should properly render CREDITOR_PERIOD_NAME", () => {
    template = template.replace(
      /CREDITOR\_UNDERSCORE\_NAME/g,
      "CREDITOR_PERIOD_NAME"
    );
    const res = mod(template, usage);
    expect(res).to.equal(`
      import item from './';
      export const stores.my.name = item;
    `);
  });

  it("should properly render CREDITOR_DASH_NAME", () => {
    template = template.replace(
      /CREDITOR\_UNDERSCORE\_NAME/g,
      "CREDITOR_DASH_NAME"
    );
    const res = mod(template, usage);
    expect(res).to.equal(`
      import item from './';
      export const stores-my-name = item;
    `);
  });

  it("should properly render CREDITOR_SLASH_NAME", () => {
    template = template.replace(
      /CREDITOR\_UNDERSCORE\_NAME/g,
      "CREDITOR_SLASH_NAME"
    );
    const res = mod(template, usage);
    expect(res).to.equal(`
      import item from './';
      export const stores/my/name = item;
    `);
  });

  it("should properly render multiple CREDITOR_ on the same line", () => {
    template = `import CREDITOR_UNDERSCORE_NAME from '@src/CREDITOR_SLASH_NAME';`;
    const res = mod(template, usage);
    expect(res).to.equal(`import stores_my_name from '@src/stores/my/name';`);
  });

  it("should properly render multiple CREDITOR_ and break out of infinite loop", () => {
    template = `import CREDITOR_UNDERSCORE_NAME from '@src/CREDITOR_NOTUSED_NAME';`;
    const res = mod(template, usage);
    expect(res).to.equal(
      `import stores_my_name from '@src/CREDITOR_NOTUSED_NAME';`
    );
  });
});
