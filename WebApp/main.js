var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var path = require("path");
var mongoose = require("mongoose");
var session = require('client-sessions');
var moment = require('moment');


//constants
var MAX_TOPIC_LOADED = 8;


app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/View"));
// app.use(express.static(__dirname + "/Script"));

app.use(session({
  cookieName: 'session',
  secret: 'pyq_website',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.get('/', function(req, res){
	// res.json({message:'Hello World'});
	res.sendFile(__dirname + '/View/index.html');

});

app.get('/getTopics', function(req, res){
    var query = Topic.find({}).limit(MAX_TOPIC_LOADED);
    query.exec(function(err, Topics){
        if (err) return;
        res.status(200).send(Topics);
    });
    
})

app.get('/checkLogin', function(req, res){
    var sessionUser = req.session.user;

    if(sessionUser){
        User.findOne({username: sessionUser.username}, function(err, user){
            if(user){
                res.status(200).send(user.username);
            }else{
                res.status(200).send();
            }
        });
    }else{
         res.status(200).send();
    }
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
                req.session.user = user;
                res.status(200).send(username);
                // console.log('valid user: ', user);
            }else{
                res.status(400).send("failed");
                // console.log('not existed');
            }
            
        }
    })
});

app.post('/logout', function(req, res){
    req.session.reset();
    res.status(200).send('');
});

app.post('/createTopic', function(req, res){
    var subject = req.body.subject;  // second parameter is default
    var content = req.body.content;
    var user = req.session.user;
    if (user && subject && content && subject.length > 0 && content.length > 0){
         createTopic(user.username, subject, content, function () {
             res.status(200).send('successfully created topic');
         });
    }else{
        res.status(400).send("error");
    }
});

app.listen(process.env.PORT || 7000);


//----------------------------------------------------------------------------

// -- database
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error!'));
db.once('open', function (callback) {
    //Do all the initialization here
   console.log('db connection success!');
   setUpModel();
});

//----------------------------------------------------------------------------

// define schema and domain of db
var userSchema;
var User;
var topicSchema;
var Topic;

function setUpModel(){
	userSchema = mongoose.Schema({
		username:　String,
		password: String,
		email: String
	});
	User = mongoose.model('User', userSchema);

    topicSchema = mongoose.Schema({
        createdBy: String,
        subject: String,
        content: String,
        createdTime: { type: Date, default: Date.now }
    });
    Topic = mongoose.model('Topic', topicSchema);
}

function createTopic(user, subject, content, successCallback){
    console.log("Topic: ", user, subject, content);


    var topic = new Topic({createdBy: user, subject: subject, content: content});
    topic.save(function (err, topic) {
        if(err){
            console.log('error saving topic')
        }
        else{
            console.log('success saving topic');
            if (typeof successCallback === 'function'){
                successCallback();
            }
        }
    });
}

function register(username, password, email, successCallback){
    var user = new User({username: username, password: password, email: email});
    user.save(function(err, user){
        if(err){
            console.log('error saving user')
        }
        else{
            console.log('success saving user');
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