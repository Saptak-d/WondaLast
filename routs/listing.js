const express = require("express");
const router = express.Router();
const WrapeAsync = require("../utils/wrapeAsync.js");
const listing  =  require("../Models/listing.js"); 
const {isLoggedIn , isOwner , validatelisting} = require("../middleware.js");
const { populate } = require("../Models/reviews.js");
const listingControlers = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../CloudConfig.js");
const wrapeAsync = require("../utils/wrapeAsync.js");
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
// Search route — put this BEFORE :id route
router.get("/search", async (req, res) => {
    let query = req.query.q;
    console.log("Query received:", query);

    const words = query.split(" ").filter(word => word);
    const allRegexConditions = [];

    for (const word of words) {
        allRegexConditions.push({ title: { $regex: word, $options: 'i' } });
        allRegexConditions.push({ location: { $regex: word, $options: 'i' } });
        allRegexConditions.push({ country: { $regex: word, $options: 'i' } });
    }

    // Now we fetch full objects, no .select('_id')
    const Alllistings = await listing.find({
        $or: allRegexConditions
    });

    console.log("Matching Listings:", Alllistings);
    
    if (Alllistings.length > 0) {
        // Here instead of redirecting, you can render a template, or return as JSON
         res.render("listing/index", { Alllistings });
    } else {
        req.flash("error" , "No Hotel is found");
        res.redirect("/listing");
    }
});



// Route for individual listings (AFTER search route)
router.get("/:id", WrapeAsync(listingControlers.showListing));


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

router.get("/type/:is",wrapeAsync(listingControlers.SpecificType));


//Edit rout
router.get("/:id/edit",
   isLoggedIn,
   isOwner,
   WrapeAsync(listingControlers.renderEditForm));
    

 
module.exports =  router ;