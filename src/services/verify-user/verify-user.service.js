// Initializes the `verifyUser` service on path `/verify-user`
const createService = require('./verify-user.class.js');
const hooks = require('./verify-user.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'verify-user',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/verify-user', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('verify-user');

  service.hooks(hooks);
};
