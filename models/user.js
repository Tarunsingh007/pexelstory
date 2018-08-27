var mongoose=require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var schema=mongoose.Schema;

mongoose.connect('mongodb://localhost/nodeblog');

var User=new schema({
	   admin:   {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);
var User =module.exports=mongoose.model('User',User);