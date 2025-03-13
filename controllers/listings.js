const Listing = require("../models/listing");

// Index Route - show all the possible listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    console.log("Displaying all listings");
    res.render("listings/index.ejs", { allListings });
}


module.exports.renderNewForm = (req, res) => {
    // console.log("Creating a new listing");
    res.render("listings/new.ejs");
};


module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    // multer parses the form's file data and stores it in req.file
    const newEntry = new Listing(req.body.listing);
    // passport stores the user details in req.user
    // so we can use req.user._id to get the user details
    newEntry.owner = req.user._id;
    newEntry.image = { url, filename };
    await newEntry.save();
    console.log("Successfully saved new entry!");
    console.log(newEntry);
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
};


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    // using populate(reviews) to insert all reviews in the listing instead of their ids
    //using populate(owner) to insert the owner details also
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        res.redirect("/listings");
    }
    console.log("Displaying listing with id: " + id);
    res.render("listings/show.ejs", { listing });
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    console.log("Successfully updated the listing with id: " + id);
    req.flash("success", "Updated the listing!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    console.log(listing);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
};
