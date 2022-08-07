const Campground = require('../models/campground');
const {cloudinary}=require("../cloudianry");

const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken:mapBoxToken});

module.exports.index=async (req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}

module.exports.renderNewForm=(req,res)=>{
    res.render('campgrounds/new');
}

module.exports.createCampground=async (req, res, next) => {
    const geoData= await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit:1,
    }).send()
    // console.log(geoData.body.features[0].geometry);
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.geometry=geoData.body.features[0].geometry;
    campground.images=req.files.map(f=>({url:f.path,filename:f.filename}));
    campground.author=req.user._id;  //req.user is made by passpord;
    // console.log(req.user);
    await campground.save();
    // console.log(campground);
    req.flash('success','Successfully made a new campground !')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground=async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id).populate(
        {path:'reviews',
        populate:{path:'author',
    }}).populate('author');
    // console.log(camp);
    if(!camp){
        req.flash('error','cannot find that campground');
        return res.redirect('/campgrounds');
    }
    // console.log(camp);
    res.render('campgrounds/show',{camp});
}

module.exports.renderEditForm=async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    res.render('campgrounds/edit',{camp});
}

module.exports.updateCampground=async (req,res)=>{
    const {id}=req.params;
    console.log(req.body);
    // console.log(req.body.campground.price);
    const camp=await Campground.findByIdAndUpdate(id,{...req.body.campground},{runValidators:true,new:true});
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}));
    camp.images.push(...imgs);
    await camp.save();
    
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await camp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}},{ new: true });
        console.log(camp);
    }
    req.flash('success','you just updated successfully')
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.deleteCampground=async (req,res)=>{
    const {id}=req.params;
    // const camp=await Campground.findById(id);
    await Campground.findByIdAndDelete(id);
    // req.flash('success',`Successfully deleted ${camp.title} campground!`);
    res.redirect('/campgrounds');
}