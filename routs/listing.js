const express = require("express");
const router = express.Router();
const WrapeAsync = require("../utils/wrapeAsync.js");
const ExpressError = require("../utils/expresserror.js");
const {ListingSchema , reviewSchema } = require("../schema.js");

const listing  =  require("../Models/listing.js"); 



const validatelisting =  (req,res,next)=>{
  const  {error}  = ListingSchema.validate(req.body);
     if(error){
      let errormess = error.details.map((el)=>el.message).join(",")
      throw new ExpressError(400,errormess);
     }
     else{
      next();
     }
}
router.get("/", WrapeAsync (async (req,res)=>{
   const Alllistings = await listing.find({}) ;
    res.render("listing/index.ejs",{Alllistings});
}));

// New rout 
router.get("/new",(req,res)=>{
  res.render("listing/new.ejs")
});

//show rout 
router.get("/:id", WrapeAsync(async (req,res)=>{
  let {id} =  req.params ;
  const indata = await listing.findById(id).populate("reviews");
   res.render("listing/show.ejs",{indata});
}));

//create rout 
 router.post("/",validatelisting,WrapeAsync(async(req,res,next)=>{
     
     const newlisting =   new listing(req.body.listing);
   await newlisting.save();
   console.log("new data is saved");
   res.redirect("/listing")
  
 }));

//Edit rout
router.get("/:id/edit", WrapeAsync (async (req,res)=>{
  let{id} = req.params;
  const indata = await listing.findById(id);
    res.render("listing/edit.ejs",{indata});

}));

//update rout 
router.put("/:id", validatelisting, WrapeAsync(async (req,res)=>{
  if(!req.body.listing){
    throw new ExpressError(404,"Send Valid Data");
   }
  let{id} = req.params;
 await listing.findByIdAndUpdate(id,{...req.body.listing})
 res.redirect(`/listing/${id}`);

}));

// delete rout
router.delete("/:id", WrapeAsync(async(req,res)=>{
  let {id} = req.params;
  await listing.findByIdAndDelete(id);
  res.redirect("/listing")
}));

 
module.exports =  router ;