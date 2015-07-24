// global variables

// global functions
function randHex() {
    return (Math.floor(Math.random() * 56) + 200).toString(16);
}

function randColor() {
    return "#" + randHex() + "" + randHex() + "" + randHex();
}

$(function(){
    //variables
    var url = window.location.origin;

    //jquery selector
    var $loginBtn = $("#loginBtn");
    var $logoutBtn = $("#logoutBtn");
    var $usernameArea = $('#username_display');
    var $addTopic = $('#createTopicBtn');
    var $portfolioSection = $('#portfolio');

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
                            '<textarea class="modal-input" placeholder="内容" style="min-height: 200px;"></textarea>'
                        '</form>';

    //functions
    function checkLogin(){
        $.get(url + '/checkLogin', function(data){
            console.log(data)
            if (data){
                appendUsername(data);
            }else{
                $logoutBtn.hide();
            }
        })
    }

    function appendUsername(name){
        $usernameArea.text("Welcome " + name);
        $loginBtn.hide();
        $logoutBtn.show();
    }

    function logout(){
        $.post(url + '/logout', null, function(){
            $logoutBtn.hide();
            $loginBtn.show();
            $usernameArea.empty();
        });
    }

    function addTopic(){
        var boxHtml = 
                    '<div id="yoyo" class="topicBox col-lg-3 col-sm-4 col-xs-6" style="background-color: '+ 
                            randColor() +'; min-height:150px;">' + 
                        // '<a href="#">' + 
                        // '</a>' +
                    '</div>';

        console.log('Add topic', randColor());
        $portfolioSection.find('.row').append(boxHtml);
        // $portfolioSection.empty();
    }

    function myAlert(message){
        BootstrapDialog.show({
            title: '提示',
            size: BootstrapDialog.SIZE_SMALL,
            message: message
        });
    }

    function createTopicForm(){
        BootstrapDialog.show({
            title: '添加新的话题',
            size: BootstrapDialog.SIZE_NORMAL,
            message: topicMessage,
            buttons: [{
                label: '添加',
                action: function(dialog) {
                   
                }
            },{
                label: '取消',
                action: function(dialog) {
                    dialog.close();
                }
            }]
        });
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
                action: function(dialog) {
                    if (dialog.state === "register"){
                        dialog.state = "login";
                        dialog.setTitle('用户登录');
                        dialog.setMessage(loginMessage);
                    }
                    else{
                        var form = $("#loginForm");
                        var formData = form.serialize();
                        var formArray = form.serializeArray();

                        for (var i=0; i<formArray.length; i++){
                            if (!formArray[i] || formArray[i].value.length < 1){
                                myAlert('Plz fill all fields');
                                return;
                            }
                        }

                        $.post( url + '/login', formData).done(function(data){
                            console.log('success: ' + data);
                            //--switch back to login
                            dialog.close();
                            appendUsername(data);

                        }).fail(function(jqXHR, textStatus, error){
                             console.log('error: ' + error);
                             myAlert('failed to login');
                        });                   
                    }
                }
            },{
                label: '注册',
                action: function(dialog) {
                    if (dialog.state === "login"){
                       dialog.state = "register";
                       dialog.setTitle('注册新用户');
                       dialog.setMessage(registerMessage);
                    }
                    else{
                        var form = $("#registerForm");
                        var formData = form.serialize();
                        var formArray = form.serializeArray();
                        //console.log(formArray);
                        //--form check 
                        for (var i=0; i<formArray.length; i++){
                            if (!formArray[i] || formArray[i].value.length < 1){
                                myAlert('Plz fill all fields');
                                return;
                            }
                        }

                        console.log(formData);
                        //--post register
                        $.post( url + '/register', formData).done(function(data){
                            console.log('success: ' + data);
                            //--switch back to login
                            dialog.state = "login";
                            dialog.setTitle('用户登录');
                            dialog.setMessage(loginMessage);
                            myAlert('Registration success, plz login');
                        }).fail(function(jqXHR, textStatus, error){
                             console.log('error: ' + error);
                             myAlert('failed to register');
                        });
                        
                    }
                }
            }]
        });
    }

    //listeners
    $loginBtn.click(createLoginRegisterForm);

    $logoutBtn.click(logout);

    $addTopic.click(function(event){
        event.preventDefault();
        createTopicForm();
        //addTopic();
    });

    //Initialization
    checkLogin();
})





