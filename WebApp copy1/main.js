var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var path = require("path");
var mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/View"));
// app.use(express.static(__dirname + "/Script"));

app.get('/', function(req, res){
	// res.json({message:'Hello World'});
	res.sendFile(__dirname + '/View/index.html');
});

app.get('/user', function(req, res){
	// res.json({message:'Hello World'});
	res.sendFile(__dirname + '/View/user.html');
	// res.sendFile('user.html');
});

app.post('/register', function(req, res){
    var email = req.body.email;  // second parameter is default
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    if (password === password2){
    	 register(username, password, email, function(){
    	 	res.status(200).send('successfully registered');
    	 });
    }else{
    	res.status(400).send("passwords don't match");
    }
});

app.post('/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    if (username.length < 1 || password.length < 1){
        console.log('failed login attempt');
        return;
    }
    checkUser(username, password, function(err, user){
        if (err) {
            res.status(400).send("failed");
        }
        else {
            if (user){
                res.status(200).send('successfully login');
                console.log('valid user: ', user);
            }else{
                res.status(400).send("failed");
                console.log('not existed');
            }
            
        }
    })
});

app.listen(process.env.PORT || 7000);

// -- database
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error!'));
db.once('open', function (callback) {
   console.log('db connection success!');
   setUpModel();
});

var userSchema;
var User;

function setUpModel(){
	userSchema = mongoose.Schema({
		username:　String,
		password: String,
		email: String
	})
	User = mongoose.model('User', userSchema);
}

//register user
function register(username, password, email, successCallback){
    var user = new User({username: username, password: password, email: email});
    user.save(function(err, user){
        if(err){
            console.log('error saving')
        }
        else{
            console.log('success saving');
            if (typeof successCallback === 'function'){
            	successCallback();
            }
        }
   });
}

function checkUser(username, password, callback){
    if (!callback || typeof callback !== 'function') return;
    User.findOne({
        username: username,
        password: password
    },'username password', callback);
}