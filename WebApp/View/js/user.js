$(function(){


	//setup 
	var username;
	var $topics = $("#topics");
	var $topicSearch = $("#topic-search");
	var $searchField = $("#search-field");

	_security.checkLogin(function(data){
		username = data;
		console.log("username", username);
		if(username){
			setUpTopic();
			setupUI();
			$topicSearch.click(searchListener);
		}

	}, false);

	function searchListener(){
		console.log($searchField.val());
		_topic.getTopics($searchField.val());
	}

	function setupUI(){
		$('#myTabs a').click(function (e) {
		  e.preventDefault()
		  $(this).tab('show')
		_security.checkLogin(null, false);
		setupTabs();
	})
	}

	function setupTabs(){
		$('#myTabs a').click(function (e) {
		  e.preventDefault();
		  $(this).tab('show');
		})

		fakewaffle.responsiveTabs(['xs', 'sm']);
	}

	function setUpTopic(){
		_topic.placeToAppend = $topics;
		_topic.getTopics();
	}

})



