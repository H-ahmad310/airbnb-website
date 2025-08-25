const reviews=require("../models/reviews.js");
const Listing=require("../models/listing.js");

module.exports.postReview=async(req,res)=>{
 let listing=await Listing.findById(req.params.id);
 let newreviews=new reviews(req.body);
 newreviews.author=req.user._id;
 listing.reviews.push(newreviews);
 await newreviews.save();
 await listing.save();
 req.flash("success","New review created!");
 res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview=async(req,res)=>{
let {id,reviewsId}=req.params;
await Listing.findByIdAndUpdate(id,{$pull:{review:reviewsId}});
await reviews.findByIdAndDelete(reviewsId);
req.flash("success","review Deleted!")
res.redirect(`/listings/${id}`);
}