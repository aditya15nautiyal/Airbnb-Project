const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");


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
router.get("/new", (req, res) => {
    console.log("Creating a new listing");
    res.render("listings/new.ejs");
});

//Create - creating a new listing
router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res) => {
        const newEntry = new Listing(req.body.listing);
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
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        res.redirect("/listings");
    }
    console.log("Displaying listing with id: " + id);
    res.render("listings/show.ejs", { listing });
}));


//Edit and update Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

router.put("/:id",
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        console.log("Successfully updated the listing with id: " + id);
        req.flash("success", "Updated the listing!");
        res.redirect(`/listings/${id}`);
    }));


//Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    console.log(listing);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
}));


module.exports = router;