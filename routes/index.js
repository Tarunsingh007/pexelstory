var express = require('express');
var router  = express.Router();
var passport=require('passport');
var User=require('../models/user.js');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'BLOGAPP' });
});
router.get('/signup',(req, res, next)=> {
  res.render('signup');
});
router.get('/signin',(req, res, next)=> {
  res.render('signin');
});

router.get('/forget',(req, res, next)=> {
  res.render('forget');
});

router.get('/forgetpassword',(req, res, next)=>{
  User.findOne({email:'req.body.email'},(err,user)=>{
  	if(err)
  		return err;
  	else
  		res.redirect('/forget/reset');
  });
});

router.get('/forget/reset',(req,res,next)=>{
	res.render('reset');
});

router.put('/forget/reset', (req,res,next)=>{
   User.findOneAndUpdate(req.email,req.body,(err,blog)=>{
      if(err)
         return err;
      else
       res.redirect('/signin');
   });
});




router.post('/signup',(req,res,next)=>{
	var username=req.body.username;
	var password=req.body.password;
	var email=req.body.email;
	var newuser=new User({
 			username,
 			password,
 			email
 	});
	User.register(newuser,req.body.password,(err,user)=>{
			 			if(err)
			 				{res.redirect('/signup');}
			 			else
			 			{
				 			passport.authenticate("local")(req,res,()=>{
			         		req.flash("success" , "Welcome to the Yelpcamp " + user.username);
			          		console.log(user);
			          		res.redirect("/blogs");
			      			 });
 						}
				 	});
				 });
router.post("/signin",passport.authenticate("local",
{
    successRedirect:"/blogs",
    failureRedirect:"/signin"
}),(req,res)=>{
  
});
router.get("/signout",function(req, res) {
   req.logout();
   req.flash("success","logged out");
   res.redirect("/blogs");
});

module.exports = router;
