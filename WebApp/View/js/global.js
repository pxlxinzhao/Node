// golobal variables
var url = window.location.origin;

// jquery selector
var $loginBtn = $("#loginBtn");
var $mainNav = $("#main_nav");
var $logoutBtn;

// global instance
var _security = new Security();
var _topic = new Topic();

// global string 
var TIME_FORMAT = 'MM/DD/YYYY hh:mm';

// global objects
function Security(){

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

    

    this.logout = function(){
        $.post(url + '/logout', null, function(){
            window.location.reload();
            // $logoutBtn.hide();
            // $loginBtn.show();
            // $mainNav.children().not("#loginli").remove();
        });
    }

    this.checkLogin = function(callback, showAlert){
         $.get(url + '/checkLogin', function(data){
            if (data){
                var loggedInNavBarMessage = 
                                '<li><a href="#">HTML</a></li>' +
                                '<li><a href="#">CSS</a></li>' +
                                '<li><a class="song" href="/user">我的主页</a></li>' +
                                '<li><a class="song" id="logoutBtn">登出</a></li>';
                $mainNav.children().not("#loginli").remove()
                $mainNav.append(loggedInNavBarMessage);
                $logoutBtn = $("#logoutBtn");
                $logoutBtn.click(_security.logout);
                $loginBtn.hide();
                $logoutBtn.show();
                if (callback && typeof callback === "function") callback(data);
            }else{
                if (showAlert !== false) myAlert("Please login first");
                // $logoutBtn.hide();
            }
        });
    }

    this.createLoginRegisterForm = function(){
         BootstrapDialog.show({
            title: '用户登录',
            onshow: function(dialog) {
                dialog.setSize(BootstrapDialog.SIZE_SMALL);
                dialog.state = "login";
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
                    window.location.reload();
                    // _security.checkLogin(null, false);

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
}
function Topic(){
        var self = this;
        var topicMessage = 
                       '<form id="topicForm" class="modal-input">' +
                            '<input style="margin-bottom: 10px;" class="modal-input" type="text" name="subject" placeholder="主题" />' +
                            '<textarea form="topicForm" class="modal-input" placeholder="内容" style="min-height: 200px;" name="content"></textarea>'
                        '</form>';

        function addTopic(obj){
            var boxHtml = 
                        '<div class="topicBox col-lg-4 col-sm-6" style="background-color: '+ 
                                randColor() + '" id="'+ obj._id +'">' + 
                            '<h2 style="margin: 0px;">' + obj.subject + '</h2>' + 
                            '<p style="margin: 0px;">' + obj.content + '</p>' +
                            '<div style="margin: 0px;" class="right"><p style="margin: 0px;">' + obj.createdBy + '</p>' +
                            '<p style="margin: 0px;">' + moment(obj.createdTime).format(TIME_FORMAT); + '</p></div>' +
                        '</div>';
            var $box = $(boxHtml);

            if (self.placeToAppend){
                console.log("add Topic");
                var $row = self.placeToAppend.find('.row');
                $row.append($box);
                $box.click(function(){
                inspectTopic(obj);
            });
            }

            
        }

        function inspectTopic(obj){

            var streamItemHtml = 
            '<div class="stream-item-header">'
                    + '<a class="" href="#">'
                    +   '<strong>' + obj.createdBy + '</strong>'
                    +  '</a>'
                    +'<small class="time">'
                    +  moment(obj.createdTime).format('MMM DD')
                    +'</small>'
            +'</div>'

            console.log(obj);

            BootstrapDialog.show({
                    title: obj.subject + '<a class="small-padding-left" href="#">'
                            +  '<strong>' + obj.createdBy + '</strong>'
                            +  '</a>'
                            +'<small class="small-padding-left">'
                            +  moment(obj.createdTime).format('MMM DD')
                            +'</small>' ,
                    size: BootstrapDialog.SIZE_NORMAL,
                    message: obj.content,
                    buttons: [{
                        label: '赞一个',
                        action:  null
                    },{
                        label: '取消',
                        action: function(dialog) {
                            dialog.close();
                        }
                    }]
                });
        }

        this.createTopicForm = function(){

            //check login
            _security.checkLogin(showTopicForm);

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

        this.getTopics = function(){
            $.get('/getTopics', function(data){
                for(var i=0; i<data.length; i++){
                    addTopic(data[i]);
                }
            })
        }
}

// security setup
_security.checkLogin(null, false);
$loginBtn.click(_security.createLoginRegisterForm);

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
function checkEmptyForm(form){
    var formArray = form.serializeArray();
    for (var i=0; i<formArray.length; i++){
        if (!formArray[i] || formArray[i].value.length < 1){
            myAlert('Please fill all fields');
            return;
        }
    }
}
