const Listing=require("./models/listing.js");
const reviews = require("./models/reviews.js");
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");

module.exports.isLoggedIn= async(req,res,next)=>{
    if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","you must be logged in to create listing");
    return res.redirect("/login");
  }
  next();
};


module.exports.saveRedirectUrl= async(req,res,next)=>{
  if(req.session.redirectUrl){
     res.locals.redirectUrl=req.session.redirectUrl
  }
  next();
};

module.exports.isOwner= async(req,res,next)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
  req.flash("error","you are not the owner of this listing");
 return res.redirect(`/listings/${id}`)
}
next();
};

module.exports.validatelisting= async(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
    throw new ExpressError(400,error);
    }
    else{
      next();
    };
};

module.exports.validreview= async(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);   
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errmsg);
    }
    else{
      next();
    };
};

module.exports.isreviewAuthor= async(req,res,next)=>{
  let {id,reviewsId}=req.params;
  let review=await reviews.findById(reviewsId);
  if(!review.author._id.equals(res.locals.currUser._id)){
  req.flash("error","you are not the author of this review");
 return res.redirect(`/listings/${id}`)
}
next();
};
