const express =  require("express");
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


main().then(()=>{
    console.log("connected to DB")
}).catch(err=>{
  console.log("err");
});

 
async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/wondaelust');    
}

// validation for listinf form serverside 

//validation for  reviem form serverside 



app.use("/listing",listings);
app.use("/listing/:id/reviews",reviews);



app.get("/",(req,res)=>{
    res.send("hi am the root");
});
//

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
