if(process.env.NODE_ENV!=='production'){
    require('dotenv').config()
}

// console.log(process.env.SECRTE);

const express=require('express');
const path=require('path');
const mongoose = require('mongoose');
const helmet = require('helmet');


// const { ppid } = require('process');
const methodOverride=require('method-override');
const engine=require('ejs-mate');

const session=require('express-session');
const MongoStore = require('connect-mongo');

const ExpressError = require('./utilities/ExpressError');

const campgroundsRoute=require('./routes/campgrounds');
const reviewsRoute=require('./routes/reviews');
const userRoutes=require('./routes/users');

const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');


//mongoose connect------------------------------------------------
// const dbUrl=process.env.DB_URL;
const dbUrl=process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
// mongodb://localhost:27017/yelp-camp
mongoose.connect(dbUrl)
.then(()=>{
    console.log('database connected')
}).catch((err)=>{
    console.log(`there is an error ${err}`);
})
//express configure-----------------------------------------------
const app=express();
app.engine('ejs', engine);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))


app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
//we are telling Express to serve our public directory.
app.use(express.static(path.join(__dirname,'public')));  


//----------------------------------------------------------
//session configure

const secret=process.env.SECRET || 'thisshouldbebettersecret!';
const store=MongoStore.create({
    mongoUrl:dbUrl,
    secret,
    touchAfter:24 * 60 * 60,
})

store.on("error",function(e){
    console.log("SEESION STORE ERROR",e)
})

const sessionConfig={
    store,
    name:'wys',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,  //it would expire after one week,there is a millionseconds
        maxAge:1000*60*60*24*7,
    }
}
// 一定要注意顺序，否则会有err
app.use(session(sessionConfig));
app.use(flash());
// app.use(helmet());
/*app.use(session())在app.use(flash())前边，app.use(flash())在app.use(app.router)前边，
这三个顺序正确了，基本就没有什么问题了*/
app.use(helmet({ crossOriginEmbedderPolicy: false }));

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dr60njtjy/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dr60njtjy/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/dr60njtjy/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/dr60njtjy/" ];
 
app.use(
    helmet.contentSecurityPolicy({
        directives : {
            defaultSrc : [],
            connectSrc : [ "'self'", ...connectSrcUrls ],
            scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
            styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
            workerSrc  : [ "'self'", "blob:" ],
            objectSrc  : [],
            imgSrc     : [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dr60njtjy/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/"
            ],
            fontSrc    : [ "'self'", ...fontSrcUrls ],
            mediaSrc   : [ "https://res.cloudinary.com/dr60njtjy/" ],
            childSrc   : [ "blob:" ]
        }
    })
);


//                 "https://res.cloudinary.com/dr60njtjy/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
//                 "https://images.unsplash.com/",


//-----------------------passport configure--------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());

//flash should put before router handlers
app.use((req,res,next)=>{
    console.log(req.session);  // to check what is going on
    res.locals.currentUser=req.user;    // to put currentUser in navbar, to check the web status
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

//====================================
//   EXPRESS ROUTE HANDLER
//====================================

// 将路由套用至应用程式
app.use('/',userRoutes);
app.use('/campgrounds',campgroundsRoute);
//NESTED ROUTE
app.use('/campgrounds/:id/reviews',reviewsRoute);


app.get('/',(req,res)=>{
    res.render('home');
})

//----------------------------------------------------------
//Error Handler

app.all('*',(req,res,next)=>{
    next(new ExpressError('page not found',404));
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message="Something went wrong".toUpperCase();
    console.log('trigger error handler');
    // console.dir(err)
    // console.log(`THERE IS AN ERROR ${err.message} ${err}`);
    res.status(statusCode).render('errors',{err});
})

const port=process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`you are listening to ${port} !!! ${Date()}`)
})