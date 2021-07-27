var pexel = require("../models/pexel");
var Comment = require("../models/comments");
var authorization = {};

authorization.authorizeStory= function(req,res,next){
     if(req.isAuthenticated()){
           pexel.findById(req.params.id,function(err,pexel){
                if(err){
                    res.redirect("/blogs");
                } else{
                    if(pexel.author.id.equals(req.user._id)){
                       next();    
                    }else{
                        req.flash("error" , "You don,t have permission to do that");
                        res.redirect("/pexel");
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


