const ExpressError = require('./utilities/ExpressError');
const {campgroundSchema,reviewSchema}=require('./schemas');
const Campground = require('./models/campground');
const Review=require('./models/review');
module.exports.isLoggedIn=(req,res,next)=>{
    // console.log('req.user...',req.user);
    //req.user  ,coming from session,thanks to passport
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        // console.dir(req);
        // console.log("===========================================================================")
        // console.log(req.path,req.originalUrl);
    req.flash('error','You must be signed in first!');
    return res.redirect('/login');
    }
    next();
} 

module.exports.validateCampground=(req,res,next)=>{
    const {error}=campgroundSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',');
        // console.dir(error);
        // console.log(msg);
        throw new ExpressError(msg,400)
    }else{next();}
}
//use in the campground routes
module.exports.isAuthor=async (req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){  //to check have the authorization
        req.flash('error','you do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//use in the review routes, check the current user own the review or not
module.exports.isReviewAuthor=async (req,res,next)=>{
    const {id,reviewID}=req.params;
    const review=await Review.findById(reviewID);
    if(!review.author.equals(req.user._id)){  //to check have the authorization
        req.flash('error','you do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//using in the review routes
module.exports.validateReview=(req,res,next)=>{ 
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',');
        console.dir(error);
        console.log(msg);
        throw new ExpressError(msg,400);
    }else{next()}
}
