const expect = require('chai').expect;
const creditor = require('./');

const testutils_mountTestDir = require('#test/testutils/mountTestDir/index.js');

describe('creditor', () => {

  let options;

  beforeEach(() => {
    options = testutils_mountTestDir();
  })

  describe('setup', () => {

    it('Should proper load the config', async () => {
      const instance = await creditor(options);
      expect(instance.options.rel_src).to.equal('/src')
      expect(instance.options.package['comps/root'][0]).to.equal('stores/user');
      expect(instance.options.package['comps/root'][1]).to.equal('comps/root');
    });

  })

  describe('actions', () => {

    let instance;
    beforeEach(async () => {
      const instance = await creditor(options);
    })

    describe('create', () => {

      it('should properly create the specified pattern in the spcified location', () => {
        
      });

    })

  })

});
