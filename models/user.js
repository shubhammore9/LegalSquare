var mongoose = require('mongoose');
var passportLocalmongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email:String,
    mobile:Number,
    location:String,
    password: String,
    acctype: {type:String,default:"General"},
    timestamp:{type:String,default:Date.now}
});

userSchema.plugin(passportLocalmongoose);

module.exports = mongoose.model("user",userSchema);