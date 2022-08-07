const mongoose = require('mongoose');
const Review=require('./review');
const Schema=mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

const ImagesSchema=new Schema({
    url:String,
    filename:String,
})

ImagesSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
})

const CampgroundSchema=new Schema({
    title:String,
    images:[ImagesSchema],
    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    price: {
        type:Number,
        // required:true,
    },
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review',
        }
    ],
},opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    // console.log(this);
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong><br>
    <p>${this.description.substring(0,20)}...</p>`
})


CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.remove({
            _id:{$in:doc.reviews}
        })
    }
})





module.exports=mongoose.model('Campground',CampgroundSchema); 
