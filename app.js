var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var pexelRouter = require('./routes/pexel');
var flash=require('connect-flash');
var passport=require('passport');
var session=require('express-session');
var LocalStrategy = require("passport-local")
var User=require('./models/user.js');
var mongoose=require('mongoose');
var hbs=require('hbs');
methodOverride= require("method-override");

// mongoose.connect('mongodb://admin:admin123@ds111622.mlab.com:11622/blogdb');
mongoose.connect("mongodb+srv://Admin:password121@cluster0.cnxzq.mongodb.net/pexelstory?retryWrites=true&w=majority",(err)=>{
	if(err)
		console.log(err);
	else
		console.log("connected to database");
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));
//-------------------------------------------------------MAIN----------------------------------------
app.use(session({
    secret:"0123456789",
    resave:false,
    saveUninitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
   res.locals.currentUser=req.user;
   res.locals.error=req.flash("error");
   res.locals.success=req.flash("success");
   next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//-----------------------------------------------------MAIN----------------------------------------------

app.use('/', indexRouter);
app.use('/pexel', pexelRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
