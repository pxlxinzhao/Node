$(function(){
    
    var $addTopic = $('#createTopicBtn');
    var $portfolioSection = $('#portfolio');

	// long string
    var topicMessage = 
                       '<form id="topicForm" class="modal-input">' +
                            '<input style="margin-bottom: 10px;" class="modal-input" type="text" name="subject" placeholder="主题" />' +
                            '<textarea form="topicForm" class="modal-input" placeholder="内容" style="min-height: 200px;" name="content"></textarea>'
                        '</form>';


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

    function createTopicForm(){

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

    function getTopics(){
        // $portfolioSection.find('.row').empty();
        $.get('/getTopics', function(data){
            for(var i=0; i<data.length; i++){
                addTopic(data[i]);
            }
        })
    }

    //listeners
    

    $addTopic.click(function(event){
        event.preventDefault();
        createTopicForm();
    });

    //Initialization
    getTopics();
})





