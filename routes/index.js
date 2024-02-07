var express = require('express');
var router = express.Router();
const userModel = require('./users');
const passport = require('passport');

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sign In ' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'LogIn ' });
});

router.get('/profile', isLoggedIn,function(req,res,next){
  res.render('profile',{title:'Profile'});
})
router.get('/feed', isLoggedIn,function(req,res,next){
  res.send('feed');
})

router.post('/register', function(req,res){
  const userData = new userModel({
    username:req.body.username,
    fullname:req.body.fullname,
    email:req.body.email,
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
  failureRedirect:"/"
}),function(req,res){
  console.log("Hello");
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
