const assert = require('assert');
const app = require('../../src/app');

describe('\'verifyUser\' service', () => {
  it('registered the service', () => {
    const service = app.service('verify-user');

    assert.ok(service, 'Registered the service');
  });
});
