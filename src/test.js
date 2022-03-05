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

    it('Shoulr properly init', async () => {
      const data = await instance.init(options);
      expect(data.rel_src).to.equal('/src')
      expect(data.package['comps/root'][0]).to.equal('stores/user');
      expect(data.package['comps/root'][1]).to.equal('comps/root');
    });

  })

  describe.only('actions', () => {

    let actions;
    beforeEach(async () => {
      const actions = creditor(options)
      options = await actions.init();
    })

    describe('actions_create', () => {

      it('should properly create the specified pattern in the spcified location', () => {
        console.log(options);
        // actions.create({ template: ''})
      });

    })

  })

});
