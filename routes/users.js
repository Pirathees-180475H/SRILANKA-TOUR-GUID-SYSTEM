const express =require('express');
const router =express.Router();
const catchAsync = require('../utils/catchAsync');
const passport =require('passport')
const User = require('../models/user');


//register
router.get('/register',(req,res)=>{
    res.render('users/register')
})

router.post('/register',catchAsync(async(req,res,next)=>{
    try{
        const {email,username,password,role} =req.body;
        const user =  new User({email,role,username});
        const registeredUser = await User.register(user,password);

        req.login(registeredUser,err =>{
            if(err) return next(err);
            req.flash('success','WelCome');
            res.redirect('/campground')       // reigistered user  promoted to login state
        })    
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register')
    }   
}))


//logini
router.get('/login',(req,res)=>{
    res.render('users/login')
})

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    const redirectTO = req.session.redirectURL || '/campground' // remembering page before ,need login redirect
    delete req.session.redirectURL
    req.flash('success','Loged IN')
   res.redirect(redirectTO)
})

//logOut
router.get('/logout',(req,res)=>{
    req.logOut();
    req.flash('success','succes Full logOut')
    res.redirect('/campground')
})

module.exports = router;