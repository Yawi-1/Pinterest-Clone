var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const passport = require('passport');
const upload = require('./multer');

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sign In ' });
});
router.get('/login', function(req, res, next) {
  console.log(req.flash('error'));
  res.render('login', { error: req.flash('error')});
});

router.get('/profile', isLoggedIn,async function(req,res,next){
  const user = await userModel.findOne({
    username: req.session.passport.user
  }).populate("posts");
  res.render('profile',{title:'Profile',user});
});

router.post('/upload',isLoggedIn, upload.single('file') ,async function(req,res,next){
   if(!req.file){
    return res.status(404).send("No Files were found");
   }
   const user = await userModel.findOne({
     username: req.session.passport.user,
   });
  const postData =  await postModel.create({
    image:req.file.filename,
    posttext:req.body.filecaption,
    user:user._id
   });
    user.posts.push(postData._id);
    await user.save();
   res.redirect('/profile');
});

router.get('/feed', isLoggedIn, async function(req,res,next){
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  res.render('feed',{user});
})

router.post('/register', function(req,res){
  const {username,fullname,email} = req.body;
  const userData = new userModel({
    username,fullname,email
  });
  userModel.register(userData,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/profile')
    })
  });
});

router.post('/login', passport.authenticate("local",{
  successRedirect:'/profile',
  failureRedirect:"/logout",
  failureFlash:true
}),function(req,res){
  });

router.get("/logout", function(req,res){
  req.logout(function(err){
    if(err) {return next(err);}
    res.redirect('/login');
  })
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect('/'); //else
}

module.exports = router;
