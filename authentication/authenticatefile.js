var blog = require("../models/blogs");
var Comment = require("../models/comments");
var authorization = {};

authorization.authorizeblog= function(req,res,next){
     if(req.isAuthenticated()){
           blog.findById(req.params.id,function(err,blog){
                if(err){
                    res.redirect("/blogs");
                } else{
                    if(blog.author.id.equals(req.user._id)){
                       next();    
                    }else{
                        req.flash("error" , "You don,t have permission to do that");
                        res.redirect("/blogs");
                    }
                }
            });
        }else{
            req.flash("error" , "you need to be Logged In");
            res.redirect("/");
        }
  };

authorization.isLoggedIn = function(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }
  req.flash("error", "You need to log in to do that");
  res.redirect("/signin");
};



module.exports= authorization;


