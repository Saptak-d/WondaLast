const express = require("express");
const router = express.Router();
const User =  require("../Models/user.js");
const WrapeAsync = require("../utils/wrapeAsync.js");
const passport = require("passport");

 



router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup", WrapeAsync(async(req,res)=>{
  try{
    let { username, email, password } = req.body;
 console.log("Received data:", req.body);
    const newUser = new User({email , username });
   const registerdUser = await  User.register(newUser,password);
   console.log(registerdUser);
   req.flash("success","Welcome to Wondalas ");
   res.redirect("/listing");
  }catch(e){
     req.flash("error",e.message);
     res.redirect("/signup");
  }
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
});

router.post("/login", 
  passport.authenticate("local",{failureRedirect:'/login',failureFlash: true}) ,
  async(req,res)=>{
    req.flash( "success","Welcome Back to Wondalast you are logged in")
    res.redirect("/listing");
})
router.get("/logout",(req,res ,next)=>{
   req.logout((err)=>{
      if(err){
       return next(err);
      }
     req.flash("success","You are Logged out now");
     res.redirect("/listing");

          

   })
})






module.exports =  router ;