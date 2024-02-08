const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/Pinterest");

const userSchema = mongoose.Schema({
  username:{
    type:String,
    unique:true,
  },
  
  fullname:String,
  email:{
    type:String,
    unique:true},
  password:
  {type: String},
  posts:[{
    type : mongoose.Schema.Types.ObjectId,
    ref:'posts'
  }]
});

userSchema.plugin(plm);

module.exports =  mongoose.model("user",userSchema);