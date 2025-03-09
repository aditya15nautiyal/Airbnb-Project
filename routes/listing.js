const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

// Index Route - show all the possible listings
router.get(
    "/",
    wrapAsync(listingController.index)
);


//NEW - new and create route
//isLoggedIn middleware to check if logged in
router.get("/new",
    isLoggedIn,
    listingController.renderNewForm
);

//Create - creating a new listing
router.post(
    "/",
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing)
);

//Show Route - show details of a particular listing
router.get("/:id", wrapAsync(listingController.showListing));


//Edit and update Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

//Update Route
router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
);


//Delete Route
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
);


module.exports = router;