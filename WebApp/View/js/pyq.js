$(function(){

    var url = window.location.origin;
	// login
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

    //login prompt
	$("#loginBtn").click(function(){

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
                        var form = $("#loginForm").serializeArray();
                        console.log(form);
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
                        var formData = $("#registerForm").serialize();
                        console.log(formData);
                        $.post( url + '/register', formData).done(function(data){
                            console.log('success: ' + data);
                        }).fail(function(jqXHR, textStatus, error){
                             console.log('error: ' + error);
                        });
                        
                    }
                }
            }]
        });

		 // $('.modal-content .modal-header').hide();

	});

    //add topic
    var $addTopic = $('#createTopicBtn');
    var $portfolioSection = $('#portfolio');

    $addTopic.click(function(event){
        event.preventDefault();
        addTopic();
    });

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

})


// global lib
function randHex() {
            return (Math.floor(Math.random() * 56) + 200).toString(16);
        }

function randColor() {
    return "#" + randHex() + "" + randHex() + "" + randHex();
}





