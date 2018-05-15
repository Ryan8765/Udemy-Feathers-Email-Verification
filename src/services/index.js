const users = require('./users/users.service.js');
const messages = require('./messages/messages.service.js');
const verifyUser = require('./verify-user/verify-user.service.js');
module.exports = function (app) {
  app.configure(users);
  app.configure(messages);
  app.configure(verifyUser);
};
