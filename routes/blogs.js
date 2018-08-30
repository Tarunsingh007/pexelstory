var express = require('express');
var router  = express.Router();
var passport=require('passport');
var Blog=require('../models/blogs.js');
var middleware = require("../authentication/authenticatefile");
/* GET home page. */
router.get('/', (req, res, next)=>{
	Blog.find({},(err,blogs)=>{
		if(err)
			return err;
		else
			res.render('blogs/index',{title:"All Blogs",blog:blogs,currentuser:req.user});
	})
});

router.get('/add',middleware.isLoggedIn, (req, res, next)=>{
  res.render('blogs/new', { title: 'Add Blog',currentuser:req.user });
});

router.get('/:id',middleware.isLoggedIn,(req,res,next)=>{
   Blog.findById(req.params.id,(err,blog)=>{
      if(err)
         return err;
      else
      res.render('blogs/show',{blog:blog,currentuser:req.user});
   });
});

router.get('/:id/edit',middleware.authorizeblog,(req,res,next)=>{
   Blog.findById(req.params.id,(err,blog)=>{
      if(err)
         return err;
      else
      res.render('blogs/edit',{blog:blog,currentuser:req.user});
   });
});

router.put('/:id/edit',middleware.authorizeblog,(req,res,next)=>{
   Blog.findByIdAndUpdate(req.params.id,req.body,(err,blog)=>{
      if(err)
         return err;
      else
       res.redirect('/blogs/'+req.params.id);
   });
});

router.delete('/:id',middleware.authorizeblog,(req,res,next)=>{
   Blog.findByIdAndRemove(req.params.id,req.body.blog,(err)=>{
      if(err)
         return err;
      else
       res.redirect('/blogs');
   });
});

router.post('/',middleware.isLoggedIn,(req, res, next)=>{
   var name=req.body.name;
   var price=req.body.price;
   var image=req.body.image;
   var description=req.body.description;
   var author={
   	id:req.user._id,
   	username:req.user.username
   };
   var newblog= new Blog({
   	name,
   	price,
   	image,
   	description,
   	author
   });
   newblog.save();
   res.redirect('/blogs');
});


module.exports = router;
