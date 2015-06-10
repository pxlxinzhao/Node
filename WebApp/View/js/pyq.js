$(function(){
	// login
	var loginMessage = 
						'<form class="modal-input">' +
							'<input style="margin-bottom: 10px;" class="modal-input" type="text" name="username" placeholder="用户名／邮箱" />' +
							'<input class="modal-input" type="password" name="password" placeholder="密码" />' +
						'</form>';

	$("#loginBtn").click(function(){

		 BootstrapDialog.show({
            title: '请输入用户名和密码',
            onshow: function(dialog) {
                dialog.setSize(BootstrapDialog.SIZE_SMALL);
            },
            message: loginMessage,
            buttons: [{
                label: '登录',
                action: function(dialog) {
                    dialog.setMessage(loginMessage);

                }
            },{
                label: '注册',
                action: function(dialog) {
                    dialog.setMessage('注册');
                    
                }
            }]
        });

		 // $('.modal-content .modal-header').hide();

	});
})





