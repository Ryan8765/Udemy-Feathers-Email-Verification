const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const addVerificationToNewUser = require('../../src/hooks/add-verification-to-new-user');

describe('\'addVerificationToNewUser\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      before: addVerificationToNewUser()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
