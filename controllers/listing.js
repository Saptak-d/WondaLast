const Listing = require("../Models/listing");  // ✅ Correct import
const axios = require('axios');
const accessToken = process.env.map_apiKey;

module.exports.index = async (req, res) => {
    const Alllistings = await Listing.find({});
    res.render("listing/index.ejs", { Alllistings });
};
module.exports.SpecificType = async(req,res)=>{
    let{is} = req.params;
 const Alllistings = await Listing.find({category : is });
    res.render("listing/index.ejs",{ Alllistings });
}
module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const indata = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!indata) {
        req.flash("error", "List is not found");
        return res.redirect("/listing");
    }

    let latitude = null;
    let longitude = null;

    if (indata.geometry && indata.geometry.coordinates.length === 2) {
        longitude = indata.geometry.coordinates[0];
        latitude = indata.geometry.coordinates[1];
    }

    res.render("listing/show.ejs", { indata, latitude, longitude, curuser: req.user });
};


module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };

    const country = req.body.listing.country;
    const location = req.body.listing.location;
    const query = `${location}, ${country}`;

    const apiUrl = `https://us1.locationiq.com/v1/search.php?key=${accessToken}&q=${query}&format=json`;

    const response = await axios.get(apiUrl);
    const geoData = response.data[0];
    const { lat, lon } = geoData;

    newlisting.geometry.coordinates = [parseFloat(lon), parseFloat(lat)];

    await newlisting.save();
    req.flash("success", "New listing is created");
    res.redirect("/listing");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const indata = await Listing.findById(id);
    if (!indata) {
        req.flash("error", "List is not found");
        return res.redirect("/listing");
    } else {
        let originalimageurl = indata.image.url;
        originalimageurl = originalimageurl.replace("/upload", "/upload/h_100");
        res.render("listing/edit.ejs", { indata, originalimageurl });
    }
};


module.exports.updateListing = async (req, res) => {
    // Basic validation for listing data
    if (!req.body.listing) {
        throw new ExpressError(404, "Send Valid Data");
    }

    let { id } = req.params;

    // 1. Find the listing first. This is crucial for updating specific fields
    //    like image and geometry, and then saving the entire document.
    let uplisting = await Listing.findById(id);

    // Handle case where listing is not found
    if (!uplisting) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listing");
    }

    // 2. Update general listing details:
    // This will update fields like title, description, price, and *location*,
    // as well as *country* if they are part of req.body.listing.
    Object.assign(uplisting, req.body.listing);

    // 3. Handle Image Upload:
    // If a new file is uploaded, update the image details.
    if (typeof req.file !== "undefined") {
        uplisting.image = { url: req.file.path, filename: req.file.filename };
    }

    // 4. Handle Location Update (Geocoding with LocationIQ):
    // Check if the 'location' or 'country' fields were updated in the form.
    // If they were, we need to re-geocode the new location.
    // Ensure req.body.listing.location exists, as it's the primary query component.
    if (req.body.listing.location) {
        try {
            const country = req.body.listing.country || uplisting.country; // Use new country or existing one
            const location = req.body.listing.location;
            const query = `${location}, ${country}`;

            // Construct the LocationIQ API URL
            const apiUrl = `https://us1.locationiq.com/v1/search.php?key=${accessToken}&q=${query}&format=json`;

            // Make the API call to LocationIQ
            const response = await axios.get(apiUrl);

            // LocationIQ returns an array of results. We usually take the first one.
            if (response.data && response.data.length > 0) {
                const geoData = response.data[0];
                const { lat, lon } = geoData;

                // Update the geometry field with the new coordinates
                // LocationIQ gives (lat, lon), but GeoJSON standard is [longitude, latitude]
                // So, it's [parseFloat(lon), parseFloat(lat)] as you correctly did in createListing.
                uplisting.geometry.coordinates = [parseFloat(lon), parseFloat(lat)];
                uplisting.geometry.type = 'Point'; // Ensure type is 'Point'
            } else {
                console.warn(`LocationIQ geocoding failed for: ${query}. No features found.`);
                // Optionally: provide user feedback, or clear geometry if desired
                req.flash("error", "Could not find exact coordinates for the new location. Map might not be accurate.");
                // uplisting.geometry.coordinates = [0, 0]; // Example: Reset to default if geocoding fails
            }
        } catch (e) {
            console.error("LocationIQ API error during update:", e.message);
            req.flash("error", "Error processing location data. Please try again.");
            // Handle API errors gracefully (e.g., network issues, invalid token)
        }
    }

    // 5. Save the updated listing to the database (including potentially new image and geometry)
    await uplisting.save();

    req.flash("success", "Listing Updated");
    res.redirect(`/listing/${id}`);
};
module.exports.destroyListings = async(req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
   req.flash("success", " listing  Deleted");
  res.redirect("/listing")
};

