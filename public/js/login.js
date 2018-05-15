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

    //obtain users service
    var usersService = client.service('/users');




    /*
        Get User Credentials
     */
    function getCredentials() {
        var user = {
            email: $('#email').val(),
            password: $('#password').val()
        };

        return user;
    }


    $('#login-user-form').submit(function(e) {
        e.preventDefault();

        var userCredentials = getCredentials();



        //use the feathers client to authenticate
        client.authenticate({
            strategy: 'local',
            email: userCredentials.email,
            password: userCredentials.password
        }).then((token)=>{
            //if successful redirect to the chat application
            window.location.href = serverurl;
        }).catch((err)=>{
            console.log(err);
            //if unsuccessful provide an error message to the user
            $('#error-message')
                .text(`Error loggin in.  ${err.message}.`)
                .show();
        });


    });





});
