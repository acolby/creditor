const expect = require('chai').expect;
const creditor = require('./');

const testutils_mountTestDir = require('#test/testutils/mountTestDir/index.js');

describe('creditor', () => {

  let options;
  let instance;

  beforeEach(() => {
    options = testutils_mountTestDir();
    instance = creditor(options);
  })

  describe('init', () => {

    it('Should properly init', async () => {
      const data = await instance.init(options);
      expect(data.rel_src).to.equal('/src')
      expect(data.package['comps/root'][0]).to.equal('stores/user');
      expect(data.package['comps/root'][1]).to.equal('comps/root');
    });

  })

  describe('actions', () => {

    beforeEach(async () => {
      await instance.init();
    });

    describe('actions_create', () => {
      it('should properly create the specified pattern in the spcified location', async () => {
        const name = 'users/login/mainButton';
        const files = await instance.create({ template: 'comps', name: 'users/login/mainButton' });
        const index_expected = '\n' +
          'export const users_login_mainButton = {\n' +
          '\n' +
          '  onMount: async () => {},\n' +
          '   \n' +
          '  render: () => {\n' +
          '    return <div>users_login_mainButton placeholder</div>\n' +
          '  },\n' +
          '\n' +
          '};\n';


        const test_expected = 'import mod from \'@src/users/login/mainButton\';\n' +
          'import expect from \'chai\';\n' +
          '\n' +
          'describe(\'users_login_mainButton\', () => {\n' +
          '\n' +
          '  it(\'should properly be called\', () => {\n' +
          '    mod();\n' +
          '  })\n' +
          '\n' +
          '});\n';

        expect(files[`comps/${name}/index.js`]).to.equal(index_expected);
        expect(files[`comps/${name}/test.js`]).to.equal(test_expected)
      });

      it('should return an empty object when the pattern doesnt exist',  async () => {
        const name = 'users/login/mainButton';
        const files = await instance.create({ template: 'nonexsistant', name: 'users/login/mainButton' });
        expect(Object.keys(files).length).to.equal(0);
      })

    });

  })

});
