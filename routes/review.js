const express = require('express');
const router =express.Router({mergeParams:true});
//joi validator
const Joi = require('joi')
///error and catcher
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
//model
const Review = require('../models/review');
const Campground = require('../models/campground');

const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware')

//contorler
//controlers
const ReviewControler =require('../controllers/review');

// Post  review 
router.post('/',isLoggedIn,validateReview,catchAsync(ReviewControler.PostReview))


//delete review
router.delete('/:Rid',isLoggedIn,isReviewAuthor,catchAsync(ReviewControler.DeleteReview))

module.exports = router;