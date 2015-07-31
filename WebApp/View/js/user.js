$(function(){

	_security.checkLogin(null, false);
	setupTabs();

	function setupTabs(){
		$('#myTabs a').click(function (e) {
		  e.preventDefault();
		  $(this).tab('show');
		})

		fakewaffle.responsiveTabs(['xs', 'sm']);
	}
})



