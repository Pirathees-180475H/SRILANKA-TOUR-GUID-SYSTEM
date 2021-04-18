//env
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}


const express = require('express');
const app= express();
const path= require('path');

///error and catcher
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
//ejs mate and enjine
const ejsMate = require('ejs-mate');
app.engine('ejs',ejsMate);

app.listen(3000);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
//from data Handler
app.use(express.urlencoded({extended:true}))
//method override for Pathch,Dlete
var methodOverride = require('method-override')
app.use(methodOverride('_method'))

//passport for simple login
const passport =require('passport');
const LocalStrategy= require('passport-local');
const User = require('./models/user');

//session
const session = require('express-session');

//flash
const flash= require('connect-flash');

//mongoose
const mongoose = require('mongoose');

///session for deployment 
const MongoDBStore = require("connect-mongo")(session);

//const Atlas = process.env.DB_Url
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//mongo as session manager
const store= new MongoDBStore({
    url:"mongodb://localhost:27017/yelp-camp",
    secret:'this is secret ',
    touchAfter :24 *60 *60
})
store.on('error',function (e) {
    console.log('session Error',e)
})

//session local server setup, later we can use in production like redis
const sessionConfig ={
    store,
    secret :'thisshouldbeaSecret!',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now() +1000*60*60*24*7,
        maxAge: 1000*60*60*24*7 // it determines how long can be stay without login
    }

}

app.use(session(sessionConfig));
app.use(flash())

//after session config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleWare for flash and global
app.use((req,res,next)=>{
    res.locals.currentUser =req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//routers
const campgroundRoute = require('./routes/campground')
const reviewRoute = require('./routes/review')
const userRoutes = require('./routes/users')

//routeHandlers
app.use('/',userRoutes)
app.use('/campground',campgroundRoute)
app.use('/campground/:id/review',reviewRoute);

//static assets
app.use(express.static(path.join(__dirname,'public')))

//Home Page



app.get('/',(req,res)=>{

    res.render('home')
})

///404 Error
//it s runs in very last End
app.all('*',(req,res,next)=>{
    next(new ExpressError(400,'PageNotFound'))
})

//error handler
app.use((err,req,res,next)=>{
    const {status=400,message ="common Error",stack}=err;
    res.status(status).render('error',{message,status,stack})
})