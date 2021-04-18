const Campground = require('../models/campground')
const Review = require('../models/review')


module.exports.PostReview=async(req,res)=>{
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author= req.user._id;
    camp.reviews.push(review);
    await camp.save();
    await review.save();
    req.flash('success','SucessFully Posted revike') //before reDirect
    res.redirect(`/campground/${camp._id}`)
}

module.exports.DeleteReview=async(req,res)=>{
    const {id,Rid} =req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:Rid}})
    await Review.findByIdAndDelete(Rid);
    req.flash('success','SucessFully Deleted Review') //before reDirect
    res.redirect(`/campground/${id}`);
}