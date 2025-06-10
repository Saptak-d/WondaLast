const express = require("express");
const router = express.Router();
const WrapeAsync = require("../utils/wrapeAsync.js");
const listing  =  require("../Models/listing.js"); 
const {isLoggedIn , isOwner , validatelisting} = require("../middleware.js");
const { populate } = require("../Models/reviews.js");
const listingControlers = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../CloudConfig.js")
const upload = multer({storage});
  
router
.route("/")
.get( WrapeAsync(listingControlers.index))
.post(
  isLoggedIn,
  validatelisting,
  upload.single('listing[image]'),
  WrapeAsync(listingControlers.createListing));

//new rout
router.get("/new",isLoggedIn,listingControlers.renderNewForm);

router
.route("/:id")
.get(WrapeAsync(listingControlers.showListing))
.put(
  isLoggedIn,//middleware for checking requested user is already logged in or not 
  isOwner,
  upload.single('listing[image]'),
  validatelisting,
   WrapeAsync(listingControlers.updateListing))
.delete(
  isLoggedIn,
  isOwner,
  WrapeAsync(listingControlers.destroyListings));


//Edit rout
router.get("/:id/edit",
   isLoggedIn,
   isOwner,
   WrapeAsync(listingControlers.renderEditForm));
    

 
module.exports =  router ;