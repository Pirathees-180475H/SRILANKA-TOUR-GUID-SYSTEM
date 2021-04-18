//joi validator
const Joi = require('joi')


module.exports.ValcampgroundSchema =Joi.object({
    campground:Joi.object({
        title:Joi.string().required(),
        price:Joi.number().required().min(10),
      //  image:Joi.string().required(),
        location:Joi.string().required(),
        description:Joi.string().required()

    }).required(),
    deleteImages:Joi.array()
})

module.exports.ValReviewSchema =Joi.object({
    review:Joi.object({
        body:Joi.string().required(),
        rating:Joi.number().required(),
    }).required()
})