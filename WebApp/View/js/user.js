$(function(){

	//setup 
	var username;
	var $dashboard = $("#dashboard");

	_security.checkLogin(function(data){
		username = data;
		console.log("username", username);
		if(username){
			setUpTopic();
			setupUI();
		}

	}, false);

	function setupUI(){
		$('#myTabs a').click(function (e) {
		  e.preventDefault()
		  $(this).tab('show')
		})

		fakewaffle.responsiveTabs(['xs', 'sm']);
	}

	function setUpTopic(){
		_topic.placeToAppend = $dashboard;
		_topic.getTopics();
	}


})

