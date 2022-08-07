//run this file on its own seperately from our node at any time 
//we want to seed our database,replace new campgrounds
const mongoose = require('mongoose');
const cities=require('./cities');
const {places,descriptors}=require('./seedHelpers')
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(()=>{
    console.log('database connected')
}).catch((err)=>{
    console.log(`there is an error ${err}`);
})

//sample funtion,产生随机数----------------------------------------
const sample=((array)=>{
    return array[Math.floor(Math.random()*array.length)]
})

//removing everything from the database 替换原有的所有数据------------------------
const seedDB= async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            // your user ID
            author:'624de75a1bc63af36d5e7104',
            geometry:{ "type" : "Point", 
                       "coordinates" : [ cities[random1000].longitude,
                                        cities[random1000].latitude] },
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image:'https://source.unsplash.com/collection/483251',
            description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita sed eius libero consectetur, sunt tenetur asperiores aut nulla, iusto blanditiis ab! Dolorum maiores placeat est ipsam. Saepe earum sit numquam?',
            price,
            images:[
                {
                    url: 'https://res.cloudinary.com/dr60njtjy/image/upload/v1649437538/YelpCamp/y68cm8pjiglvkcvgykrj.jpg',
                    filename: 'YelpCamp/atzsveosz83brzntexhm'
                },
                {
                    url: 'https://res.cloudinary.com/dr60njtjy/image/upload/v1649373894/YelpCamp/sa5lweiiuehsfnkwfsgh.jpg',
                    filename: 'YelpCamp/jfgvz23ok8gqonkop4as'  
                }
            ],
        })
        await camp.save();
    }
}

//执行程序-----------------------------------------------------
seedDB().then(()=>{
    mongoose.connection.close();
}).catch(err=>{
    console.log(`there is an error ${err}`);
})