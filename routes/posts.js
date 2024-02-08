const mongoose = require('mongoose');

 const postSchema = mongoose.Schema({
    posttext:{
        type:String,
    },
    image:{
        type:String,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    createdAt : {
        type:Date,
        default:Date.now,
    },
    likes:{
        type:Array,
        default:[]
    }
 });

 module.exports  = mongoose.model('posts',postSchema);