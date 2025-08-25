const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

// index rout
// listings
module.exports.index=async(req,res)=>{
  res.render("listings/index.ejs",{allListings});
};
  
module.exports.randersearchlisting=async (req, res) => {
  const c = req.query.c;
  let listings = [];

  if (c && c.length > 0) {
    listings = await Listing.find({
      country: { $regex: c, $options: "i" }
    });
  } else {
    listings = await Listing.find({});
  }

  res.render("listings/index", { allListings: listings, c });
};


module.exports.randerNewForm=(req,res)=>{
  res.render("listings/new.ejs")
};

module.exports.randerShowListing=async(req,res)=>{
  let {id}=req.params;
  const listing = await Listing.findById(id)
  .populate({path:'reviews',populate:{path:'author'}})
  .populate('owner');
  console.log(JSON.stringify(listing.reviews,null,2));
  if(!listing){
  req.flash("error","Listing you requested for does not exist");
  }
  console.log(listing)
  res.render("listings/show.ejs",{listing});
};

module.exports.randerCreateListing=async(req,res)=>{
  let response=await  geoCodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
})
  .send()

    const url=req.file.path;
    const filename=req.file.filename;
    console.log(url ,".." ,filename);
    const newlisting= new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    newlisting.geometry=response.body.features[0].geometry;
    console.log("Geo response:", response.body.features[0].geometry);
    let savedlisting=await newlisting.save();
    console.log(savedlisting);
    req.flash("success","New Listing created!");
    res.redirect("/listings");
};

module.exports.randerEditListing=async(req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    if(!listing){
    req.flash("error","Listing you requested for does not exist");
    res.redirect("/listings")
  }
    let originalimageurl=listing.image.url;
    originalimageurl=originalimageurl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{listing,originalimageurl});
};

module.exports.randerUpdateListing=async(req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if (typeof req.file !=="undefined"){
    const url=req.file.path;
    const filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`);
};

module.exports.randerDeleteListing=async(req,res)=>{
  let {id}=req.params;
  let deleteListing =await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success","New Listing Deleted!")
  res.redirect("/listings");
};