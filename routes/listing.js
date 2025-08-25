const Listing = require("../models/listing");
const express=require("express");
const router=express.Router();
const wrapasync=require("../utils/Wrapasync.js");
const {isLoggedIn, isOwner,validatelisting}=require("../middleware.js")
const listingController=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});

// New rout 
// /listings
router.get("/new", isLoggedIn,
(listingController.randerNewForm) );


/*index route
//create route
// listings
//  */

// router.get("/search", 


router.
route("/")
.get(listingController.randersearchlisting)
.get(wrapasync(listingController.index))
.post(isLoggedIn,
upload.single("listing[image]")
,wrapasync(listingController.
randerCreateListing));


// .post(upload.single("listing[image]"),(req,res)=>{
//   res.send(req.file)
// });


  /*
show and update route and delete route
/listings */

router.
route("/:id")
.get(
wrapasync(listingController.randerShowListing))
.put(
  isLoggedIn,
  isOwner , 
  upload.single("listing[image]"),
  validatelisting,
  wrapasync( listingController.randerUpdateListing))
.delete(
  isLoggedIn, 
  isOwner,
  wrapasync( listingController.randerDeleteListing))


//edit rout
// /listings
router.get("/:id/edit", 
  isLoggedIn,
  isOwner ,
  wrapasync(listingController.randerEditListing)
);

module.exports=router;