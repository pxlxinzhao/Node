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
                // $('.modal-content').css('max-width', '300px');
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





