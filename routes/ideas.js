const express = require('express');
const router =express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');
//Load idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// idea index page
router.get('/', ensureAuthenticated, (req,res)=>{
  Idea.find({user: req.user.id})
    .sort({date:'desc'})
     .then(ideas=>{
    res.render('ideas/index',{
      ideas:ideas
    });
  });
  });
  //Add idea form
  router.get('/add',ensureAuthenticated,(req,res)=>{
   res.render('ideas/add');
  });
  
  //Edit idea form
  router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    Idea.findOne({_id:req.params.id})
    .then(idea =>{
      if(idea.user!= req.user.id){
        req.flash('error_msg',"not allowed");
        res.redirect('/ideas');
      }else{
        res.render('ideas/edit',{
          idea :idea
        });
      }
    });
  });
  
  //Add process form
  router.post('/',ensureAuthenticated, (req,res)=>{
   let errors=[];
   if(!req.body.title){
     errors.push({text:'Please add a title'});
   }
   if(!req.body.details){
     errors.push({text:'Please add some details'});
   }
    if(errors.length > 0){
      res.render('ideas/add',{
        errors:errors,
        title:req.body.title,
        details:req.body.details
      });
    }else{
      const newIdea={
        title: req.body.title,
        user: req.user.id,
        details:req.body.details
      }
      new Idea(newIdea).save()
      .then(idea =>{
        res.redirect('/ideas');
      });
    }
  });
  
  //Edit form process
  router.put('/:id',ensureAuthenticated, (req,res)=>{
   Idea.findOne({_id:req.params.id})
   .then(idea=>{
     //new values
     idea.title = req.body.title;
     idea.details = req.body.details;
     idea.save()
         .then(idea =>{
           res.redirect('/ideas');
         });
   });
  });
  
  //delete
  router.delete('/delete/:id',(req,res)=>{
 
    Idea.deleteOne({_id:req.params.id})
  .then(()=>{
    req.flash('success_msg','video idea removed');
    res.redirect('/ideas');
  });
  });
  
  module.exports=router;