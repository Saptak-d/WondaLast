const express = require("express");
const router = express.Router();
const WrapeAsync = require("../utils/wrapeAsync.js");
const listing  =  require("../Models/listing.js"); 
const {isLoggedIn , isOwner , validatelisting} = require("../middleware.js");
const { populate } = require("../Models/reviews.js");



router.get("/", WrapeAsync (async (req,res)=>{
   const Alllistings = await listing.find({}) ;
    res.render("listing/index.ejs",{Alllistings});
}));

// New rout 
router.get("/new", isLoggedIn,(req,res)=>{
  res.render("listing/new.ejs")
});

//show rout 
router.get("/:id", WrapeAsync(async (req,res)=>{
  let {id} =  req.params ;
  const indata = await listing.findById(id)
  .populate( {path : "reviews",
    populate :{ 
      path : "author"
    },
   })
  .populate("owner");
   console.log(indata);
    if(!indata){ 
      req.flash("error", "List is not found");
         res.redirect("/listing");
    }
    else{
            res.render("listing/show.ejs",{indata});
    }
}));

//create rout 
 router.post("/",validatelisting,WrapeAsync(async(req,res,next)=>{
     const newlisting =   new listing(req.body.listing);
     console.log(req.user);  
     newlisting.owner = req.user._id;
   await newlisting.save();  
    req.flash("success", "New listing is created");
   res.redirect("/listing");
 }));

//Edit rout
router.get("/:id/edit",
   isLoggedIn,
   isOwner,
   WrapeAsync (async (req,res)=>{
  let{id} = req.params;
  const indata = await listing.findById(id);
  if(!indata){ 
      req.flash("error", "List is not found");
         res.redirect("/listing");
    }
    else{
    res.render("listing/edit.ejs",{indata});
    }

}));

//update rout 
router.put("/:id", 
  isLoggedIn,//middleware for checking requested user is already logged in or not 
  isOwner,
  validatelisting,
   WrapeAsync(async (req,res)=>{
  if(!req.body.listing){
    throw new ExpressError(404,"Send Valid Data");
   }
  let{id} = req.params;
 await listing.findByIdAndUpdate(id,{...req.body.listing})
   req.flash("success", " listing  Updated");
   res.redirect(`/listing/${id}`);

}));

// delete rout
router.delete("/:id", 
  isLoggedIn,
  isOwner,
  WrapeAsync(async(req,res)=>{
  let {id} = req.params;
  await listing.findByIdAndDelete(id);
   req.flash("success", " listing  Deleted");
  res.redirect("/listing")
}));

 
module.exports =  router ;