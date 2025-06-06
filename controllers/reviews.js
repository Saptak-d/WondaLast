const listing = require("../Models/listing.js")
const review  =  require("../Models/reviews.js");


module.exports.createReview = async (req,res)=>{
   let Listing  = await listing.findById(req.params.id);
   let newrev = new review(req.body.review);
    newrev.author = req.user._id ;
     console.log(newrev);
  Listing.reviews.push(newrev);
   await newrev.save();
   Listing.save();
     req.flash("success", " new review created");
   res.redirect(`/listing/${req.params.id}`);
};

module.exports.destroyReview =  async (req,res)=>{
   let{id,Review_id} = req.params;
   await listing.findByIdAndUpdate(id,{$pull:{review:Review_id}});
   await review.findByIdAndDelete(Review_id); 
        req.flash("success", "  review Deleted");
  res.redirect(`/listing/${id}`);
};
