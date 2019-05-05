const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport =require('passport');
const router =express.Router();

//Load idea model
require('../models/User');
const User = mongoose.model('users');

//User login  Route
router.get('/login',(req,res)=>{
  res.render('users/login');
});

//User register route
router.get('/register',(req,res)=>{
  res.render('users/register');
});
//logout route
router.get('/logout',(req,res)=>{
 req.logOut();
 req.flash('success_msg','you are logout');
 res.redirect('/users/login');
});
//login form post
router.post('/login',(req,res,next)=>{
passport.authenticate('local', {
  successRedirect:'/ideas',
  failureRedirect:'/users/login',
  failureFlash:true
})(req,res,next);
});
//Register
router.post('/register',(req,res)=>{
 let errors =[];

 if(req.body.password != req.body.password2){
   errors.push({text:'password do not match'});
 }

 if(req.body.password.length < 4){
  errors.push({text:'password must be at least 4 characters'})
 }
 if(errors.length >0)
 {
   res.render('users/register',{
     errors:errors,
     name:req.body.name,
     email:req.body.email,
     password:req.body.password,
     password2:req.body.password2
   });
 }else{
   User.findOne({email: req.body.email})
   .then(user=>{
    if(user){
     req.flash('error_msg','Email already register');
     res.redirect('/users/register');
    }else{
      const newuser ={
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      }
      bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newuser.password,salt,(err,hash)=>{
          if(err) throw err;
          newuser.password= hash;
          new User(newuser).save()
                 .then(user =>{
                   req.flash('success_msg','you are now registered and can login');
                   res.redirect('/users/login');
                 })
                 .catch(err=>{
                   console.log(err);
                   return;
                 });
        });
      });
    }
   });
 }
});
module.exports=router;