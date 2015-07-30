// golobal variables
var url = window.location.origin;

//jquery selector
var $loginBtn = $("#loginBtn");
var $logoutBtn = $("#logoutBtn");
var $usernameArea = $('#username_display');


// global functions
function randHex() {
    return (Math.floor(Math.random() * 56) + 200).toString(16);
}

function randColor() {
    return "#" + randHex() + "" + randHex() + "" + randHex();
}

function myAlert(message){
	BootstrapDialog.show({
	    title: '提示',
	    size: BootstrapDialog.SIZE_SMALL,
	    message: message
	});
}

// global objects
function Security(){

    function checkLogin(callback, showAlert){
        $.get(url + '/checkLogin', function(data){
            if (data){
                $usernameArea.text("Welcome " + data);
                $loginBtn.hide();
                $logoutBtn.show();
                if (callback && typeof callback === "function") callback();
            }else{
                if (showAlert !== false) myAlert("Please login first");
                $logoutBtn.hide();
            }
        });
    }

    this.checkLogin = checkLogin;
}

function LoginModule(){
	// long string
	var loginMessage = 
						'<form id="loginForm" class="modal-input">' +
							'<input style="margin-bottom: 10px;" class="modal-input" type="text" name="username" placeholder="用户名" />' +
							'<input class="modal-input" type="password" name="password" placeholder="密码" />' +
						'</form>';
    var registerMessage = 
                        '<form id="registerForm" class="modal-input">' +
                            '<input style="margin-bottom: 10px;" class="modal-input" type="text" name="username" placeholder="用户名" />' +
                            '<input style="margin-bottom: 10px;" class="modal-input" type="password" name="password" placeholder="密码" />' +
                            '<input style="margin-bottom: 10px;" class="modal-input" type="password" name="password2" placeholder="确认密码" />' +
                            '<input class="modal-input" type="text" name="email" placeholder="邮箱" />' +
                        '</form>';
    var topicMessage = 
                       '<form id="topicForm" class="modal-input">' +
                            '<input style="margin-bottom: 10px;" class="modal-input" type="text" name="subject" placeholder="主题" />' +
                            '<textarea form="topicForm" class="modal-input" placeholder="内容" style="min-height: 200px;" name="content"></textarea>'
                        '</form>';

    //functions

    function checkEmptyForm(form){
        var formArray = form.serializeArray();
        for (var i=0; i<formArray.length; i++){
            if (!formArray[i] || formArray[i].value.length < 1){
                myAlert('Please fill all fields');
                return;
            }
        }
    }
    
    function logout(){
        $.post(url + '/logout', null, function(){
            $logoutBtn.hide();
            $loginBtn.show();
            $usernameArea.empty();
        });
    }

    function createTopicForm(){
        //check login
        security.checkLogin(showTopicForm);
    }

    function createLoginRegisterForm(){
         BootstrapDialog.show({
            title: '用户登录',
            onshow: function(dialog) {
                dialog.setSize(BootstrapDialog.SIZE_SMALL);
                dialog.state = "login";
                // $('.modal-content').css('max-width', '300px');
            },
            message: loginMessage,
            buttons: [{
                label: '登录',
                action: loginListener
            },{
                label: '注册',
                action: registerListener
            }]
        });
        
        function loginListener(dialog){
            if (dialog.state === "register"){
                dialog.state = "login";
                dialog.setTitle('用户登录');
                dialog.setMessage(loginMessage);
            }
            else{
                var form = $("#loginForm");
                var formData = form.serialize();
                
                checkEmptyForm(form);

                $.post( url + '/login', formData).done(function(data){
                    console.log('success: ' + data);
                    dialog.close();
                    security.checkLogin(null, false);

                }).fail(function(jqXHR, textStatus, error){
                     console.log('error: ' + error);
                     myAlert('failed to login');
                });                   
            }
        }

        function registerListener(dialog){
            if (dialog.state === "login"){
               dialog.state = "register";
               dialog.setTitle('注册新用户');
               dialog.setMessage(registerMessage);
            }
            else{
                var form = $("#registerForm");
                var formData = form.serialize();
                checkEmptyForm(form);
                $.post( url + '/register', formData).done(function(data){
                    dialog.state = "login";
                    dialog.setTitle('用户登录');
                    dialog.setMessage(loginMessage);
                    myAlert('Registration success, please login');
                }).fail(function(jqXHR, textStatus, error){
                     console.log(jqXHR);
                     myAlert(jqXHR.responseText);
                });
                
            }
        }

    }

    this.createLoginRegisterForm = createLoginRegisterForm;
}



// global variables
var security = new Security();
var loginModule = new LoginModule();
