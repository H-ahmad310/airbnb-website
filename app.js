if(process.env.NODE_ENV !="production"){
require("dotenv").config();
};

const mongoose=require("mongoose");
const path=require("path");
const methodoverride=require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError=require("./utils/ExpressError.js");
const User=require("./models/user.js");
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js"); 
const express=require("express");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app=express();
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const { config } = require("dotenv");

const dbUrl=process.env.ATLASDB_URL;
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err)
});
async function main() {
  await mongoose.connect(dbUrl);
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// app.get("/",(req,res)=>{
//     res.send("hi i am root")
// });


//session 


const store= MongoStore.create({
     mongoUrl:dbUrl,
     crypto:{
        secret:process.env.SECRET,
     },
     touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
     expires:Date.now() +   7 * 24 * 60 * 60 * 1000,
     maxAge: 7 * 24 * 60 * 60 * 1000,
     httpOnly:true,
    }
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use( new LocalStrategy(User.authenticate()));
//is ka matlab ya ha k passport k andar hum ny jo local stratigy use ki ha wo authenticate honi chahyia
//or authentication ka matlab ya ha k user ko login ya sign up karwana 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    // console.log( res.locals.success);
    next();
});

// app.get("/demouser",async(req,res)=>{
//  const fakeUser= new User({
//     email:"student@gmail.com",
//     username:"delta-student",
//  });
// let registeruser= await User.register(fakeUser,"helloworld");
// res.send(registeruser)
// });


app.use("/listings",listingsRouter); 
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// app.get("/testListing",async(req,res)=>{
//  let sampleListing = new Listing({
//     title:"My New Villa",
//     description:"By the Beach",
//     price:1200,
//    location:"Lahore, Islamabad",
//     country:"Pakistan",
//  });

//   await sampleListing.save();
//   console.log("sample was savesd");
//   res.send("successful testing");
// });

app.all("*",(req,res,next)=>{
next(new ExpressError(404,"page not found!"));
});

app.use((err,req,res,next)=>{
  let {statusCode=500,message="some thing went wrong"}=err;
  // res.status(statusCode).send(message);
 res.status(statusCode=500).render("error.ejs",{message});
//  res.send("some thing went wrong");
}); 

app.listen(8000,()=>{
    console.log("server is listening on port");
});