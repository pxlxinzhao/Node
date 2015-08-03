$(function(){

<<<<<<< HEAD
	//setup 
	var username;
	var $topics = $("#topics");

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
=======
	_security.checkLogin(null, false);
	setupTabs();

	function setupTabs(){
		$('#myTabs a').click(function (e) {
		  e.preventDefault();
		  $(this).tab('show');
>>>>>>> origin/refactor1
		})

		fakewaffle.responsiveTabs(['xs', 'sm']);
	}
<<<<<<< HEAD

	function setUpTopic(){
		_topic.placeToAppend = $topics;
		_topic.getTopics();
	}


})
=======
})


>>>>>>> origin/refactor1

