const listing = require("../Models/listing");


module.exports.index = async (req,res)=>{
   const Alllistings = await listing.find({}) ;
    res.render("listing/index.ejs",{Alllistings});
};

module.exports.renderNewForm = (req,res)=>{
  res.render("listing/new.ejs")
};

module.exports.showListing = async(req,res)=>{
  let {id} =  req.params ;
  const indata = await listing.findById(id)
  .populate( {path : "reviews",
    populate :{ 
      path : "author"
    },
   })
  .populate("owner");
   console.log(indata);
    if(!indata){ 
      req.flash("error", "List is not found");
         res.redirect("/listing");
    }
    else{
            res.render("listing/show.ejs",{indata});
    }
};

module.exports.createListing = async(req,res,next)=>{
     const newlisting =   new listing(req.body.listing);
     console.log(req.user);  
     newlisting.owner = req.user._id;
   await newlisting.save();  
    req.flash("success", "New listing is created");
   res.redirect("/listing");
 };

 module.exports.renderEditForm = async (req,res)=>{
   let{id} = req.params;
   const indata = await listing.findById(id);
   if(!indata){ 
       req.flash("error", "List is not found");
          res.redirect("/listing");
     }
     else{
     res.render("listing/edit.ejs",{indata});
     }
 
 };

 module.exports.updateListing = async (req,res)=>{
  if(!req.body.listing){
    throw new ExpressError(404,"Send Valid Data");
   }
  let{id} = req.params;
 await listing.findByIdAndUpdate(id,{...req.body.listing})
   req.flash("success", " listing  Updated");
   res.redirect(`/listing/${id}`);
};

module.exports.destroyListings = async(req,res)=>{
  let {id} = req.params;
  await listing.findByIdAndDelete(id);
   req.flash("success", " listing  Deleted");
  res.redirect("/listing")
};

