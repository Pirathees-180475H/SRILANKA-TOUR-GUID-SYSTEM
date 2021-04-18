//mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true})
        .then(()=>{
            console.log('Connected')
        })
        .catch((err)=>{
            console.log('Error')
        })
//

const Campground = require('../models/campground');
const cities = require('./cities');
const {descriptors,places} = require('./seedHealpers');

const sample = array =>array[Math.floor(Math.random()*array.length)];

const seedDB =async()=>{
    await Campground.deleteMany({});
    for(let i =0;i<5 ;i++){
        let rand = Math.floor(Math.random()*1000);
        const price= Math.floor(Math.random()*100)
        let newCamp = new Campground({
            title:`${sample(descriptors)} ${sample(places)}`,
            author:"60771f16a0b83d1188aef1ef",
            location:`${cities[rand].city}, ${cities[rand].state}`,
            description:'lorem a pts amke',
            price:price,
            images: [
                {
                  url: 'https://res.cloudinary.com/ptsdovpts/image/upload/v1618560519/YelpCamp/qn7qxls2wetbt4gcuojy.jpg',
                  filename: 'YelpCamp/qn7qxls2wetbt4gcuojy'
                },
                {
                  url: 'https://res.cloudinary.com/ptsdovpts/image/upload/v1618560520/YelpCamp/fn1t8ywjyxkb1sg0oh8w.jpg',
                  filename: 'YelpCamp/fn1t8ywjyxkb1sg0oh8w'
                }
              ]


        });
        await newCamp.save()
    }
   
}
seedDB().then(()=>mongoose.connection.close())