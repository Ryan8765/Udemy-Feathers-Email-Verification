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
    //obtain messages service
    var messagesService = client.service('/messages');



    var populateMessagesOnPageLoad = async ()=>{
        var messages = null;
        var length   = null;
        var html     = ``;
        var message  = null;

        var messages = await messagesService.find({
            query: {
                $sort: {
                  createdAt: -1
                }
            }
        });
        console.log(messages);

        messages = messages.data.reverse();
        length   = messages.length;

        for (var i = 0; i < length; i++) {
            message = messages[i];
            html += new Message( message ).getMessageHtmlString();
        }

        $('#chat-area').append(html);

    };


    var populateUsersOnPageLoad = async ()=>{
        var users  = null;
        var length = null;
        var html   = ``;
        var user   = null;

        var users = await usersService.find({
            query: {
                isOnline: true
            }
        });

        users  = users.data;
        length = users.length;

        for (var i = 0; i < length; i++) {
            user = users[i];
            if( !userIsInDom( user._id ) ){
                html += new User( user ).getUserHtmlString();
            }
        }

        $('#users-window').append(html);

    };




    /*
        Users class handle all user production
     */
    class User {
        constructor( user ) {
            this._id      = user._id;
            this.username = user.username;
        }

        getUserHtmlString() {
            var userHtmlString = `
                <div class="media user-name-object" data-id="${this._id}">
                    <div class="media-left media-middle">
                        <a href="#">
                            <img src="https://www.iconexperience.com/_img/o_collection_png/green_dark_grey/512x512/plain/user.png" alt="32x32 user image" class="media-object" style="width: 32px; height: 32px;">
                        </a>
                    </div>
                    <div class="media-body">
                        <h4 class="media-heading">${this.username}</h4>
                    </div>
                </div>
            `;

            return userHtmlString;
        }
    }//end class


    /*
        Messages class - handle all message production
     */
    class Message {
        constructor( message ) {
            this.msgText   = message.text;
            this.msgUserId = message.userId;
            this.msgId     = message._id;
            this.createdAt = message.createdAt;
            this.username  = message.user.username;
        }

        getMessageHtmlString() {
            var deleteIconHtml = ``;
            var msgCreatedAt = new Date( this.createdAt ).toLocaleString();

            if( this.msgUserId === client.get('userId') ) {
                deleteIconHtml = `
                    <div class="pull-right">
                        <span class="delete-comment" title="Delete Comment?"><i class="fa fa-times" aria-hidden="true"></i></span>
                    </div>
                `;
            }

            var msgHtmlString = `
                <div class="media" data-id="${this.msgId}">
                    <div class="media-left">
                        <a href="#">
                            <img src="https://www.iconexperience.com/_img/o_collection_png/green_dark_grey/512x512/plain/user.png" alt="64x64 user image" class="media-object" style="width: 64px; height: 64px;">
                        </a>
                    </div>
                    <div class="media-body">
                        ${deleteIconHtml}
                        <h4 class="media-heading">${this.username}</h4>
                        <span class="comment-date">${msgCreatedAt}</span>
                        <br><br>
                        ${this.msgText}
                    </div>
                </div>
            `;

            return msgHtmlString;
        }

    }//end message class


    /*
        Check if user is already logged in
     */
    function userIsInDom(userId) {
        if( $(`.user-name-object[data-id="${userId}"]`).length ) {
            return true;
        } else {
            return false;
        }
    }

    /*
        Remove user from DOM
     */
    function removeUserFromDom( userId ) {
        $(`.user-name-object[data-id="${userId}"]`).remove();
    }

    /*
        Add user to DOM
     */
    function addUserToDom( user ) {
        var user = new User( user );
        var html = user.getUserHtmlString();
        $('#users-window').append(html);
    }



    //if user is authenticated - run page code ELSE redirect to login page
    client.authenticate()
        .then((response)=>{

            return client.passport.verifyJWT(response.accessToken);

        }).then((payload)=>{
            const { userId } = payload;
            client.set('userId', userId);
            main();
        }).catch((err)=>{
            //client is not authenticated - redirect to login
            window.location.href = `${serverurl}/login.html`;
        });//end authenticate



    /**
     * Function runs all page load scripts after authentication is completed.
     */
    function main() {

        populateUsersOnPageLoad();
        populateMessagesOnPageLoad();

        //watch for a removed event, when found, remove message from HTML testing
        messagesService.on('removed', (message)=>{
            var msgId = message._id;

            $(`.media[data-id="${msgId}"]`).remove();
        });

        $('#chat-area').on('click', '.delete-comment', function(){

            var msgId = $(this).closest('.media').attr('data-id');
            messagesService.remove(msgId).catch((e)=>{
                alert('There was an error removing a message!');
            });

        });


        /*
            Logout User if Logout Button is Clicked
         */
         $('#logout-icon').on('click', function(){
             //logout the user on the client/server
             client.logout();
             //redirect to the login form
             window.location.href = `${serverurl}/login.html`

         });

         /*
            Create new message code
          */
         $('#submit-message-form').submit(function(e){
            e.preventDefault();

            var $msgText = $('#msg-text');
            var msgText = $msgText.val();

            $msgText.val('');

            //if message text contains more than whitespace, save the message to the database
            if(msgText.trim().length) {
                messagesService.create({
                    text: msgText
                }).catch((err)=>{
                    alert('There was an error!');
                });
            }

         });

         /*
            Watch for new message events and handle approp.
          */
         messagesService.on('created', (message)=>{
            var newMessage = new Message( message );

            $('#chat-area').append( newMessage.getMessageHtmlString() );

            //animate the user window down when a new message is added
            $('html, body').animate({ scrollTop: $(document).height() }, "slow");
         });


         /*
            Add/Remove user from DOM
          */
         usersService.on('patched', (user)=>{
             const userId   = user._id;
             const userName = user.username;

             if(user.isOnline === false) {
                 if( userIsInDom(userId) ) {
                     removeUserFromDom(userId);
                 }
             }

             if( user.isOnline === true ) {
                 if(!userIsInDom(userId)) {
                     addUserToDom(user);
                 }
             }
         });


    }//end main



});
