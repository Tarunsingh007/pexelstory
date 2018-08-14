var express = require('express');
var router = express.Router();

var db=require('../bin/monk-connect.js').db;

/* GET home page. */
router.get('/', function(req, res, next) {
  var db=req.db;
  var posts=db.get('posts');
  posts.find({},{},(err,posts)=>{
  	res.render('index.hbs',{
  		posts,
  		title:"Blogging App"
  	});
  });

});

module.exports = router;
