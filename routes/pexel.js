var express = require('express');
var router  = express.Router();
var passport=require('passport');
var Pexel=require('../models/pexel.js');
var middleware = require("../authentication/authenticatefile");

/* GET home page. */
router.get('/', (req, res, next)=>{
	Pexel.find({},(err,pexel)=>{
		if(err)
			return err;
		else
			res.render('pexel/index',{title:"All Stories",story:pexel,currentuser:req.user});
	})
});

router.get('/add',middleware.isLoggedIn, (req, res, next)=>{
  res.render('pexel/new', { title: 'Add Story',currentuser:req.user });
});

router.get('/:id',middleware.isLoggedIn,(req,res,next)=>{
   Pexel.findById(req.params.id,(err,pexel)=>{
      if(err)
         return err;
      else
      res.render('pexel/show',{story:pexel,currentuser:req.user});
   });
});

router.get('/:id/edit',middleware.authorizeStory,(req,res,next)=>{
   Pexel.findById(req.params.id,(err,pexel)=>{
      if(err)
         return err;
      else
      res.render('pexel/edit',{story:pexel,currentuser:req.user});
   });
});

router.put('/:id/edit',middleware.authorizeStory,(req,res,next)=>{
   Pexel.findByIdAndUpdate(req.params.id,req.body,(err,pexel)=>{
      if(err)
         return err;
      else
       res.redirect('/pexel/'+req.params.id);
   });
});

router.delete('/:id',middleware.authorizeStory,(req,res,next)=>{
   Pexel.findByIdAndRemove(req.params.id,req.body.pexel,(err)=>{
      if(err)
         return err;
      else
       res.redirect('/pexel');
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
   var newStory= new Pexel({
   	name,
   	price,
   	image,
   	description,
   	author
   });
   newStory.save();
   res.redirect('/pexel');
});


module.exports = router;
