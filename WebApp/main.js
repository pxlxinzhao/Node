var express = require('express');
var app = express();
var path = require("path");

// app.use(express.static(__dirname + "/View"));
// app.use(express.static(__dirname + "/Script"));

app.get('/', function(req, res){
	// res.json({message:'Hello World'});
	res.sendFile(__dirname + '/View/index.html');
});

app.get('/user', function(req, res){
	// res.json({message:'Hello World'});
	res.sendFile(__dirname + '/View/user.html');
});

app.listen(process.env.PORT || 7000);