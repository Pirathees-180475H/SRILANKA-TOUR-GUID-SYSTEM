const {ValcampgroundSchema,ValReviewSchema} = require('./ValSchemas');
const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');



module.exports.isLoggedIn =(req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectURL = req.originalUrl;
        req.flash('error','please Log in');
       return  res.redirect('/login')
    }
    next()
}


//validating MiddleWare
module.exports.validateCamp =(req,res,next) =>{
    // server side validation for empty add post request (prevent from post man requests)
     //validate and take only error else next to the renderinf/creation function
        const {error} =ValcampgroundSchema.validate(req.body);
    
        if(error){
            const msg = error.details.map(e=>e.message).join(',');
            throw new ExpressError(400, msg)
        }else{
            next()
        }
    }
//isAuthor middleware prevent Edit from API's
module.exports.isAuthor =async(req,res,next)=>{
    const {id} = req.params;
    const campground= await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
       req.flash('error',"You Not Have  Permission!!");
      return  res.redirect(`/campground/${id}`)
    }
    next()

}

//isAuthor middleware prevent Edit from API's
module.exports.isReviewAuthor =async(req,res,next)=>{
    const {id,Rid} = req.params;
    const review= await Review.findById(Rid)
    if(!review.author.equals(req.user._id)){
       req.flash('error',"You Not Have  Permission!! to dlt review");
      return  res.redirect(`/campground/${id}`)
    }
    next()

}



//validating MiddleWare
module.exports.validateReview =(req,res,next) =>{
    const {error} =ValReviewSchema.validate(req.body);

    if(error){
        const msg = error.details.map(e=>e.message).join(',');
        throw new ExpressError(400, msg)
    }else{
        next()
    }
}


