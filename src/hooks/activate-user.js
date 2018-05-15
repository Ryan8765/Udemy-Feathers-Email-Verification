// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
    return async context => {


        const user = await context.app.service('users').find({
            email: context.data.email,
            verify_token: context.data.token
        });

        const userId = user.data[0]._id;

        const patchUser = await context.app.service('users').patch(userId, {
            is_verified: true
        });


        return context;
    };
};
