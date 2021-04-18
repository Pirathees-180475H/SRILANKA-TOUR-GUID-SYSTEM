const express = require('express');
const router =express.Router();
//joi validator
const Joi = require('joi')
const {ValcampgroundSchema} = require('../ValSchemas');
///error and catcher
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
//model
const Campground = require('../models/campground');

//isLogged in middleware
const {isLoggedIn,validateCamp,isAuthor} =require('../middleware')

//controlers
const CampControler =require('../controllers/campgrounds');


//Multer For Imag/file Upload to cloudinary
const multer  = require('multer')
const {storage}= require('../cloudinary')
const  upload = multer({ storage}) //where to upload

      //indexRoute AllCamps
router.get('/',CampControler.index)
  
      //add 1.render Form 2.PostHandler
router.get('/new',isLoggedIn,CampControler.NewForm)
  
router.post('/',isLoggedIn,upload.array('image'),validateCamp,catchAsync(CampControler.CreateNewCamp))
//router.post('/',upload.array('image'),(req,res)=>{console.log(req.file);res.send('It works')})       //   File Uploda Using Multer.update
  
      //show Specific Camp
router.get('/:id',catchAsync(CampControler.ShowSpecificCamp))
  
  
          //Edit

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(CampControler.RenderEditForm))

router.patch('/:id',isLoggedIn,isAuthor,upload.array('image'),validateCamp,catchAsync(CampControler.EditCamp))
  
  
          //Delete
router.delete('/:id',isLoggedIn,catchAsync(CampControler.DeleteCamp))
  

module.exports =router;

