const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const reviews = require("./reviews.js");
const { required } = require("joi");
const listingSchema=new mongoose.Schema({

    title:{
      type:String,
      required:true,
    },

    description:{
        type:String,
    },

    image:{
       url:String,
       filename:String,
    },

       price:Number,
       location:String,
       country:String,
       reviews:[
        {
          type:Schema.Types.ObjectId,
          ref:"reviews",
        }

       ],
       owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
       },

      //  geometry:{
      //   type:{
      //     type:String,
      //     enum:['Point'],
      //     required:true
      //   },
      //   coordinates:{
      //   type:[Number],
      //   required:true
      //   }
      // },

      geometry: {
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: [Number]   // sirf array likh do
}



      //  category:{
      //   type:String,
      //   enum:["mountains","arctic","farms","deserts"]
      //  },

});

listingSchema.post("findOneAndDelete",async(Listing)=>{
  if(Listing){
    await reviews.deleteMany({_id:{$in:Listing.reviews}})
  }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;

// module.exports=mongoose.model('Listing',listingSchema);