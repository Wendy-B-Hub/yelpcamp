/* module.exports=function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(e=>next(e))
    }
} */

module.exports=func=>{
    return (req,res,next)=>{
        func(req,res,next).catch(next); 
    }
}

//const catchAsync=require('../utilities/catchAsync');
/*
catchAsync ((req,res)=>{
    const campgrounds=Campground.find({});
    res.render('campgrounds/index',{campgrounds});
})

*/























