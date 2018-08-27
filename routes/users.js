var express = require('express');
var router = express.Router();
var User=require('../models/user.js');
var passport=require('passport');
var authenticate = require('../authenticate');
/* GET home page. */
router.get('/', function(req, res, next) {
 res.render('login.hbs');
});

//-------------------------------------signup-----------------------------------------
router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}),req.body.password,(err,user)=>{
    if(err)
     { return err;
           res.redirect('/');}
    else
    {
      passport.authenticate('local')(req,res,()=>{
          console.log(user);
          res.redirect('/');
      });
    }
    });
});


router.post('/login', passport.authenticate('local'), (req, res) => {

  var token = authenticate.getToken({_id: req.user._id});
  res.redirect('/blog/showall');
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;