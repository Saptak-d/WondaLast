const express = require("express");
const router = express.Router();
const User =  require("../Models/user.js");
const WrapeAsync = require("../utils/wrapeAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js")

router.get("/", (req, res) => {
   res.redirect("/listing")
});

router
.route("/signup")
.get(userController.renderSignUpFrom)
.post(WrapeAsync(userController.signup));

router
.route("/login")
.get(userController.renderloggenForm)
.post(saveRedirectUrl, 
  passport.authenticate("local",{failureRedirect:'/login',failureFlash: true}) ,
   userController.logInForm
  );
  
router.get("/logout",userController.logOut)

module.exports =  router ;