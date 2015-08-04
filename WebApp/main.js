var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var path = require("path");
var mongoose = require("mongoose");
var session = require('client-sessions');
var moment = require('moment');
var ObjectId = require('mongoose').Types.ObjectId; 

// Constants
var MAX_TOPIC_LOADED = 12;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/View"));
// app.use(express.static(__dirname + "/Script"));

app.use(session({
  cookieName: 'session',
  secret: 'pyq_website',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));


// Navigation 
app.get('/', function(req, res){
	res.sendFile(__dirname + '/View/index.html');

});
app.get('/user', function(req, res){
    res.sendFile(__dirname + '/View/user.html');
});

// Webservices 
// no need for login session
app.post('/getTopics', function(req, res){
    var keyword = req.body.keyword;
    // console.log('keyword: ' + keyword);
    var query;
    if (keyword && keyword.length > 0){
        query= Topic.find({subject: new RegExp(keyword, 'i')}).limit(MAX_TOPIC_LOADED);
    }else{
        query= Topic.find({}).limit(MAX_TOPIC_LOADED);
    }
    
    query.exec(function(err, Topics){
        if (err) return;
        res.status(200).send(Topics);
    });
    
})

app.post('/getMyTopics', function(req, res){
    var keyword = req.body.keyword;
    // console.log('keyword: ' + keyword);
    console.log("getMyTopics");
    var query;
    if (keyword && keyword.length > 0){
        query= Topic.find({createdBy: req.session.user, subject: new RegExp(keyword, 'i')}).limit(MAX_TOPIC_LOADED);
    }else{
        query= Topic.find({createdBy: req.session.user}).limit(MAX_TOPIC_LOADED);
    }
    
    query.exec(function(err, Topics){
        if (err) return;
        res.status(200).send(Topics);
    });
    
})

app.post('/updateTopics', function(req, res){
    var _id = req.body._id;
    var action = req.body.action;
    // console.log(_id);
    switch(action){
        case 'like':
            Topic.findOne({_id: new ObjectId(_id)}, function(err, data){
            // Topic.findOne({subject: 'topic1'}, function(err, data){
                if (!data) {
                    res.status(400).send();
                    return;
                }
                if (!data.like) data.like = 1;
                else data.like += 1;
                console.log("data.like: " + data.like);
                data.save();
                res.status(200).send();
            });
            break;
        case'retweet':
            break;
        case 'comment':
            break;
    }

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

//need for login session
app.post('/createTopic', function(req, res){
    checkLogin(req, res, function(){
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
    })
});

app.post('/sendMessage', function(req, res){
    checkLogin(req, res, function(){
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
    })
});

app.post('/comment', function(req, res){
    var sender = req.session.user;
    var receiver = req.body.receiver;
    var content 
    createdTime: { type: Date, default: Date.now },
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
var messageSchema;
var Message;
var commentSchema;
var Comment;

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
        createdTime: { type: Date, default: Date.now },
        like: {type: Number, default: 0},
        retweet: {type: Number, default: 0},
        comment: {type: Number, default: 0}
    });
    Topic = mongoose.model('Topic', topicSchema);

    messageSchema = mongoose.Schema({
        senderId: String,
        receiverId: String,
        content: String,
        createdTime: { type: Date, default: Date.now },
        viewed: { type: Boolean, default: false}
    });
    Message = mongoose.model('Message', messageSchema);

    commentSchema = mongoose.schema({
        topicId: String,
        commenterId: String,
        content: String,
        createdTime: { type: Date, default: Date.now },
        agree: {type: Number, default: 0},
        disagree:  {type: Number, default: 0}
    });
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

function checkLogin(req, res, callback){
    if (req.session.user){
        if (callback && typeof callback === "function") callback();
    }else{
        res.status(400).send("Need login first");
    }
}