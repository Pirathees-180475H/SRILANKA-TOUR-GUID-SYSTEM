const Campground = require('../models/campground');

const mbxGeocoding= require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAP_BOX_TOKEN;
const geocoder =  mbxGeocoding({accessToken:mapBoxToken});


//delete clouiary also
const {cloudinary} = require('../cloudinary');


module.exports.index =async(req,res)=>{
    let Campgrounds = await Campground.find({});
    res.render('campground/index',{Campgrounds});

}

module.exports.NewForm=(req,res)=>{
    
    res.render('campground/new')
}

module.exports.CreateNewCamp=async(req,res,next)=>{
    const geoData =await  geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
   
    const {campground} = req.body;
    const newCamp = await new Campground({title:campground.title,location:campground.location,description:campground.description,price:campground.price})
    newCamp.images= req.files.map(file=>({url:file.path,filename:file.filename}));
    newCamp.geometry=geoData.body.features[0].geometry

    newCamp.author= req.user._id; //by passport // req.user give current user
    newCamp.save();
    req.flash('success','SucessFully Added CampGround') //before reDirect
    res.redirect(`campground/${newCamp.id}`) 

}

module.exports.ShowSpecificCamp=async(req,res)=>{
    //populate Camp author and review Autor
    let campground =await Campground.findById(req.params.id)
    .populate({
      path:'reviews',
      populate:{
        path:'author'
    }})
    .populate('author'); // campground author
    if(!campground){
      req.flash('error','CampGround Not Found');
     return  res.redirect('/campground')
    }
    res.render('campground/show',{campground})
}

module.exports.RenderEditForm=async(req,res)=>{
    let campground = await Campground.findOne({_id:req.params.id});
    res.render('campground/edit',{campground})
}

module.exports.EditCamp=async(req,res)=>{
    const {campground} = req.body;
    console.log(req.body)
    const newImages = req.files.map(file=>({url:file.path,filename:file.filename}))
    const camp =await Campground.findOneAndUpdate({_id:req.params.id} ,{title:campground.title,location:campground.location,description:campground.description,price:campground.price})
    camp.images.push(...newImages);
    await camp.save()

    if(req.body.deleteImages){
        //delete in cloud
        for(let filename of req.body.deleteImages){
           await  cloudinary.uploader.destroy(filename)
        }
        //delete in mongo
        await camp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash('success','SucessFully Updated CampGround') //before reDirect
    res.redirect(`/campground/${req.params.id}`)
    //also can add postman protection see 517
}

module.exports.DeleteCamp=async(req,res)=>{
    await Campground.findOneAndDelete({_id:req.params.id}); // it call next middleware that is on model
    req.flash('success','SucessFully Deleted CampGround') //before reDirect
    res.redirect('/campground')
}