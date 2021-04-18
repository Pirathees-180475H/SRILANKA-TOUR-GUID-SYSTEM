const mongoose = require('mongoose');
const Review =require('./review')

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url:String,
    filename:String
})

ImageSchema.virtual('thumbnail').get(function(){
   return  this.url.replace('/upload','/upload/w_100')
})

const campgroundSchema = new Schema({
    title:String,
    price:Number,
    images:[
       ImageSchema
    ],
    description:String,
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
})


campgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})


const Campground = mongoose.model('Campground',campgroundSchema)

module.exports =Campground;