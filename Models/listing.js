const mongoose = require("mongoose");
const Review = require("./reviews.js");
const { types } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true 
    },
    description: String,
    image: {
        url: String,
        filename: String   
    },
    price: Number,
    location: String,
    country: String,
    geometry: {      
        type: {
            type: String,
            enum: ['Point'],  // GeoJSON type
            default: 'Point'
        },
        coordinates: {
            type: [Number],   // [longitude, latitude]
            default: [0, 0]
        }
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
       type :String,
       enum : ["Trending","Mountain","Room","iconicCites" ,"Castles","AmazingPools" ,"Camping" ,"Farms","Arctic","Domes","Boats"]
    },
});

// Cascade delete reviews when listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    } 
});

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;
