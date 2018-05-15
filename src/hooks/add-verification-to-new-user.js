// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const randomstring = require('randomstring');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
    return async context => {

        //add the two fields to the context data
        context.data.is_verified = false;
        context.data.verify_token = randomstring.generate({
            length: 30,
            charset: "alphanumeric"
        });

        return context;
    };
};
