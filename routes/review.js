const express=require("express");
const router=express.Router({mergeParams:true});
const wrapasync=require("../utils/Wrapasync.js");
const reviewsController=require("../controllers/reviews.js");
const {isLoggedIn,validreview,isreviewAuthor}=require("../middleware.js");

//reviews 
//post route
// listings/:id/reviews

router.post("/",isLoggedIn,
    wrapasync(reviewsController.postReview)
);

//delete review route
// /listings
router.delete("/:reviewsId",
    isreviewAuthor,
    wrapasync(reviewsController.deleteReview)
);

module.exports=router;