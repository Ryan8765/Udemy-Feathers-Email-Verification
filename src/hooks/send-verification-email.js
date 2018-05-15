// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html


const generateHTMLEmail = require('../email_templates/activate_account');
const mailgun           = require('mailgun-js');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
    return async context => {

        //get configs
        const host           = context.app.get('host');
        const port           = context.app.get('port');
        const mailgun_key    = context.app.get('mailgun_key');
        const mailgun_domain = context.app.get('mailgun_domain');

        //get the verifyToken off of the user and email
        const verifyToken       = context.data.verify_token;
        var userEmail           = context.data.email;
        var userURIEncodedEmail = encodeURIComponent( userEmail );

        //create mailgun instance
        var mailgunInstance = mailgun({apiKey: mailgun_key, domain: mailgun_domain});

        //create a link for the user to click
        var link = `http://${host}:${port}/activate.html?token=${verifyToken}&email=${userURIEncodedEmail}`;

        //generate html email
        var html = generateHTMLEmail( link );

        //initialize mailgun data object
        var data = {
            from: 'rmhaas221@gmail.com',
            to: userEmail,
            subject: 'Verify Email for Feathers Chat',
            html
        };

        //send the email!
        var sendmail = await mailgunInstance.messages().send(data);


        return context;
    };
};
