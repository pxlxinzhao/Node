$(function(){

	_security.checkLogin(null, false);

	$('#myTabs a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	})

	fakewaffle.responsiveTabs(['xs', 'sm']);

})

