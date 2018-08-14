var express = require('express');
var router = express.Router();
var expressValidator=require('express-validator');
var db=require('../bin/monk-connect.js').db;
//------------------------------------------show all categories-------------------------------
router.get('/add', function(req, res, next) {
    res.render('categories.hbs',{
    	title:"Categories"
    });
});
//----------------------------------------show by categories----------------------------------
router.get('/show/:category',(req,res,next)=>{
	var db=req.db;
	var posts=db.get('posts');
	posts.find({categories:req.params.category},{},function(err,posts){
    res.render('index.hbs',{
    	posts,
    	title:req.params.category
    });
});
});
//----------------------------------------add categories------------------------------------------
router.post('/add',(req,res,next)=>{
	var data=req.body.data;

	req.check('data' ,'field is required').notEmpty();
	errors=req.validationErrors();
	if(errors)
	{
		res.render('categories.hbs',{
			errors,data
		});
	}
		else
		{
			var categories=db.get('categories');
			categories.insert({
				data
			},(err,posts)=>{
				if(err){
					res.send('there was an issue submitting posts');
				}
				else
				{
					req.flash('success','post submitted');
					res.location('/');
					res.redirect('/posts/add');
				}
			});
	}
});
module.exports = router;
