const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");


const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// Index Route - show all the possible listings
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    console.log("Displaying all listings");
    res.render("listings/index.ejs", { allListings });
}));


//NEW - new and create route
//isLoggedIn middleware to check if logged in
router.get("/new", isLoggedIn, (req, res) => {
    // console.log("Creating a new listing");
    res.render("listings/new.ejs");
});

//Create - creating a new listing
router.post(
    "/",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res) => {
        const newEntry = new Listing(req.body.listing);
        // passport stores the user details in req.user
        // so we can use req.user._id to get the user details
        newEntry.owner = req.user._id;
        await newEntry.save();
        console.log("Successfully saved new entry!");
        console.log(newEntry);
        req.flash("success", "Successfully created a new listing!");
        res.redirect("/listings");
    })
);

//Show Route - show details of a particular listing
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    // using populate(reviews) to insert all reviews in the listing instead of their ids
    //using populate(owner) to insert the owner details also
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        res.redirect("/listings");
    }
    console.log("Displaying listing with id: " + id);
    res.render("listings/show.ejs", { listing });
}));


//Edit and update Route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//Update Route
router.put("/:id",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        console.log("Successfully updated the listing with id: " + id);
        req.flash("success", "Updated the listing!");
        res.redirect(`/listings/${id}`);
    }));


//Delete Route
router.delete("/:id", isLoggedIn,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findByIdAndDelete(id);
        console.log(listing);
        req.flash("success", "Successfully deleted the listing!");
        res.redirect("/listings");
    }));


module.exports = router;