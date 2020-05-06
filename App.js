var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
//var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy   = require('passport-local');
var dotenv = require('dotenv');
var app = express();

dotenv.config();

//Get User Created
var User = require('./models/user.js');

// Connecting To Database
//mongoose.connect(process.env.DATABASEURL, {useUnifiedTopology: true,useNewUrlParser: true,});
mongoose.connect("mongodb+srv://devenmore:ranjanamore18@legalsquareamt-texmd.azure.mongodb.net/test?retryWrites=true&w=majority",{useUnifiedTopology: true,useNewUrlParser: true});

//console.log(process.env.DATABASEURL);

//PASSPORT Authentication
app.use(session({
	secret: "Shubham Sanjay Ranjana More is developer of this website",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set('view engine', 'ejs');
app.use('/stfiles',express.static('files'));
app.use('/stimg',express.static('img'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(function(req,res,next){
	res.locals.username=req.user;
	res.locals.errors =req.flash("errors");
	res.locals.success = req.flash("success");
	next();
});

//Past Events Setup
var pastEventSchema = new mongoose.Schema({
	name: String,
	date: String,
	place: String,
	photo: String,
	purpose: String,
	format: String,
	result: String,
	createdBy: String,
	createdDate: {type: Date,default: Date.now}
});
var addPastEvent= mongoose.model("addPastEvent",pastEventSchema);
/* addPastEvent.create({
	name:"Jagar Event",
	date:25/09/2020,
	place:"Amt",
	photo:"sample string",
	purpose:"This is Sample",
	format:"Temp",
	results:"temp rs",
	createdBy:"Shubham",
})  */

//CREATE EVENTS SETUP
var eventSchema = new mongoose.Schema({
	name: String,
	date: Date,
	place: String,
	photo: String,
	description: String,
	contact: String,
	createdBy: String,
	createdDate: {type: Date, default: Date.now}
});
 var addEvents = mongoose.model("addEvents",eventSchema);
 /* addEvents.create({
	 name:"Example",
	 date:25/09/2020,
	 place:"Amt",
	 photo:"sample string",
	 description:"This is Sample",
	 contact:"Temp"
 }) */

 //RESTFUL ROUTES FOR EVENTS
 // GET PastEvents Page
 app.get('/pastevents',function(req,res){ 
	 addPastEvent.find({},function(err,pastlist){
		 if(err){
			 res.redirect('back');
		 }
		 else{
			 res.render('pastevents',{pastlist:pastlist});
		 }
	 })
});
 //GET FULL PASTEVENT INFO
 app.get('/pastevents/:id',function(req,res){
	addPastEvent.findById(req.params.id,function(err,foundPastEvent){
		if(err){
			res.redirect('/pastevents');
		}
		else{
			res.render('pastshow',{foundPastEvent:foundPastEvent});
		}
	});
});

//Create PAST Event Logic

app.post('/pastevents',function(req,res){
	req.body.pastlist.createdBy=res.locals.username.username;
	addPastEvent.create(req.body.pastlist,function(err,newPastEvent){
		if(err){
			res.render('pastnew');
		}
		else{
			res.redirect('/pastevents');
		}
	});
});
app.get('/p/pastnew',isLoggedIn,function(req,res){
	req.flash('success','Welcome LegalSquare Admin..!!');
	res.render('pastnew');
 });


 //Upcoming Events Route
 app.get('/event',function(req,res){
	 addEvents.find({},function(err,eventsList){
		 if(err){
			 console.log(err);
			 //req.flash('errors','Nothing')
			 res.redirect('back');
		 } else{
			
			 res.render('upcoming',{eventsList:eventsList});
		 }
	 });
 });

 //Create New Event Logic

 app.post('/event',function(req,res){
	 req.body.eventsList.createdBy=res.locals.username.username;
	 addEvents.create(req.body.eventsList,function(err,newEvent){
		 if(err){
			 res.render('new');
		 }
		 else{
			 res.redirect('/event');
		 }
	 });
 });

 app.get('/event/new',isLoggedIn,function(req,res){
	req.flash('success','Welcome LegalSquare Admin..!!');
	res.render('new');
 });


 //SHOW EVENTS ROUTES
 app.get('/event/:id',function(req,res){
	 addEvents.findById(req.params.id,function(err,foundEvent){
		 if(err){
			 res.redirect('/event');
		 }
		 else{
			 res.render('show',{foundEvent:foundEvent});
		 }
	 });
 });


//ROUTES
app.get('/',function(req,res){
	res.render("index");
	//console.log(req.user);
});

app.post('/auth',function(req,response){
	response.send('<h1>Something Went Wrong Contact Developer...</h1>')
});

//AUTH Routes 

//Register Route
app.get('/register',function(req,res){
	res.render("register");
});

//Handle Register Logic
app.post('/register',isLoggedInfornew,function(req,res){

	//console.log(req.body.name + req.body.username +req.body.email +req.body.location );
	User.register(new User({
		name:req.body.name,
		username:req.body.username,
		email:req.body.email,
		mobile:req.body.mobile,
		location:req.body.location
	}),req.body.password,function(err,user){
		if(err){
			console.log(err);
			req.flash('errors',err.message);
			return res.redirect('register');
		}
			passport.authenticate('local')(req,res,function(){
			req.flash('success','Congrats!! Welcome to LegalSquare as volunteer! You will recieve confirmation message from admin when the event is scheduled!');
			res.redirect("/");
		});
	});
})

 //Login Routes
 app.get('/login',function(req,res){
	res.redirect('back');
 });
 //Login Logic
 app.post('/login',passport.authenticate("local",
 {
	 successRedirect:"back",
	 successFlash: 'Success Log In',
	 failureRedirect:"/register",
	 failureFlash: 'Failed Login!'
 }
 ),function(req,res){
 });

 //Logout Route Logic
 app.get('/logout',function(req,res){
	 req.logout();
	 req.flash('success','Successful Logged Out...!!!');
	 res.redirect('/');
 });

 // GET AboutUs Page
 app.get('/aboutus',function(req,res){
	 res.render('aboutus');
 });

 //GET Join US Page
 app.get('/join',function(req,res){
	 res.render('register');
 });

 //GET Contact Page
 app.use('/contact',function(req,res){
	 res.render('contact');
 });

 //GET Gallary Page
 app.use('/gallary',function(req,res){
	 res.render('gallary');
 });

 //GET Members Page
 app.get('/members',isLoggedIn,function(req,res){
	User.find({},function(err,userlist){
		if(err){
			res.render('back');
		}
		else{
			res.render('members',{userlist:userlist});
		}
	}
 )})

 //=========
 // Logic for Check Login

 function isLoggedIn(req,res,next){
	 if(req.isAuthenticated()){
		 var act= new String(req.user.acctype);
		 //console.log(act);
		if(act == 'Admin'){
			req.flash('success','Welcome LegalSquare Admin..!!');
			return next();
		}
	 }
	 req.flash('errors','You Need to Log In as Legal Square Administrator...!!');
	 res.redirect('/');
 }

 function isLoggedInfornew(req,res,next){
	if(req.isAuthenticated()){
		req.flash('errors','Already LoggedIn...!!');
		res.redirect('back');
	   }else{
		return next();
	   }
	}
	

 

app.listen(process.env.PORT,function(){
    console.log("Hello");
});

