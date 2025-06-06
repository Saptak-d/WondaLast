const User =  require("../Models/user.js");

module.exports.renderSignUpFrom = (req,res)=>{
    res.render("users/signup.ejs")
};


module.exports.signup = async(req,res,next)=>{
  try{
    let { username, email, password } = req.body;
 console.log("Received data:", req.body);
    const newUser = new User({email , username });
   const registerdUser = await  User.register(newUser,password);
     req.login(registerdUser,(err)=>{
        if(err){
          return next(err);
        }
       req.flash("success","Welcome to Wondalas ");
       res.redirect("/listing"); 
     });
   console.log(registerdUser);
   
  }catch(e){
     req.flash("error",e.message);
     res.redirect("/signup");
  }
};

 module.exports.renderloggenForm = (req,res)=>{
    res.render("users/login.ejs")
};

module.exports.logInForm =  async(req,res)=>{
    req.flash( "success","Welcome Back to Wondalast you are logged in")
    let redirectUrl = res.locals.redirectUrl || "/listing" ;
    res.redirect(redirectUrl);
};

module.exports.logOut =  (req,res ,next)=>{
   req.logout((err)=>{
      if(err){ 
       return next(err);
      }
     req.flash("success","You are Logged out now");
     res.redirect("/listing");
   })
};
