$(document).ready(function(){

    var serverurl = 'http://localhost:3030';

    /*
        Feathers boilerplate
     */
    var socket = io(serverurl);
    //initialize our feathers client application through socket.io
    var client = feathers();
    client.configure( feathers.socketio(socket) );
    //use localstorage to store jwt
    client.configure( feathers.authentication({
        storage: window.localStorage
    }));

    //obtain verify verify users service
    var verifyService = client.service('/verify-user');

    //get URL Query Parameter function
    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };


    //get the query parameters "email" and "token"
    const email = getUrlParameter('email');
    const token = getUrlParameter('token');

    verifyService.create({
        email,
        token
    }).then((res)=>{
        $('#user-message').text('Your account has been activated');
        $('#show-login-link').show();
    }).catch((er)=>{
        console.log(er);
    });


});
