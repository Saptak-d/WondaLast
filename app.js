
if(process.env.NODE_ENV != "production"){
 require('dotenv').config()
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing  =  require("./Models/listing.js"); 
const path = require("path");
app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
const methodOverride = require("method-override");;
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.engine("ejs" ,ejsMate);
app.use(express.static(path.join(__dirname,"public")));
const WrapeAsync = require("./utils/wrapeAsync.js");
const ExpressError = require("./utils/expresserror.js");
const {ListingSchema , reviewSchema } = require("./schema.js");
const review  =  require("./Models/reviews.js"); 
const wrapeAsync = require("./utils/wrapeAsync.js");
const listingsRouter  = require("./routs/listing.js")
const reviewsRouter = require("./routs/review.js")
const usersRouter = require("./routs/user.js")
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");




main().then(()=>{
    console.log("connected to DB")
}).catch(err=>{
  console.log("err");
});

async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/wondaelust');    
}

const sessionOption = ({
  secret : "Abac123",
  resave: false,
  saveUninitialized: true ,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 *60*1000,
    maxAge: 7 * 24 * 60 *60*1000,
    httpOnly : true
  }
})


app.use(session(sessionOption));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()) );

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/.well-known', (req, res) => {
    res.status(204).end();
});



app.use((req,res,next)=>{
  res.locals.success = req.flash("success")
  res.locals.error =  req.flash("error");
  res.locals.curuser = req.user;
  next();
});

// app.get("/demouser",async (req,res)=>{
//   let fakeUser = new User({
//     email : "spatk22@gmai.com",
//     username : "delta-student",
//   });
//   const registerdUser = await User.register(fakeUser, "helloworld");
//   console.log(registerdUser);
// })



app.use("/listing",listingsRouter);

app.use("/listing/:id/reviews",reviewsRouter);
app.use("/",usersRouter)


app.use((req,res,next)=>{
  next( new ExpressError(404,"page is not found"));
})

//error handler
app.use((err,req,res,next)=>{
  const { status = 500, message = "Something went wrong" } = err;
  console.log(err)
  res.status(status).render("listing/eerror.ejs",{err});
})



app.listen(8080,()=>{
     console.log("server is listinig is port 8080");
})
