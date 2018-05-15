// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
    return async context => {
        const isVerified = context.params.user.is_verified;
        if( !isVerified ) {
            throw new Error('You have not verified your account.  Please access the verification email that was sent to you when you signed up.  Thanks.');
        }
        return context;
    };
};
