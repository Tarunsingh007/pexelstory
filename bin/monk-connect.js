var mongo=require('mongodb');
var monk=require('monk');
var db=monk('localhost/nodeblog');
module.exports={db};