const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/Pinterest");

const userSchema = mongoose.Schema({
  username:String,
  fullname:String,
  email:String,
  password:String,
});

userSchema.plugin(plm);

module.exports =  mongoose.model("User",userSchema);