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
    });

  })
  
});
