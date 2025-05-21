
const express = require("express");
const router = express.Router({mergeParams:true});
const WrapeAsync = require("../utils/wrapeAsync.js");
const ExpressError = require("../utils/expresserror.js");
const {ListingSchema , reviewSchema } = require("../schema.js");
const listing  =  require("../Models/listing.js"); 
const review  =  require("../Models/reviews.js"); 


const validateReview =  (req,res,next)=>{
  const  {error}  = reviewSchema.validate(req.body);
     if(error){
      let errormess = error.details.map((el)=>el.message).join(",")
      throw new ExpressError(400,errormess);
     }
     else{
      next();
     }
}



// post reviews rout
router.post("/",validateReview,WrapeAsync(async (req,res)=>{
   let Listing  = await listing.findById(req.params.id);
   let newrev = new review(req.body.review);
  Listing.reviews.push(newrev);
   await newrev.save();
   Listing.save();
   res.redirect(`/listing/${req.params.id}`);
}))

//delete review rout
router.delete("/:Review_id" ,WrapeAsync ( async (req,res)=>{
   let{id,Review_id} = req.params;
   await listing.findByIdAndUpdate(id,{$pull:{review:Review_id}});
   await review.findByIdAndDelete(Review_id); 
  res.redirect(`/listing/${id}`);
}));


module.exports = router;