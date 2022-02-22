const expect = require('chai').expect;
const creditor = require('./');

const testutils_mountTestDir = require('#test/testutils/mountTestDir/index.js');

describe('creditor', () => {

  let options;

  beforeEach(() => {
    options = testutils_mountTestDir();
  })

  it('TODO', async () => {

    console.log('---', options);
    await creditor(options);
  });

});
