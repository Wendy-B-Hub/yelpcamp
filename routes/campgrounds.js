const express=require('express');
const router=express.Router(); 
const catchAsync=require('../utilities/catchAsync');
const Campground = require('../models/campground');
const {isLoggedIn,validateCampground,isAuthor}=require('../middleware');
const campgrounds=require('../controllers/campgrounds');
const multer  = require('multer');
const {storage} =require('../cloudianry');  // it would automatically look for index file
// const upload = multer({ dest: 'uploads/' }) //this will store things locally

const upload = multer({storage}) //store things in the storage file we made previous


router.route('/')
.get(catchAsync (campgrounds.index))
.post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground))
// <image> this name should be field of new Page,exactly the same.  image in the form data
// .post(upload.array('image'),(req,res)=>{
//     console.log(req.body,req.files);
//     res.send('it worked!');
// })

router.get('/new',isLoggedIn,(campgrounds.renderNewForm));

router.route('/:id')
.get(catchAsync(campgrounds.showCampground)) 
.put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))
.delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))


router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));



// //----------------------------------------------------------
// //建立campgournds的 Index page，把所有的campgrounds列出来，render index.ejs
// router.get('/',catchAsync (campgrounds.index));

// //----------------------------------------------------------
// //建立camgrounds的 NEW page,just need a form to submit
 
// router.get('/new',isLoggedIn,(campgrounds.renderNewForm));

// router.post('/',isLoggedIn,validateCampground,catchAsync(campgrounds.createCampground))

// // mine
// /* app.post('/campgrounds',catchAsync(async (req,res,next)=>{
//     const camp=new Campground(req.body.campground);
//     await camp.save();
//     res.redirect(`/campgrounds/${camp._id}`);
// })) */
// //----------------------------------------------------------
// //展示camgrounds的 SHOW page, according ID to show
// router.get('/:id',catchAsync(campgrounds.showCampground)) 

// //----------------------------------------------------------
// //编辑camgrounds的 EDIT page, according ID to edit
// router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm))

// router.put('/:id',isLoggedIn,isAuthor,catchAsync(campgrounds.updateCampground))

// //----------------------------------------------------------
// //删除camgrounds的 DELETE page
// router.delete('/:id',isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))

module.exports=router;