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

    //constant
    TIME_FORMAT = 'MM/DD/YYYY hh:mm';

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

    function addTopic(obj){
        var boxHtml = 
                    '<div class="topicBox col-lg-4 col-sm-6" style="background-color: '+ 
                            randColor() + '; min-height: 200px">' + 
                        '<h2 style="margin: 0px;">' + obj.subject + '</h2>' + 
                        '<p style="margin: 0px;">' + obj.content + '</p>' +
                        '<div style="margin: 0px;" class="right"><p style="margin: 0px;">' + obj.createdBy + '</p>' +
                        '<p style="margin: 0px;">' + moment(obj.createdTime).format(TIME_FORMAT); + '</p></div>' +
                    '</div>';

        $portfolioSection.find('.row').append(boxHtml);
    }

    function myAlert(message){
        BootstrapDialog.show({
            title: '提示',
            size: BootstrapDialog.SIZE_SMALL,
            message: message
        });
    }

    function createTopicForm(){

        //check login
        checkLogin(showTopicForm);

        function showTopicForm(){
            BootstrapDialog.show({
                title: '添加新的话题',
                size: BootstrapDialog.SIZE_NORMAL,
                message: topicMessage,
                buttons: [{
                    label: '添加',
                    action:  addTopicListener
                },{
                    label: '取消',
                    action: function(dialog) {
                        dialog.close();
                    }
                }]
            });

            function addTopicListener(){
                var form = $("#topicForm");
                var data = form.serialize();
                
                checkEmptyForm(form);
                //post
                $.post('/createTopic', data).done(function(){
                    myAlert('Topic created!');
                })
            }
        }
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
                action: registerListener
            },{
                label: '注册',
                action: loginListener
            }]
        });
        
        function loginListener(){
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
                    checkLogin(null, false);

                }).fail(function(jqXHR, textStatus, error){
                     console.log('error: ' + error);
                     myAlert('failed to login');
                });                   
            }
        }

        function registerListener(){
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

    function getTopics(){
        // $portfolioSection.find('.row').empty();
        $.get('/getTopics', function(data){
            for(var i=0; i<data.length; i++){
                addTopic(data[i]);
            }
        })
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
    checkLogin(null, false);
    console.log(1);
    getTopics();
})





