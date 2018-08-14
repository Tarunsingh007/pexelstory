 var express = require('express');
var router = express.Router();
var mongo=require('mongodb');
var expressValidator=require('express-validator');
var db=require('../bin/monk-connect.js').db;
//--------------------------------------show by id [Read More]-----------------------------------
router.get('/show/:id', function(req, res, next) {
	var db=req.db;
	var posts=db.get('posts');
	var id=req.params.id;
	posts.findOne(id,(err,posts)=>{
    res.render('show.hbs',{
    	posts
    });

	});
});
//------------------------------------------------add--------------------------------------
router.get('/add', function(req, res, next) {
	var categories=db.get('categories');
	categories.find({},{},function(err,categories){
    res.render('add.hbs',{
    	categories,
    	title:"Add Blog"
    });

	});
});

//---------------------------------comment posts---------------------------------------------

router.post('/addcomment',(req,res,next)=>{
	var name= req.body.name;
	var body= req.body.body;
	var email= req.body.email;
	var postid=req.body.postid;
	req.check('name','the field is required').notEmpty();
	req.check('email','the field is required').notEmpty();
	req.check('email','the field is required').isEmail();
	req.check('body','the field is required').notEmpty();
	var errors=req.validationErrors();
	if(errors)
	{
			var posts=db.get('posts');
			posts.findOne(postid,function(err,posts){
			     res.render('show.hbs', {
                "erors": errors,
                posts
            });
			});
       
	}
else
		{
			comments={name,email,body}
			var posts=db.get('posts');
			posts.update({
				"_id":postid
			},{
				$push:{
					comments
				}
			},(err,doc)=>{
				if(err){
					throw err;
				}
				else{
					req.flash('success','comment added');
					res.location('/posts/show/'+postid);
					res.redirect('/posts/show/'+postid);

				}

			});
	}
});



//--------------------------------------adding posts------------------------------------------

router.post('/add',(req,res,next)=>{
	var title=req.body.title;
	var categories=req.body.category;
	var body=req.body.body;
	var author=req.body.author;
	var moment=require('moment');
	var d=new Date();
	var date= moment(d).format("LLLL");

	if(req.files.mainimage){
		var mainImageName              =req.files.mainimage.name;
		// var mainImageOriginalName   =req.file.originalname;
		// var mainImagePath           =req.file.path;
		// var mainImageSize           =req.file.size;
		// var mainImageExt            =req.file.extension;
		// var mainImageMime           =req.file.miimetype;		
	}
	else{
		var mainImageName='noimage.jpg';	
	}
//-----------------------------------------validation of form-------------------------------------------------------------
	req.check('title','the field is required').notEmpty();
	req.check('body','body field id required').notEmpty();

	var errors=req.validationErrors();
	if(errors)
	{
		res.render('add.hbs',{
			"errors":errors,
			"title":title,
			"body":body
		});
	}
//----------------------------------------insert in to form----------------------------------------------------------------
		else
		{
			var posts=db.get('posts');
			posts.insert({
				title,
				body,
				categories,
				date,
				author,
				mainImageName
			},(err,posts)=>{
				if(err){
					res.send('there was an issue submitting posts');
				}
				else
				{
					req.flash('success','post submitted');
					res.location('/');
					res.redirect('/');
				}
			});
	
}
});

module.exports = router;
