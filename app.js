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
const listings  = require("./routs/listing.js")
const reviews = require("./routs/review.js")
const session = require("express-session");
const flash = require("connect-flash");

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
app.get("/",(req,res)=>{
    res.send("hi am the root");
});

//middleware to store flash message

app.use(session(sessionOption));

app.use(flash());


////middleware to store flash message

app.use((req,res,next)=>{
  res.locals.success = req.flash("success")
  res.locals.error =  req.flash("error");
  next();
})


app.use("/listing",listings);

app.use("/listing/:id/reviews",reviews);


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
