const Joi = require("joi");
const reviews = require("./Models/reviews");
module.exports.ListingSchema = Joi.object({
    listing : Joi.object({
     title : Joi.string().required(),
     description : Joi.string().required(),
     location : Joi.string().required(),
     country : Joi.string().required(),
      price  : Joi.number().required().min(0),
      category:Joi.string().required(),
      image  : Joi.string().allow("",null)
    }).required()
});


module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    Comment: Joi.string().required(),
  }).required()

})