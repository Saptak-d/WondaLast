
const express = require("express");
const router = express.Router({mergeParams:true});
const WrapeAsync = require("../utils/wrapeAsync.js");
const ExpressError = require("../utils/expresserror.js");
const listing  =  require("../Models/listing.js"); 
const review  =  require("../Models/reviews.js");
const {isLoggedIn , isOwner , validateReview, isReviewAuthor} = require("../middleware.js");
const controllReview = require("../controllers/reviews.js");


// post reviews rout
router.post("/",
  isLoggedIn,
  validateReview,
  WrapeAsync(controllReview.createReview));
  

//delete review rout
router.delete("/:Review_id",
  isLoggedIn,
  isReviewAuthor,
  WrapeAsync (controllReview.destroyReview));


module.exports = router;