const User=require('../models/user');
const express=require('express');
const passport=require('passport');
const router=express.Router();
const catchAsync=require('../utilities/catchAsync');
const users=require('../controllers/users');


router.route('/register')
.get(users.renderRegister)
.post(catchAsync(users.register))

router.route('/login')
.get(users.renderLgin)
.post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.login) 


// router.get('/register',(users.renderRegister));
// router.post('/register',catchAsync(users.register));

// router.get('/login',users.renderLgin);
// router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.login) ;

router.get('/logout',users.logout);
module.exports=router;