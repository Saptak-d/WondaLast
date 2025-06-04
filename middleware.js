const listing  =  require("./Models/listing"); 
const Review  =  require("./Models/reviews.js"); 


const ExpressError = require("./utils/expresserror.js");
const {ListingSchema , reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) =>{
     if(!req.isAuthenticated()){
      //save the current user request rout
      req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req,res, next) =>{
     if(req.session.redirectUrl){
       res.locals.redirectUrl = req.session.redirectUrl;
     };
     next();
};

module.exports.isOwner = async (req,res,next)=> {
   let {id} =  req.params;
    let foundListing  = await listing.findById(id);
    
  if(!foundListing.owner.equals(res.locals.curuser._id)){
       req.flash("error", "You are not the Owner of this Listing ");
     return  res.redirect(`/listing/${id}`);
  };
   next();
}

module.exports.validatelisting =  (req,res,next)=>{
  const  {error}  = ListingSchema.validate(req.body);
     if(error){
      let errormess = error.details.map((el)=>el.message).join(",")
      throw new ExpressError(400,errormess);
     }
     else{
      next();
     }
};

module.exports.validateReview =  (req,res,next)=>{
  const  {error}  = reviewSchema.validate(req.body);
     if(error){
      let errormess = error.details.map((el)=>el.message).join(",")
      throw new ExpressError(400,errormess);
     }
     else{
      next();
     }
};

module.exports.isReviewAuthor = async(req,res,next)=> {
   let {id, Review_id} = req.params;
    let review  = await Review.findById(Review_id);
    
  if(!review.author.equals(res.locals.curuser._id)){
       req.flash("error", "You are not the author of this review ");

     return  res.redirect(`/listing/${id}`);
  };
   next();
};

