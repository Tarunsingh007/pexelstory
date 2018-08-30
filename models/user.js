var mongoose=require('mongoose');
var schema=require('mongoose').Schema;

var passportLocalMongoose= require("passport-local-mongoose");

var UserSchema=new schema({
	username:{
		type:String
	},
	email:{
		type:String
	}
});
UserSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model('User',UserSchema);